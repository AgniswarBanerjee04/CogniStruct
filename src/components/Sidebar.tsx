import React from 'react';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Cpu,
  MessagesSquare,
  Milestone,
  ArrowUpRight,
  BookOpen,
  FileUp,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { NavigationTab } from '../types';

interface SidebarProps {
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = React.memo(({ isMobileOpen, onCloseMobile }) => {
  const { currentTab, setCurrentTab, user, activeModule } = useApp();

  const navItems: { id: NavigationTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    {
      id: 'overview',
      label: 'Overview',
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      id: 'rctf',
      label: 'RCTF Prompt Sandbox',
      icon: <Cpu className="w-4 h-4" />,
      badge: 'Core',
    },
    {
      id: 'viva',
      label: 'Mock Viva Voce',
      icon: <MessagesSquare className="w-4 h-4" />,
      badge: 'Oral Exam',
    },
    {
      id: 'roadmap',
      label: 'Syllabus Roadmap',
      icon: <Milestone className="w-4 h-4" />,
    },
    {
      id: 'syllabus',
      label: 'Smart Syllabus Parser',
      icon: <FileUp className="w-4 h-4" />,
      badge: 'AI Engine',
    },
  ];

  const handleSelectTab = (tab: NavigationTab) => {
    setCurrentTab(tab);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  const sidebarContent = (
    <aside className="w-64 h-[calc(100vh-4rem)] flex flex-col justify-between bg-[#0B0914]/95 backdrop-blur-md border-r border-white/10 p-4 select-none">
      {/* Navigation Links */}
      <div className="space-y-6">
        <div>
          <div className="px-3 mb-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider font-mono flex items-center justify-between">
            <span>Navigation Hub</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] animate-ping" />
          </div>
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <motion.button
                  key={item.id}
                  whileHover={{ scale: 1.03, x: 2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSelectTab(item.id)}
                  className={`relative w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group cursor-pointer ${
                    isActive
                      ? 'text-white bg-gradient-to-r from-[#00E5FF]/20 via-[#6366F1]/20 to-[#FF007F]/15 border border-[#00E5FF]/40 shadow-lg shadow-[#00E5FF]/10'
                      : 'text-slate-300 hover:text-white hover:bg-white/[0.06] border border-transparent'
                  }`}
                >
                  {/* Left active cyan/magenta accent bar */}
                  {isActive && (
                    <motion.span
                      layoutId="activeTabIndicator"
                      className="absolute left-0 top-2 bottom-2 w-1.5 rounded-r-full bg-gradient-to-b from-[#00E5FF] to-[#FF007F] shadow-md shadow-[#00E5FF]"
                    />
                  )}

                  <div className="flex items-center gap-3">
                    <span
                      className={`transition-colors ${
                        isActive ? 'text-[#00E5FF]' : 'text-slate-400 group-hover:text-[#00E5FF]'
                      }`}
                    >
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded-full font-mono uppercase font-bold ${
                        isActive
                          ? 'bg-[#FF007F]/20 text-[#FF007F] border border-[#FF007F]/40 shadow-sm shadow-[#FF007F]/30'
                          : 'bg-white/5 text-slate-400'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </motion.button>
              );
            })}
          </nav>
        </div>

        {/* Current Academic Context Widget */}
        <div className="p-3.5 rounded-2xl glass-panel relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#00E5FF]/10 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase font-mono text-[#00E5FF] font-bold flex items-center gap-1.5">
              <BookOpen className="w-3 h-3 text-[#00E5FF]" /> Active Subject
            </span>
            <span className="text-[10px] font-mono text-slate-400 font-semibold">{activeModule.code}</span>
          </div>

          <h5 className="text-xs font-bold text-white leading-tight mb-1 truncate group-hover:text-[#00E5FF] transition-colors">
            {activeModule.name}
          </h5>
          <p className="text-[11px] text-slate-300 leading-snug line-clamp-2 mb-3">
            {activeModule.description}
          </p>

          {/* Mini progress bar */}
          <div className="space-y-1.5 pt-1 border-t border-white/5">
            <div className="flex justify-between text-[10px] text-slate-300">
              <span>Syllabus Cleared</span>
              <span className="font-mono text-[#00E5FF] font-bold">
                {activeModule.completedTopics} / {activeModule.totalTopics}
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-black/60 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#6366F1] via-[#00E5FF] to-[#39FF14]"
                style={{
                  width: `${Math.round(
                    (activeModule.completedTopics / activeModule.totalTopics) * 100
                  )}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer: Student Viva Readiness Card with Luminous Lime */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#18112e] via-[#120c22] to-[#0d0918] border border-white/10 shadow-lg relative overflow-hidden">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] uppercase font-mono text-[#FF007F] font-bold tracking-wider">
            Viva Readiness
          </span>
          <span className="text-xs font-mono font-extrabold text-[#39FF14] flex items-center">
            {user.stats.vivaReadinessIndex}%
          </span>
        </div>

        <div className="w-full h-2 rounded-full bg-black/70 overflow-hidden p-0.5 mb-2.5">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#FF007F] via-[#00E5FF] to-[#39FF14] transition-all duration-700 shadow-sm shadow-[#39FF14]"
            style={{ width: `${user.stats.vivaReadinessIndex}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-300">
          <span>Streak: <strong className="text-[#39FF14] font-bold">🔥 {user.stats.academicStreakDays}d</strong></span>
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSelectTab('viva')}
            className="text-[11px] text-[#00E5FF] hover:text-white font-bold flex items-center gap-0.5 hover:underline"
          >
            Practice <ArrowUpRight className="w-3 h-3" />
          </motion.button>
        </div>
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <div className="hidden md:block shrink-0">{sidebarContent}</div>

      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onCloseMobile}
          />
          <motion.div
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="relative z-10"
          >
            {sidebarContent}
          </motion.div>
        </div>
      )}
    </>
  );
});
