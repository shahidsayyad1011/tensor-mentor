import { motion } from 'framer-motion';
import { UserProfile } from '@/lib/data';
import { User, Building2, BookOpen, GraduationCap, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface ProfilePageProps {
  profile: UserProfile;
  onClear: () => void;
}

const ProfilePage = ({ profile, onClear }: ProfilePageProps) => {
  const fields = [
    { icon: User, label: 'Full Name', value: profile.fullName },
    { icon: Building2, label: 'Institute', value: profile.institute },
    { icon: GraduationCap, label: 'Department', value: profile.department },
    { icon: BookOpen, label: 'Semester', value: `Semester ${profile.semester}` },
  ];

  return (
    <div className="pb-24 px-4 pt-6 max-w-lg mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold font-display text-foreground mb-6">Profile</h1>
      </motion.div>

      {/* Avatar */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center mb-8"
      >
        <div className="w-20 h-20 rounded-2xl gradient-bg flex items-center justify-center mb-3 glow-primary">
          <span className="text-3xl font-bold text-primary-foreground font-display">
            {profile.fullName.charAt(0).toUpperCase()}
          </span>
        </div>
        <h2 className="text-xl font-bold font-display text-foreground">{profile.fullName}</h2>
        <p className="text-sm text-muted-foreground">{profile.department}</p>
      </motion.div>

      {/* Info cards */}
      <div className="space-y-3 mb-8">
        {fields.map((field, i) => (
          <motion.div
            key={field.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + i * 0.05 }}
            className="glass-card p-4 flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
              <field.icon className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{field.label}</p>
              <p className="text-sm font-medium text-foreground">{field.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <button
          onClick={() => toast.info('Edit profile coming soon!')}
          className="w-full p-3 rounded-xl glass-card-hover flex items-center justify-center gap-2 text-sm font-medium text-foreground"
        >
          <Edit className="w-4 h-4" /> Edit Profile
        </button>
        <button
          onClick={() => {
            onClear();
            toast.success('Profile reset successfully');
          }}
          className="w-full p-3 rounded-xl bg-destructive/10 border border-destructive/20 flex items-center justify-center gap-2 text-sm font-medium text-destructive hover:bg-destructive/20 transition-colors"
        >
          <Trash2 className="w-4 h-4" /> Reset Data
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
