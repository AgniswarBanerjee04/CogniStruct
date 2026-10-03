import React, { useState } from 'react';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { ApiKeyModal } from './ApiKeyModal';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-white">
      {/* Background Calm Ambient Atmosphere */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-[15%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-indigo-500/[0.05] blur-[140px]" />
        <div className="absolute top-[30%] -right-[15%] w-[45vw] h-[45vw] rounded-full bg-sky-500/[0.04] blur-[140px]" />
        <div className="absolute -bottom-[20%] left-[25%] w-[40vw] h-[40vw] rounded-full bg-indigo-600/[0.04] blur-[140px]" />
        <div className="absolute inset-0 bg-grid-pattern opacity-30" />
      </div>

      {/* Top Navbar */}
      <Navbar
        onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        isMobileSidebarOpen={isMobileSidebarOpen}
      />

      {/* Main Workspace Frame */}
      <div className="relative z-10 flex-1 flex overflow-hidden">
        <Sidebar
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        {/* Scrollable Page Content */}
        <main className="flex-1 overflow-y-auto min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8 flex flex-col">
          {children}
        </main>
      </div>

      {/* Global API Key Configuration Modal */}
      <ApiKeyModal />
    </div>
  );
};
