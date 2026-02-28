import { motion } from 'framer-motion';
import { Play, Clock, BookOpen, Code, Brain, Briefcase } from 'lucide-react';
import { toast } from 'sonner';

const courses = [
  {
    title: 'Python for Engineers',
    desc: 'Master Python programming with hands-on engineering projects and real-world applications.',
    icon: Code,
    color: 'from-yellow-500 to-orange-500',
    duration: '6 weeks',
    lessons: 24,
  },
  {
    title: 'Git & GitHub Basics',
    desc: 'Learn version control, collaboration workflows, and open-source contributions.',
    icon: Code,
    color: 'from-gray-500 to-slate-500',
    duration: '2 weeks',
    lessons: 10,
  },
  {
    title: 'Aptitude Preparation',
    desc: 'Quantitative, logical reasoning and verbal ability for placement exams.',
    icon: Brain,
    color: 'from-green-500 to-emerald-500',
    duration: '4 weeks',
    lessons: 32,
  },
  {
    title: 'AI & ML Basics',
    desc: 'Introduction to artificial intelligence, machine learning concepts and tools.',
    icon: Brain,
    color: 'from-blue-500 to-purple-500',
    duration: '5 weeks',
    lessons: 20,
  },
  {
    title: 'Interview Preparation',
    desc: 'Technical and HR interview prep with mock questions and strategies.',
    icon: Briefcase,
    color: 'from-rose-500 to-pink-500',
    duration: '3 weeks',
    lessons: 15,
  },
];

const CoursesPage = () => {
  return (
    <div className="pb-24 px-4 pt-6 max-w-lg mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold font-display text-foreground mb-1">Courses</h1>
        <p className="text-sm text-muted-foreground mb-6">Skill-building tracks for engineers</p>
      </motion.div>

      <div className="space-y-4">
        {courses.map((course, i) => (
          <motion.div
            key={course.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card-hover p-4"
          >
            <div className="flex gap-3">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${course.color} flex items-center justify-center shrink-0`}>
                <course.icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground mb-1">{course.title}</h3>
                <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{course.desc}</p>
                <div className="flex items-center gap-4 text-[10px] text-muted-foreground mb-3">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {course.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-3 h-3" /> {course.lessons} lessons
                  </span>
                </div>
                <button
                  onClick={() => toast.info('Course content coming soon!')}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg gradient-bg text-primary-foreground text-xs font-medium transition-shadow hover:shadow-lg hover:shadow-primary/25"
                >
                  <Play className="w-3 h-3" /> Start Course
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CoursesPage;
