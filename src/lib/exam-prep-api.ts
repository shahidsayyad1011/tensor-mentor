const FUNCTION_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/exam-prep`;

const handleResponse = async (res: Response) => {
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(err.error || err.detail || "Request failed");
  }
  return res.json();
};

const headers = () => ({
  Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
});

// ── Subjects ──
export const uploadPDF = async (file: File, subject: string, year: number) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("subject", subject);
  formData.append("year", String(year));
  const res = await fetch(`${FUNCTION_URL}/upload`, {
    method: "POST",
    headers: headers(),
    body: formData,
  });
  return handleResponse(res);
};

export const listSubjects = async () => {
  const res = await fetch(`${FUNCTION_URL}/subjects`, { headers: headers() });
  return handleResponse(res);
};

// ── Analytics ──
export const getFrequencies = async (subject: string, limit = 10) => {
  const res = await fetch(
    `${FUNCTION_URL}/analytics/${encodeURIComponent(subject)}/frequencies?limit=${limit}`,
    { headers: headers() }
  );
  return handleResponse(res);
};

export const getSubjectStats = async (subject: string) => {
  const res = await fetch(
    `${FUNCTION_URL}/analytics/${encodeURIComponent(subject)}/stats`,
    { headers: headers() }
  );
  return handleResponse(res);
};

// ── Notes ──
export const getNotes = async (subject: string, limit = 5) => {
  const res = await fetch(
    `${FUNCTION_URL}/notes/${encodeURIComponent(subject)}?limit=${limit}`,
    { headers: headers() }
  );
  return handleResponse(res);
};

export const getTopicNotes = async (subject: string, topicName: string) => {
  const res = await fetch(
    `${FUNCTION_URL}/notes/${encodeURIComponent(subject)}/${encodeURIComponent(topicName)}`,
    { headers: headers() }
  );
  return handleResponse(res);
};

// ── YouTube ──
export const getYouTubeRecommendations = async (
  subject: string,
  limit = 5,
  videosPerTopic = 3
) => {
  const res = await fetch(
    `${FUNCTION_URL}/youtube/${encodeURIComponent(subject)}?limit=${limit}&videos_per_topic=${videosPerTopic}`,
    { headers: headers() }
  );
  return handleResponse(res);
};

export const searchYouTube = async (query: string, maxResults = 5) => {
  const res = await fetch(
    `${FUNCTION_URL}/youtube/search?query=${encodeURIComponent(query)}&max_results=${maxResults}`,
    { headers: headers() }
  );
  return handleResponse(res);
};
