import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppProvider, useApp } from './context/AppContext';
import { AppLayout } from './components/AppLayout';
import { Overview } from './pages/Overview';
import { RCTFBuilder } from './pages/RCTFBuilder';
import { VivaChat } from './pages/VivaChat';
import { Roadmap } from './pages/Roadmap';
import { SyllabusUpload } from './pages/SyllabusUpload';
import { AuthPage } from './pages/AuthPage';

const AppContent: React.FC = () => {
  const { currentTab, isAuthenticated } = useApp();

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  return (
    <AppLayout>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentTab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.2 }}
          className="w-full flex-1 flex flex-col"
        >
          {currentTab === 'overview' && <Overview />}
          {currentTab === 'rctf' && <RCTFBuilder />}
          {currentTab === 'viva' && <VivaChat />}
          {currentTab === 'roadmap' && <Roadmap />}
          {currentTab === 'syllabus' && <SyllabusUpload />}
        </motion.div>
      </AnimatePresence>
    </AppLayout>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
