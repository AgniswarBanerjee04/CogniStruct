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
    <div className="min-h-screen bg-[#0B0914] text-white flex flex-col font-sans selection:bg-[#FF007F]/30 selection:text-[#00E5FF]">
      {/* Background ambient cyberpunk lighting */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-[15%] -left-[10%] w-[55vw] h-[55vw] rounded-full bg-gradient-to-br from-[#FF007F]/15 via-[#6366F1]/10 to-transparent blur-[140px]" />
        <div className="absolute top-[35%] -right-[15%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-bl from-[#00E5FF]/15 via-[#39FF14]/5 to-transparent blur-[140px]" />
        <div className="absolute -bottom-[20%] left-[20%] w-[45vw] h-[45vw] rounded-full bg-gradient-to-tr from-[#6366F1]/10 via-[#00E5FF]/10 to-transparent blur-[140px]" />
        <div className="absolute inset-0 bg-grid-pattern opacity-40" />
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
