import { useState, useEffect } from 'react';
import { UserProfile } from '@/lib/data';

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('tensor-teach-profile');
    if (stored) {
      try { setProfile(JSON.parse(stored)); } catch { /* ignore */ }
    }
  }, []);

  const saveProfile = (p: UserProfile) => {
    localStorage.setItem('tensor-teach-profile', JSON.stringify(p));
    setProfile(p);
  };

  const clearProfile = () => {
    localStorage.removeItem('tensor-teach-profile');
    setProfile(null);
  };

  return { profile, saveProfile, clearProfile };
}
