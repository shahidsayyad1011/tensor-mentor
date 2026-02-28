import { motion } from 'framer-motion';
import { UserProfile, getSubjects } from '@/lib/data';
import SubjectCard from '@/components/SubjectCard';
import { Sparkles, BookOpen, Brain } from 'lucide-react';

interface HomePageProps {
  profile: UserProfile;
}

const HomePage = ({ profile }: HomePageProps) => {
  const subjects = getSubjects(profile.department, profile.semester);

  return (
    <div className="pb-24 px-4 pt-6 max-w-lg mx-auto">
      {/* Welcome header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-bold font-display text-foreground">
          Welcome, {profile.fullName.split(' ')[0]} 👋
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Semester {profile.semester} • {profile.department}
        </p>
      </motion.div>

      {/* Quick stats */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-3 gap-3 mb-6"
      >
        {[
          { icon: BookOpen, label: 'Subjects', value: subjects.length, color: 'text-blue-400' },
          { icon: Brain, label: 'AI Chats', value: '∞', color: 'text-purple-400' },
          { icon: Sparkles, label: 'Resources', value: subjects.length * 4, color: 'text-yellow-400' },
        ].map((stat) => (
          <div key={stat.label} className="glass-card p-3 text-center">
            <stat.icon className={`w-5 h-5 mx-auto mb-1 ${stat.color}`} />
            <div className="text-lg font-bold font-display text-foreground">{stat.value}</div>
            <div className="text-[10px] text-muted-foreground">{stat.label}</div>
          </div>
        ))}
      </motion.div>

      {/* Subjects */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold font-display text-foreground mb-3">
          Your Subjects
        </h2>
      </div>

      <div className="space-y-3">
        {subjects.map((subject, i) => (
          <SubjectCard key={subject.name} subject={subject} index={i} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
