import { useState, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { UserProfile, DEPARTMENTS, SEMESTERS } from '@/lib/data';
import { GraduationCap, ArrowRight, Sparkles } from 'lucide-react';

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
}

const Onboarding = ({ onComplete }: OnboardingProps) => {
  const [form, setForm] = useState({
    fullName: '',
    age: '',
    institute: '',
    department: DEPARTMENTS[0],
    semester: 1,
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.fullName || !form.age || !form.institute) return;
    onComplete({
      fullName: form.fullName,
      age: parseInt(form.age),
      institute: form.institute,
      department: form.department,
      semester: form.semester,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-gradient-start/20 to-gradient-end/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-gradient-to-br from-gradient-end/20 to-gradient-accent/20 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-bg mb-4"
          >
            <GraduationCap className="w-8 h-8 text-primary-foreground" />
          </motion.div>
          <h1 className="text-3xl font-bold font-display gradient-text mb-2">
            Tensor Teach AI
          </h1>
          <p className="text-muted-foreground flex items-center justify-center gap-1">
            <Sparkles className="w-4 h-4" /> AI-Powered Academic Intelligence
          </p>
        </div>

        <form onSubmit={handleSubmit} className="glass-card p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1.5">Full Name</label>
            <input
              type="text"
              value={form.fullName}
              onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-lg bg-secondary border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors text-foreground"
              placeholder="Enter your name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1.5">Age</label>
            <input
              type="number"
              value={form.age}
              onChange={e => setForm(f => ({ ...f, age: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-lg bg-secondary border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors text-foreground"
              placeholder="Your age"
              min={15}
              max={50}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1.5">Institute Name</label>
            <input
              type="text"
              value={form.institute}
              onChange={e => setForm(f => ({ ...f, institute: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-lg bg-secondary border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors text-foreground"
              placeholder="College / University"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1.5">Department</label>
            <select
              value={form.department}
              onChange={e => setForm(f => ({ ...f, department: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-lg bg-secondary border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors text-foreground"
            >
              {DEPARTMENTS.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1.5">Semester</label>
            <select
              value={form.semester}
              onChange={e => setForm(f => ({ ...f, semester: parseInt(e.target.value) }))}
              className="w-full px-4 py-2.5 rounded-lg bg-secondary border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors text-foreground"
            >
              {SEMESTERS.map(s => (
                <option key={s} value={s}>Semester {s}</option>
              ))}
            </select>
          </div>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 rounded-lg gradient-bg font-semibold text-primary-foreground flex items-center justify-center gap-2 mt-6 transition-shadow hover:shadow-lg hover:shadow-primary/25"
          >
            Get Started <ArrowRight className="w-4 h-4" />
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default Onboarding;
