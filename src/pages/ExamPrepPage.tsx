import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, BarChart3, FileText, Youtube, ChevronLeft, Loader2, Search, Play, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  uploadPDF,
  listSubjects,
  getFrequencies,
  getSubjectStats,
  getNotes,
  getYouTubeRecommendations,
  searchYouTube,
} from "@/lib/exam-prep-api";

const TABS = [
  { id: "heatmap", label: "Frequency Map", icon: BarChart3 },
  { id: "notes", label: "AI Notes", icon: FileText },
  { id: "youtube", label: "Videos", icon: Youtube },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function ExamPrepPage() {
  const { toast } = useToast();
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>("heatmap");

  // Upload state
  const [file, setFile] = useState<File | null>(null);
  const [subjectInput, setSubjectInput] = useState("");
  const [yearInput, setYearInput] = useState(new Date().getFullYear());
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<any>(null);

  // Subjects list
  const [subjects, setSubjects] = useState<string[]>([]);
  const [loadingSubjects, setLoadingSubjects] = useState(false);
  const [uploadTab, setUploadTab] = useState<"upload" | "select">("upload");

  // Analytics
  const [topics, setTopics] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [topicLimit, setTopicLimit] = useState(10);

  // Notes
  const [notes, setNotes] = useState<any[]>([]);
  const [notesLoading, setNotesLoading] = useState(false);
  const [activeNoteIdx, setActiveNoteIdx] = useState(0);

  // YouTube
  const [ytRecs, setYtRecs] = useState<any[]>([]);
  const [ytLoading, setYtLoading] = useState(false);
  const [ytActiveTopic, setYtActiveTopic] = useState(0);
  const [ytSearchQuery, setYtSearchQuery] = useState("");
  const [ytSearchResults, setYtSearchResults] = useState<any>(null);
  const [ytSearching, setYtSearching] = useState(false);
  const [ytTab, setYtTab] = useState<"recommended" | "search">("recommended");

  const handleUpload = async () => {
    if (!file || !subjectInput || !yearInput) {
      toast({ title: "Please fill all fields and select a PDF", variant: "destructive" });
      return;
    }
    setUploading(true);
    setUploadResult(null);
    try {
      const data = await uploadPDF(file, subjectInput, yearInput);
      setUploadResult(data);
      toast({ title: "Analysis complete!", description: `${data.questions_saved} questions, ${data.topics_extracted} topics extracted` });
      handleSelectSubject(subjectInput);
    } catch (e: any) {
      toast({ title: "Upload failed", description: e.message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const handleLoadSubjects = async () => {
    setLoadingSubjects(true);
    try {
      const data = await listSubjects();
      setSubjects(data.subjects || []);
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setLoadingSubjects(false);
    }
  };

  const handleSelectSubject = async (subject: string) => {
    setSelectedSubject(subject);
    setActiveTab("heatmap");
    fetchAnalytics(subject);
  };

  const fetchAnalytics = async (subject: string) => {
    setAnalyticsLoading(true);
    try {
      const [freqData, statsData] = await Promise.all([
        getFrequencies(subject, topicLimit),
        getSubjectStats(subject),
      ]);
      setTopics(freqData);
      setStats(statsData);
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setAnalyticsLoading(false);
    }
  };

  const fetchNotes = async (subject: string) => {
    setNotesLoading(true);
    try {
      const data = await getNotes(subject, 5);
      setNotes(data.notes || []);
      setActiveNoteIdx(0);
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setNotesLoading(false);
    }
  };

  const fetchYouTube = async (subject: string) => {
    setYtLoading(true);
    try {
      const data = await getYouTubeRecommendations(subject, 5, 3);
      setYtRecs(data.recommendations || []);
      setYtActiveTopic(0);
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setYtLoading(false);
    }
  };

  const handleYtSearch = async () => {
    if (!ytSearchQuery.trim()) return;
    setYtSearching(true);
    try {
      const data = await searchYouTube(ytSearchQuery, 6);
      setYtSearchResults(data);
      setYtTab("search");
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setYtSearching(false);
    }
  };

  const onTabChange = (tab: TabId) => {
    setActiveTab(tab);
    if (!selectedSubject) return;
    if (tab === "notes" && notes.length === 0) fetchNotes(selectedSubject);
    if (tab === "youtube" && ytRecs.length === 0) fetchYouTube(selectedSubject);
  };

  const maxFreq = topics.length > 0 ? Math.max(...topics.map((t: any) => t.frequency)) : 1;

  const getHeatColor = (freq: number) => {
    const intensity = freq / maxFreq;
    if (intensity >= 0.8) return "hsl(0, 72%, 55%)";
    if (intensity >= 0.6) return "hsl(25, 95%, 53%)";
    if (intensity >= 0.4) return "hsl(48, 96%, 53%)";
    if (intensity >= 0.2) return "hsl(142, 71%, 45%)";
    return "hsl(217, 91%, 60%)";
  };

  const getLabel = (freq: number) => {
    const intensity = freq / maxFreq;
    if (intensity >= 0.8) return "🔥 Critical";
    if (intensity >= 0.6) return "⚡ High";
    if (intensity >= 0.4) return "📌 Medium";
    return "💡 Low";
  };

  // ── RENDER ──
  if (!selectedSubject) {
    return (
      <div className="min-h-screen pb-24 px-4 pt-6">
        <div className="max-w-lg mx-auto">
          <h1 className="text-2xl font-bold gradient-text mb-1">Exam Preparation</h1>
          <p className="text-sm text-muted-foreground mb-6">Upload question papers & get AI-powered analytics</p>

          {/* Tabs */}
          <div className="flex gap-2 mb-4">
            <Button
              variant={uploadTab === "upload" ? "default" : "secondary"}
              size="sm"
              onClick={() => setUploadTab("upload")}
              className="flex-1"
            >
              <Upload className="w-4 h-4 mr-1" /> Upload Paper
            </Button>
            <Button
              variant={uploadTab === "select" ? "default" : "secondary"}
              size="sm"
              onClick={() => { setUploadTab("select"); handleLoadSubjects(); }}
              className="flex-1"
            >
              📚 My Subjects
            </Button>
          </div>

          {uploadTab === "upload" && (
            <div className="space-y-4">
              {/* Drop zone */}
              <div
                className="glass-card p-6 text-center cursor-pointer hover:border-primary/40 transition-colors"
                onClick={() => document.getElementById("pdf-input")?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (e.dataTransfer.files[0]) setFile(e.dataTransfer.files[0]);
                }}
              >
                <input
                  id="pdf-input"
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
                {file ? (
                  <div className="flex items-center justify-center gap-2 text-primary">
                    <FileText className="w-5 h-5" />
                    <span className="font-medium">{file.name}</span>
                    <span className="text-xs text-muted-foreground">
                      ({(file.size / 1024).toFixed(1)} KB)
                    </span>
                  </div>
                ) : (
                  <div>
                    <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Drop PDF here or <span className="text-primary">browse</span>
                    </p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Subject</label>
                  <Input
                    placeholder="e.g. Data Structures"
                    value={subjectInput}
                    onChange={(e) => setSubjectInput(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Year</label>
                  <Input
                    type="number"
                    value={yearInput}
                    min={2000}
                    max={2100}
                    onChange={(e) => setYearInput(parseInt(e.target.value))}
                  />
                </div>
              </div>

              <Button className="w-full" onClick={handleUpload} disabled={uploading}>
                {uploading ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing...</>
                ) : (
                  <>🚀 Upload & Analyze</>
                )}
              </Button>

              {uploadResult && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-card p-4"
                >
                  <p className="text-sm font-semibold text-primary mb-2">✅ Analysis Complete!</p>
                  <div className="flex gap-2 flex-wrap text-xs">
                    <span className="bg-primary/10 text-primary px-2 py-1 rounded-full">
                      📄 {uploadResult.questions_saved} Questions
                    </span>
                    <span className="bg-primary/10 text-primary px-2 py-1 rounded-full">
                      🧠 {uploadResult.topics_extracted} Topics
                    </span>
                  </div>
                </motion.div>
              )}
            </div>
          )}

          {uploadTab === "select" && (
            <div>
              {loadingSubjects ? (
                <div className="flex items-center justify-center py-8 text-muted-foreground">
                  <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading...
                </div>
              ) : subjects.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>📭 No subjects found. Upload a paper first.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {subjects.map((s) => (
                    <Button
                      key={s}
                      variant={selectedSubject === s ? "default" : "secondary"}
                      className="justify-start"
                      onClick={() => handleSelectSubject(s)}
                    >
                      📘 {s.toUpperCase()}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── DASHBOARD VIEW ──
  return (
    <div className="min-h-screen pb-24 px-4 pt-4">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <Button variant="ghost" size="icon" onClick={() => setSelectedSubject(null)}>
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h2 className="text-lg font-bold">{selectedSubject?.toUpperCase()}</h2>
            <p className="text-xs text-muted-foreground">Exam Prep Analytics</p>
          </div>
        </div>

        {/* Tab bar */}
        <div className="flex gap-1 mb-4 glass-card p-1">
          {TABS.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "ghost"}
              size="sm"
              className="flex-1 text-xs"
              onClick={() => onTabChange(tab.id)}
            >
              <tab.icon className="w-3.5 h-3.5 mr-1" />
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {activeTab === "heatmap" && (
              <HeatmapView
                stats={stats}
                topics={topics}
                loading={analyticsLoading}
                maxFreq={maxFreq}
                getHeatColor={getHeatColor}
                getLabel={getLabel}
              />
            )}

            {activeTab === "notes" && (
              <NotesView
                notes={notes}
                loading={notesLoading}
                activeIdx={activeNoteIdx}
                setActiveIdx={setActiveNoteIdx}
                subject={selectedSubject!}
              />
            )}

            {activeTab === "youtube" && (
              <YouTubeView
                recs={ytRecs}
                loading={ytLoading}
                activeTopic={ytActiveTopic}
                setActiveTopic={setYtActiveTopic}
                searchQuery={ytSearchQuery}
                setSearchQuery={setYtSearchQuery}
                searchResults={ytSearchResults}
                searching={ytSearching}
                onSearch={handleYtSearch}
                ytTab={ytTab}
                setYtTab={setYtTab}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── SUB COMPONENTS ──────────────────────────────────────────────────────────

function HeatmapView({ stats, topics, loading, maxFreq, getHeatColor, getLabel }: any) {
  if (loading) return <LoadingState text="Analyzing topics..." />;

  return (
    <div className="space-y-4">
      {stats && (
        <div className="grid grid-cols-2 gap-2">
          <StatCard value={stats.total_questions} label="Questions" />
          <StatCard value={stats.unique_topics} label="Unique Topics" />
          <StatCard value={stats.total_topic_instances} label="Topic Instances" />
          <StatCard
            value={stats.most_repeated_topic?.name || "—"}
            label="🔥 Top Topic"
            highlight
          />
        </div>
      )}

      <h3 className="text-sm font-semibold text-foreground">Topic Frequency Map</h3>

      <div className="space-y-2">
        {topics.map((topic: any, i: number) => {
          const width = (topic.frequency / maxFreq) * 100;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card p-3"
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground font-mono">#{i + 1}</span>
                  <span className="text-sm font-medium truncate max-w-[160px]">
                    {topic.topic_name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className="text-xs font-bold px-2 py-0.5 rounded-full text-white"
                    style={{ backgroundColor: getHeatColor(topic.frequency) }}
                  >
                    {topic.frequency}x
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {getLabel(topic.frequency)}
                  </span>
                </div>
              </div>
              <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${width}%` }}
                  transition={{ duration: 0.6, delay: i * 0.05 }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: getHeatColor(topic.frequency) }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
        <span className="font-medium">Scale:</span>
        {[
          { color: "hsl(217,91%,60%)", label: "Low" },
          { color: "hsl(142,71%,45%)", label: "Medium" },
          { color: "hsl(48,96%,53%)", label: "High" },
          { color: "hsl(25,95%,53%)", label: "V.High" },
          { color: "hsl(0,72%,55%)", label: "Critical" },
        ].map((l) => (
          <span key={l.label} className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: l.color }} />
            {l.label}
          </span>
        ))}
      </div>
    </div>
  );
}

function NotesView({ notes, loading, activeIdx, setActiveIdx, subject }: any) {
  if (loading) return <LoadingState text="AI is generating study notes..." />;
  if (notes.length === 0) return <EmptyState text="No notes available. Upload a question paper first." />;

  const active = notes[activeIdx];

  const difficultyColors: Record<string, string> = {
    Easy: "bg-green-500/20 text-green-400",
    Medium: "bg-yellow-500/20 text-yellow-400",
    Hard: "bg-red-500/20 text-red-400",
    Unknown: "bg-muted text-muted-foreground",
  };

  return (
    <div className="space-y-3">
      {/* Topic tabs - horizontal scroll */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
        {notes.map((n: any, i: number) => (
          <button
            key={i}
            className={`shrink-0 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
              activeIdx === i
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
            onClick={() => setActiveIdx(i)}
          >
            #{i + 1} {n.topic}
            <span className="ml-1 opacity-70">{n.frequency}x</span>
          </button>
        ))}
      </div>

      {active && (
        <motion.div
          key={activeIdx}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-3"
        >
          <div className="glass-card p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-foreground">{active.topic}</h3>
              <div className="flex gap-2">
                <span className={`text-xs px-2 py-0.5 rounded-full ${difficultyColors[active.difficulty] || difficultyColors.Unknown}`}>
                  {active.difficulty}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                  🔥 {active.frequency}x
                </span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">{active.summary}</p>
          </div>

          {active.key_points?.length > 0 && (
            <div className="glass-card p-4">
              <h4 className="text-sm font-semibold mb-2">🎯 Key Points</h4>
              <ul className="space-y-1">
                {active.key_points.map((p: string, i: number) => (
                  <li key={i} className="text-sm text-muted-foreground flex gap-2">
                    <span className="text-primary shrink-0">•</span> {p}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {active.exam_tips?.length > 0 && (
            <div className="glass-card p-4">
              <h4 className="text-sm font-semibold mb-2">💡 Exam Tips</h4>
              <ul className="space-y-1">
                {active.exam_tips.map((t: string, i: number) => (
                  <li key={i} className="text-sm text-muted-foreground flex gap-2">
                    <span className="text-accent shrink-0">→</span> {t}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {active.definitions?.length > 0 && (
            <div className="glass-card p-4">
              <h4 className="text-sm font-semibold mb-2">📚 Definitions</h4>
              <div className="space-y-2">
                {active.definitions.map((d: any, i: number) => (
                  <div key={i} className="bg-secondary/50 rounded-lg p-2">
                    <span className="text-xs font-semibold text-primary">{d.term}</span>
                    <p className="text-xs text-muted-foreground mt-0.5">{d.definition}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}

function YouTubeView({
  recs, loading, activeTopic, setActiveTopic,
  searchQuery, setSearchQuery, searchResults, searching,
  onSearch, ytTab, setYtTab,
}: any) {
  if (loading) return <LoadingState text="Fetching video recommendations..." />;

  const currentTopic = recs[activeTopic];

  return (
    <div className="space-y-3">
      {/* Search */}
      <div className="flex gap-2">
        <Input
          placeholder="Search any topic..."
          value={searchQuery}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
          onKeyDown={(e: React.KeyboardEvent) => e.key === "Enter" && onSearch()}
          className="flex-1"
        />
        <Button size="icon" onClick={onSearch} disabled={searching}>
          {searching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <Button
          variant={ytTab === "recommended" ? "default" : "secondary"}
          size="sm"
          onClick={() => setYtTab("recommended")}
        >
          ⭐ Recommended
        </Button>
        {searchResults && (
          <Button
            variant={ytTab === "search" ? "default" : "secondary"}
            size="sm"
            onClick={() => setYtTab("search")}
          >
            🔍 Results ({searchResults.videos_found})
          </Button>
        )}
      </div>

      {ytTab === "recommended" ? (
        <>
          {/* Topic selector */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
            {recs.map((rec: any, i: number) => (
              <button
                key={i}
                className={`shrink-0 px-3 py-2 rounded-lg text-xs transition-colors ${
                  activeTopic === i
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                }`}
                onClick={() => setActiveTopic(i)}
              >
                {rec.topic_name}
                <span className="ml-1 opacity-70">{rec.frequency}x</span>
              </button>
            ))}
          </div>

          {currentTopic && (
            <div className="space-y-2">
              {currentTopic.videos.map((video: any, i: number) => (
                <VideoCard key={i} video={video} />
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="space-y-2">
          {searchResults?.videos?.map((video: any, i: number) => (
            <VideoCard key={i} video={video} />
          ))}
        </div>
      )}
    </div>
  );
}

function VideoCard({ video }: { video: any }) {
  return (
    <a
      href={video.url}
      target="_blank"
      rel="noopener noreferrer"
      className="glass-card-hover p-3 flex gap-3 group block"
    >
      <div className="relative w-28 h-20 shrink-0 rounded-lg overflow-hidden bg-secondary">
        {video.thumbnail && (
          <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
          <Play className="w-6 h-6 text-white" />
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium line-clamp-2 text-foreground">{video.title}</h4>
        <p className="text-xs text-muted-foreground mt-1">📺 {video.channel}</p>
        <div className="flex items-center gap-1 mt-1 text-xs text-primary">
          <ExternalLink className="w-3 h-3" /> Watch
        </div>
      </div>
    </a>
  );
}

function StatCard({ value, label, highlight }: { value: any; label: string; highlight?: boolean }) {
  return (
    <div className={`glass-card p-3 ${highlight ? "border-primary/30" : ""}`}>
      <div className={`text-lg font-bold ${highlight ? "text-primary" : "text-foreground"} truncate`}>
        {value}
      </div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}

function LoadingState({ text }: { text: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
      <Loader2 className="w-8 h-8 animate-spin mb-3" />
      <p className="text-sm">{text}</p>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="text-center py-12 text-muted-foreground">
      <p className="text-3xl mb-2">📭</p>
      <p className="text-sm">{text}</p>
    </div>
  );
}
