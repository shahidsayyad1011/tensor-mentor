import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Subject } from '@/lib/data';
import { BookOpen, Video, FileText, Star, ChevronDown, ExternalLink } from 'lucide-react';

interface SubjectCardProps {
  subject: Subject;
  index: number;
}

const PYQ_LINK = 'https://drive.google.com/drive/folders/0Bz9C0ysJZ7PnMGZKeWcybUpXWGM?resourcekey=0-S2yaWXvAG7ObM_GC8LRNTQ&usp=drive_link';

const SubjectCard = ({ subject, index }: SubjectCardProps) => {
  const [expanded, setExpanded] = useState(false);

  const sections = [
    { icon: BookOpen, label: 'Handwritten Notes', color: 'text-blue-400', content: 'Detailed handwritten notes will be available here. Stay tuned for curated content by top educators.' },
    { icon: Video, label: 'Video Lectures', color: 'text-purple-400', content: 'Curated YouTube lectures and video content for this subject will appear here.' },
    { icon: FileText, label: 'PYQ Papers', color: 'text-green-400', link: PYQ_LINK },
    { icon: Star, label: 'Important Questions', color: 'text-yellow-400', content: '1. Explain key concepts with diagrams\n2. Compare different approaches\n3. Write short notes on fundamentals\n4. Solve numerical problems\n5. Describe real-world applications' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="glass-card-hover overflow-hidden"
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 flex items-center gap-3 text-left"
      >
        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${subject.color} flex items-center justify-center text-lg shrink-0`}>
          {subject.icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground truncate">{subject.name}</h3>
          <p className="text-xs text-muted-foreground">4 resources available</p>
        </div>
        <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="w-5 h-5 text-muted-foreground" />
        </motion.div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-2">
              {sections.map((section) => (
                <div key={section.label}>
                  {section.link ? (
                    <a
                      href={section.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors group"
                    >
                      <section.icon className={`w-4 h-4 ${section.color}`} />
                      <span className="text-sm font-medium text-foreground">{section.label}</span>
                      <ExternalLink className="w-3 h-3 ml-auto text-muted-foreground group-hover:text-foreground transition-colors" />
                    </a>
                  ) : (
                    <details className="group">
                      <summary className="flex items-center gap-2 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors cursor-pointer list-none">
                        <section.icon className={`w-4 h-4 ${section.color}`} />
                        <span className="text-sm font-medium text-foreground">{section.label}</span>
                        <ChevronDown className="w-3 h-3 ml-auto text-muted-foreground group-open:rotate-180 transition-transform" />
                      </summary>
                      <p className="mt-2 px-3 text-sm text-muted-foreground whitespace-pre-line">
                        {section.content}
                      </p>
                    </details>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SubjectCard;
