import { NavLink, useLocation } from 'react-router-dom';
import { Home, Bot, Route, BookOpen, User, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const WHATSAPP_LINK = 'https://chat.whatsapp.com/EGPOEczL2AKG5bbKAcaiP4';

const navItems = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/ai-bot', icon: Bot, label: 'AI Bot' },
  { path: '/learning-path', icon: Route, label: 'Path' },
  { path: '/courses', icon: BookOpen, label: 'Courses' },
  { path: '/profile', icon: User, label: 'Profile' },
];

const BottomNav = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass-card border-t border-glass-border safe-area-bottom">
      <div className="flex items-center justify-around py-2 px-1 max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className="relative flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-colors"
            >
              {isActive && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute inset-0 rounded-xl bg-primary/10"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <item.icon
                className={`w-5 h-5 relative z-10 transition-colors ${
                  isActive ? 'text-primary' : 'text-muted-foreground'
                }`}
              />
              <span
                className={`text-[10px] font-medium relative z-10 transition-colors ${
                  isActive ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                {item.label}
              </span>
            </NavLink>
          );
        })}

        {/* Community - external link */}
        <a
          href={WHATSAPP_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl"
        >
          <MessageCircle className="w-5 h-5 text-muted-foreground" />
          <span className="text-[10px] font-medium text-muted-foreground">Community</span>
        </a>
      </div>
    </nav>
  );
};

export default BottomNav;
