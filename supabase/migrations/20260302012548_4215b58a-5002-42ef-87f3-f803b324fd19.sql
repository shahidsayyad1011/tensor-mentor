
-- Questions table
CREATE TABLE public.exam_questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  subject TEXT NOT NULL,
  year SMALLINT NOT NULL,
  question_text TEXT NOT NULL,
  question_number SMALLINT,
  marks SMALLINT,
  source_pdf TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Topics table
CREATE TABLE public.exam_topics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  question_id UUID NOT NULL REFERENCES public.exam_questions(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  confidence REAL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_exam_questions_subject ON public.exam_questions(subject);
CREATE INDEX idx_exam_questions_year ON public.exam_questions(year);
CREATE INDEX idx_exam_topics_subject ON public.exam_topics(subject);
CREATE INDEX idx_exam_topics_name ON public.exam_topics(name);
CREATE INDEX idx_exam_topics_question_id ON public.exam_topics(question_id);

-- RLS (public access since no auth)
ALTER TABLE public.exam_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_topics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read exam_questions" ON public.exam_questions FOR SELECT USING (true);
CREATE POLICY "Allow public insert exam_questions" ON public.exam_questions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read exam_topics" ON public.exam_topics FOR SELECT USING (true);
CREATE POLICY "Allow public insert exam_topics" ON public.exam_topics FOR INSERT WITH CHECK (true);
