import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const AI_GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  const url = new URL(req.url);
  const pathParts = url.pathname.split("/").filter(Boolean);
  const action = pathParts[1] || "";

  try {
    if (action === "upload" && req.method === "POST") {
      return await handleUpload(req, supabase);
    }
    if (action === "subjects" && req.method === "GET") {
      return await handleListSubjects(supabase);
    }
    if (action === "analytics") {
      const subject = decodeURIComponent(pathParts[2] || "");
      const subAction = pathParts[3] || "frequencies";
      return await handleAnalytics(supabase, subject, subAction, url.searchParams);
    }
    if (action === "notes") {
      const subject = decodeURIComponent(pathParts[2] || "");
      const topicName = pathParts[3] ? decodeURIComponent(pathParts[3]) : null;
      return await handleNotes(subject, topicName, url.searchParams, supabase);
    }
    if (action === "youtube") {
      const subAction = pathParts[2] || "";
      if (subAction === "search") {
        return await handleYouTubeSearch(url.searchParams);
      }
      const subject = decodeURIComponent(subAction);
      const topicName = pathParts[3] ? decodeURIComponent(pathParts[3]) : null;
      return await handleYouTube(supabase, subject, topicName, url.searchParams);
    }

    return jsonResponse({ error: "Not found" }, 404);
  } catch (e) {
    console.error("exam-prep error:", e);
    return jsonResponse(
      { error: e instanceof Error ? e.message : "Unknown error" },
      500
    );
  }
});

function jsonResponse(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

// ─── UPLOAD HANDLER ───────────────────────────────────────────────────────────
async function handleUpload(req: Request, supabase: any) {
  const formData = await req.formData();
  const file = formData.get("file") as File;
  const subject = formData.get("subject") as string;
  const year = parseInt(formData.get("year") as string);

  if (!file || !subject || !year) {
    return jsonResponse({ error: "file, subject, and year are required" }, 400);
  }

  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  if (!LOVABLE_API_KEY) {
    return jsonResponse({ error: "AI not configured" }, 500);
  }

  // Convert PDF to base64 for AI processing
  const arrayBuffer = await file.arrayBuffer();
  const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));

  // Use Gemini to extract questions from the PDF
  console.log("Extracting questions from PDF via AI...");
  const questions = await extractQuestionsFromPdfAI(base64, subject, LOVABLE_API_KEY);

  if (questions.length === 0) {
    return jsonResponse(
      { error: "No questions could be extracted from the PDF. Ensure it contains exam questions." },
      422
    );
  }

  console.log(`Extracted ${questions.length} questions from PDF`);

  // Save questions to DB
  const questionRows = questions.map((q: string, i: number) => ({
    subject,
    year,
    question_text: q,
    question_number: i + 1,
    source_pdf: file.name,
  }));

  const { data: savedQuestions, error: insertErr } = await supabase
    .from("exam_questions")
    .insert(questionRows)
    .select("id, question_text");

  if (insertErr) throw new Error(`DB insert failed: ${insertErr.message}`);

  // Extract topics via AI
  let totalTopics = 0;
  let failed = 0;

  for (const q of savedQuestions) {
    try {
      const topics = await extractTopicsAI(q.question_text, subject, LOVABLE_API_KEY);
      if (topics.length > 0) {
        const topicRows = topics.map((t: any) => ({
          question_id: q.id,
          name: t.name,
          subject,
          confidence: t.confidence || 0.8,
        }));
        await supabase.from("exam_topics").insert(topicRows);
        totalTopics += topics.length;
      }
    } catch {
      failed++;
    }
  }

  return jsonResponse({
    status: "success",
    subject,
    year,
    source_pdf: file.name,
    questions_saved: savedQuestions.length,
    topics_extracted: totalTopics,
    failed_extractions: failed,
  });
}

// ─── AI-BASED PDF QUESTION EXTRACTION ────────────────────────────────────────
async function extractQuestionsFromPdfAI(
  base64Pdf: string,
  subject: string,
  apiKey: string
): Promise<string[]> {
  const prompt = `You are an expert academic exam paper parser. Extract ALL individual questions from this exam paper PDF.

Subject: ${subject}

Instructions:
- Extract each question as a complete, standalone text
- Include the full question text including sub-parts (a, b, c, etc.)
- Remove question numbers from the beginning but keep the content intact
- Do NOT include instructions like "Answer any 5 questions" or headers
- Each question should be a meaningful academic question (at least 15 characters)

Return ONLY a valid JSON array of strings. No explanation, no markdown.
Example: ["What is polymorphism in OOP? Explain with example.", "Define normalization. Explain 1NF, 2NF and 3NF."]`;

  try {
    const resp = await fetch(AI_GATEWAY, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: prompt },
              {
                type: "image_url",
                image_url: {
                  url: `data:application/pdf;base64,${base64Pdf}`,
                },
              },
            ],
          },
        ],
        temperature: 0.1,
        max_tokens: 4000,
      }),
    });

    if (!resp.ok) {
      const errText = await resp.text();
      console.error("AI PDF extraction failed:", resp.status, errText);
      return [];
    }

    const data = await resp.json();
    let raw = data.choices?.[0]?.message?.content?.trim() || "[]";

    // Clean markdown code blocks if present
    if (raw.startsWith("```")) {
      raw = raw.split("```")[1];
      if (raw.startsWith("json")) raw = raw.slice(4);
    }

    const parsed = JSON.parse(raw.trim());
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((q: any) => typeof q === "string" && q.trim().length > 15);
  } catch (e) {
    console.error("PDF extraction parse error:", e);
    return [];
  }
}

// ─── AI TOPIC EXTRACTION ─────────────────────────────────────────────────────
async function extractTopicsAI(
  questionText: string,
  subject: string,
  apiKey: string
): Promise<Array<{ name: string; confidence: number }>> {
  const prompt = `You are an academic topic extractor. Extract key topics from this exam question.
Subject: ${subject}
Question: ${questionText}

Return ONLY a valid JSON array. No explanation.
[{"name": "Topic Name", "confidence": 0.95}]
Rules: Max 4 topics, use specific academic concepts relevant to ${subject}, confidence 0.0-1.0.`;

  const resp = await fetch(AI_GATEWAY, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.1,
      max_tokens: 300,
    }),
  });

  if (!resp.ok) return [];
  const data = await resp.json();
  const raw = data.choices?.[0]?.message?.content?.trim() || "[]";
  try {
    let cleaned = raw;
    if (cleaned.startsWith("```")) {
      cleaned = cleaned.split("```")[1];
      if (cleaned.startsWith("json")) cleaned = cleaned.slice(4);
    }
    const parsed = JSON.parse(cleaned.trim());
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((t: any) => t && t.name)
      .map((t: any) => ({
        name: String(t.name).trim(),
        confidence: parseFloat(t.confidence) || 0.8,
      }));
  } catch {
    return [];
  }
}

// ─── LIST SUBJECTS ────────────────────────────────────────────────────────────
async function handleListSubjects(supabase: any) {
  const { data, error } = await supabase
    .from("exam_questions")
    .select("subject")
    .order("subject");

  if (error) throw new Error(error.message);
  const unique = [...new Set((data || []).map((d: any) => d.subject))];
  return jsonResponse({ total: unique.length, subjects: unique });
}

// ─── ANALYTICS ────────────────────────────────────────────────────────────────
async function handleAnalytics(
  supabase: any,
  subject: string,
  subAction: string,
  params: URLSearchParams
) {
  if (subAction === "stats") {
    const { data: questions } = await supabase
      .from("exam_questions")
      .select("id, year")
      .eq("subject", subject);

    const { data: topics } = await supabase
      .from("exam_topics")
      .select("name")
      .eq("subject", subject);

    const uniqueTopics = [...new Set((topics || []).map((t: any) => t.name))];
    const years = [...new Set((questions || []).map((q: any) => q.year))].sort();

    const freq: Record<string, number> = {};
    (topics || []).forEach((t: any) => {
      freq[t.name] = (freq[t.name] || 0) + 1;
    });
    const topTopic = Object.entries(freq).sort((a, b) => b[1] - a[1])[0];

    return jsonResponse({
      total_questions: (questions || []).length,
      unique_topics: uniqueTopics.length,
      total_topic_instances: (topics || []).length,
      years_available: years,
      most_repeated_topic: topTopic
        ? { name: topTopic[0], frequency: topTopic[1] }
        : null,
    });
  }

  const limit = parseInt(params.get("limit") || "10");
  const minFrequency = parseInt(params.get("min_frequency") || "1");

  const { data: topics } = await supabase
    .from("exam_topics")
    .select("name, question_id")
    .eq("subject", subject);

  if (!topics || topics.length === 0) {
    return jsonResponse({ error: `No topic data found for '${subject}'` }, 404);
  }

  const freq: Record<string, { count: number; questionIds: Set<string> }> = {};
  topics.forEach((t: any) => {
    if (!freq[t.name]) freq[t.name] = { count: 0, questionIds: new Set() };
    freq[t.name].count++;
    freq[t.name].questionIds.add(t.question_id);
  });

  const results = Object.entries(freq)
    .map(([name, data]) => ({
      topic_name: name,
      subject,
      frequency: data.count,
    }))
    .filter((t) => t.frequency >= minFrequency)
    .sort((a, b) => b.frequency - a.frequency)
    .slice(0, limit);

  return jsonResponse(results);
}

// ─── NOTES ────────────────────────────────────────────────────────────────────
async function handleNotes(
  subject: string,
  topicName: string | null,
  params: URLSearchParams,
  supabase: any
) {
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  if (!LOVABLE_API_KEY)
    return jsonResponse({ error: "AI not configured" }, 500);

  if (topicName) {
    const notes = await generateNotesAI(topicName, subject, 1, LOVABLE_API_KEY);
    return jsonResponse(notes);
  }

  const limit = parseInt(params.get("limit") || "5");
  const { data: topics } = await supabase
    .from("exam_topics")
    .select("name")
    .eq("subject", subject);

  if (!topics || topics.length === 0) {
    return jsonResponse({ error: `No topics found for '${subject}'` }, 404);
  }

  const freq: Record<string, number> = {};
  topics.forEach((t: any) => {
    freq[t.name] = (freq[t.name] || 0) + 1;
  });

  const topTopics = Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit);

  const notes = [];
  for (const [name, frequency] of topTopics) {
    const note = await generateNotesAI(name, subject, frequency, LOVABLE_API_KEY);
    notes.push(note);
  }

  return jsonResponse({ subject, total_topics: notes.length, notes });
}

async function generateNotesAI(
  topicName: string,
  subject: string,
  frequency: number,
  apiKey: string
): Promise<any> {
  const prompt = `You are an expert academic tutor creating concise exam study notes.
Topic: ${topicName}
Subject: ${subject}
Exam Frequency: appeared ${frequency} times in past papers.

Return ONLY valid JSON:
{
  "topic": "${topicName}",
  "subject": "${subject}",
  "frequency": ${frequency},
  "summary": "2-3 sentence overview",
  "key_points": ["point1", "point2", "point3", "point4", "point5"],
  "definitions": [{"term": "Term", "definition": "Definition"}],
  "exam_tips": ["tip1", "tip2", "tip3"],
  "difficulty": "Easy | Medium | Hard"
}`;

  try {
    const resp = await fetch(AI_GATEWAY, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
        max_tokens: 1000,
      }),
    });

    if (!resp.ok) throw new Error("AI request failed");
    const data = await resp.json();
    let raw = data.choices?.[0]?.message?.content?.trim() || "";
    if (raw.startsWith("```")) {
      raw = raw.split("```")[1];
      if (raw.startsWith("json")) raw = raw.slice(4);
    }
    return JSON.parse(raw.trim());
  } catch {
    return {
      topic: topicName,
      subject,
      frequency,
      summary: `Notes could not be generated for ${topicName}.`,
      key_points: [],
      definitions: [],
      exam_tips: [],
      difficulty: "Unknown",
    };
  }
}

// ─── YOUTUBE ──────────────────────────────────────────────────────────────────
async function handleYouTubeSearch(params: URLSearchParams) {
  const query = params.get("query") || "";
  const maxResults = parseInt(params.get("max_results") || "5");
  const videos = await searchYouTube(query, maxResults);
  return jsonResponse({ query, videos_found: videos.length, videos });
}

async function handleYouTube(
  supabase: any,
  subject: string,
  topicName: string | null,
  params: URLSearchParams
) {
  if (topicName) {
    const maxResults = parseInt(params.get("max_results") || "5");
    const videos = await searchYouTube(
      `${topicName} ${subject} explained tutorial`,
      maxResults
    );
    return jsonResponse({
      topic_name: topicName,
      subject,
      videos_found: videos.length,
      videos,
    });
  }

  const limit = parseInt(params.get("limit") || "5");
  const videosPerTopic = parseInt(params.get("videos_per_topic") || "3");

  const { data: topics } = await supabase
    .from("exam_topics")
    .select("name")
    .eq("subject", subject);

  if (!topics || topics.length === 0) {
    return jsonResponse({ error: `No topics found for '${subject}'` }, 404);
  }

  const freq: Record<string, number> = {};
  topics.forEach((t: any) => {
    freq[t.name] = (freq[t.name] || 0) + 1;
  });

  const topTopics = Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit);

  const recommendations = [];
  for (const [name, frequency] of topTopics) {
    const videos = await searchYouTube(
      `${name} ${subject} explained tutorial`,
      videosPerTopic
    );
    recommendations.push({
      topic_name: name,
      subject,
      frequency,
      videos_found: videos.length,
      videos,
    });
  }

  return jsonResponse({
    subject,
    total_topics: recommendations.length,
    recommendations,
  });
}

async function searchYouTube(
  query: string,
  maxResults: number
): Promise<any[]> {
  const apiKey = Deno.env.get("YOUTUBE_API_KEY");
  if (!apiKey) return [];

  try {
    const params = new URLSearchParams({
      q: query,
      part: "snippet",
      type: "video",
      maxResults: String(maxResults),
      relevanceLanguage: "en",
      safeSearch: "strict",
      key: apiKey,
    });

    const resp = await fetch(
      `https://www.googleapis.com/youtube/v3/search?${params}`
    );
    if (!resp.ok) return [];
    const data = await resp.json();

    return (data.items || []).map((item: any) => {
      const snippet = item.snippet;
      const videoId = item.id.videoId;
      return {
        video_id: videoId,
        title: snippet.title || "",
        description: (snippet.description || "").slice(0, 200),
        channel: snippet.channelTitle || "",
        thumbnail: snippet.thumbnails?.high?.url || "",
        url: `https://www.youtube.com/watch?v=${videoId}`,
        published_at: snippet.publishedAt || "",
      };
    });
  } catch {
    return [];
  }
}
