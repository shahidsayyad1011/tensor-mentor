import { motion } from 'framer-motion';
import { Target, BookCheck, RotateCcw, Calendar, CheckCircle2, Clock } from 'lucide-react';

const weeks = [
  {
    week: 'Week 1',
    title: 'Foundation & Priority',
    icon: Target,
    color: 'from-blue-500 to-cyan-500',
    tasks: [
      'Focus on high-weightage subjects',
      'Complete core concept notes',
      'Attend all doubt sessions',
      'Practice basic numericals',
    ],
    status: 'current',
  },
  {
    week: 'Week 2',
    title: 'Practice PYQs',
    icon: BookCheck,
    color: 'from-purple-500 to-violet-500',
    tasks: [
      'Solve last 5 years papers',
      'Identify recurring patterns',
      'Time-bound mock tests',
      'Review weak areas',
    ],
    status: 'upcoming',
  },
  {
    week: 'Week 3',
    title: 'Revision Sprint',
    icon: RotateCcw,
    color: 'from-green-500 to-emerald-500',
    tasks: [
      'Quick revision of all subjects',
      'Formula sheet preparation',
      'Flash card review sessions',
      'Final mock exam',
    ],
    status: 'upcoming',
  },
];

const LearningPathPage = () => {
  const examDate = new Date();
  examDate.setDate(examDate.getDate() + 21);
  const daysLeft = 21;

  return (
    <div className="pb-24 px-4 pt-6 max-w-lg mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold font-display text-foreground mb-1">Learning Path</h1>
        <p className="text-sm text-muted-foreground mb-6">AI-generated study roadmap</p>
      </motion.div>

      {/* Exam countdown */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-4 mb-6 flex items-center gap-4"
      >
        <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center">
          <Calendar className="w-6 h-6 text-primary-foreground" />
        </div>
        <div className="flex-1">
          <p className="text-sm text-muted-foreground">Exam Countdown</p>
          <p className="text-2xl font-bold font-display gradient-text">{daysLeft} Days Left</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">Target Date</p>
          <p className="text-sm font-medium text-foreground">
            {examDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
          </p>
        </div>
      </motion.div>

      {/* Timeline */}
      <div className="relative">
        <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-border" />

        {weeks.map((week, i) => (
          <motion.div
            key={week.week}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + i * 0.15 }}
            className="relative pl-12 pb-8"
          >
            <div
              className={`absolute left-3 top-1 w-5 h-5 rounded-full flex items-center justify-center ${
                week.status === 'current'
                  ? 'gradient-bg animate-pulse-glow'
                  : 'bg-secondary border-2 border-border'
              }`}
            >
              {week.status === 'current' && <div className="w-2 h-2 rounded-full bg-primary-foreground" />}
            </div>

            <div className="glass-card-hover p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${week.color} flex items-center justify-center`}>
                  <week.icon className="w-4 h-4 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{week.week}</p>
                  <h3 className="text-sm font-semibold text-foreground">{week.title}</h3>
                </div>
                {week.status === 'current' && (
                  <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full gradient-bg text-primary-foreground font-medium">
                    Active
                  </span>
                )}
              </div>

              <div className="space-y-2">
                {week.tasks.map((task, j) => (
                  <div key={j} className="flex items-center gap-2 text-sm">
                    {week.status === 'current' && j === 0 ? (
                      <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
                    ) : (
                      <Clock className="w-4 h-4 text-muted-foreground shrink-0" />
                    )}
                    <span className={week.status === 'current' && j === 0 ? 'text-foreground' : 'text-muted-foreground'}>
                      {task}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default LearningPathPage;
