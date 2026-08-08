import { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';

import { View } from './types';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Landing from './views/Landing';
import Login from './views/Login';
import Register from './views/Register';
import Dashboard from './views/Dashboard';
import Repositories from './views/Repositories';
import NewScan from './views/NewScan';
import ScanHistory from './views/ScanHistory';
import AiAssistantDrawer from './components/AiAssistantDrawer';
import AiSecurityReview from './views/AiSecurityReview';
import SecretScanner from './views/SecretScanner';
import DependencyScanner from './views/DependencyScanner';
import Notifications from './views/Notifications';
import Settings from './views/Settings';
import Help from './views/Help';
import Reports from './views/Reports';
import Integrations from './views/Integrations';
import Team from './views/Team';

import Product from './views/Product';
import Solutions from './views/Solutions';
import Pricing from './views/Pricing';
import Docs from './views/Docs';

import { AuthProvider, useAuth } from './contexts/AuthContext';

function MainApp() {
  const getInitialView = (): View => {
    const path = window.location.pathname.replace('/', '');
    const validViews: View[] = [
      'landing', 'login', 'register', 'dashboard', 'repositories', 
      'new_scan', 'scan_history', 'ai_security_review', 'secret_scanner', 
      'dependency_scanner', 'notifications', 'settings', 'help', 
      'reports', 'integrations', 'team', 'product', 'solutions', 'pricing', 'docs'
    ];
    if (validViews.includes(path as View)) return path as View;
    return 'landing';
  };

  const [currentView, setCurrentView] = useState<View>(getInitialView());
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { user, isLoading } = useAuth();

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme && savedTheme !== 'default') {
      document.body.setAttribute('data-theme', savedTheme);
    }
  }, []);

  useEffect(() => {
    if (scrollContainerRef.current) {
      // Ensure DOM has painted the new view before scrolling to top
      setTimeout(() => {
        scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
      }, 10);
    }
  }, [currentView]);

  // Route Guard
  useEffect(() => {
    if (!isLoading && !user && !['landing', 'login', 'register'].includes(currentView)) {
      setCurrentView('login');
    }
  }, [currentView, user, isLoading]);

  if (isLoading) {
    return <div className="h-screen w-screen bg-background flex items-center justify-center text-foreground">Loading...</div>;
  }

  return (
    <div className="h-screen overflow-hidden bg-background flex">
      {!['landing', 'login', 'register'].includes(currentView) && <Sidebar currentView={currentView} setView={setCurrentView} />}
      
      <div 
        ref={scrollContainerRef}
        className={`w-full h-full relative overflow-y-auto overflow-x-hidden ${!['landing', 'login', 'register'].includes(currentView) ? 'md:pl-[272px]' : ''}`}
      >
        {!['landing', 'login', 'register'].includes(currentView) && <Header onOpenAiAssistant={() => setIsAiAssistantOpen(true)} setView={setCurrentView} />}
        
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="w-full min-h-full flex flex-col"
          >
            {currentView === 'landing' && <Landing setView={setCurrentView} />}
            {currentView === 'login' && <Login setView={setCurrentView} />}
            {currentView === 'register' && <Register setView={setCurrentView} />}
            {currentView === 'dashboard' && <Dashboard />}
            {currentView === 'repositories' && <Repositories />}
            {currentView === 'new_scan' && <NewScan setView={setCurrentView} />}
            {currentView === 'scan_history' && <ScanHistory />}
            {currentView === 'ai_security_review' && <AiSecurityReview />}
            {currentView === 'secret_scanner' && <SecretScanner />}
            {currentView === 'dependency_scanner' && <DependencyScanner />}
            {currentView === 'notifications' && <Notifications />}
            {currentView === 'settings' && <Settings />}
            {currentView === 'help' && <Help />}
            {currentView === 'reports' && <Reports />}
            {currentView === 'integrations' && <Integrations />}
            {currentView === 'team' && <Team />}
            {currentView === 'product' && <Product />}
            {currentView === 'solutions' && <Solutions />}
            {currentView === 'pricing' && <Pricing />}
            {currentView === 'docs' && <Docs />}
          </motion.div>
        </AnimatePresence>
      </div>

      <AiAssistantDrawer isOpen={isAiAssistantOpen} onClose={() => setIsAiAssistantOpen(false)} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

