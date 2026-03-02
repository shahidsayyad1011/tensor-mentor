import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useUserProfile } from "@/hooks/use-user-profile";
import Onboarding from "./pages/Onboarding";
import HomePage from "./pages/HomePage";
import AIBotPage from "./pages/AIBotPage";
import LearningPathPage from "./pages/LearningPathPage";
import CoursesPage from "./pages/CoursesPage";
import ProfilePage from "./pages/ProfilePage";
import ExamPrepPage from "./pages/ExamPrepPage";
import BottomNav from "./components/BottomNav";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  const { profile, saveProfile, clearProfile } = useUserProfile();

  if (!profile) {
    return <Onboarding onComplete={saveProfile} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Routes>
        <Route path="/" element={<HomePage profile={profile} />} />
        <Route path="/ai-bot" element={<AIBotPage />} />
        <Route path="/learning-path" element={<LearningPathPage />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/exam-prep" element={<ExamPrepPage />} />
        <Route path="/profile" element={<ProfilePage profile={profile} onClear={clearProfile} />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <BottomNav />
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
