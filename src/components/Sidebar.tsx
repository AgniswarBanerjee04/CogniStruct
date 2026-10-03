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

  if (!user) return null;

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
    <aside className="w-64 h-[calc(100vh-4rem)] flex flex-col justify-between bg-[#0F172A]/95 backdrop-blur-md border-r border-slate-700/60 p-4 select-none">
      {/* Navigation Links */}
      <div className="space-y-6">
        <div>
          <div className="px-3 mb-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider font-mono flex items-center justify-between">
            <span>Navigation Hub</span>
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <motion.button
                  key={item.id}
                  whileHover={{ x: 2 }}
                  whileTap={{ x: 0 }}
                  transition={{ duration: 0.2, ease: 'easeInOut' }}
                  onClick={() => handleSelectTab(item.id)}
                  className={`relative w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors group cursor-pointer ${
                    isActive
                      ? 'text-white bg-indigo-500/15 border border-indigo-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
                  }`}
                >
                  {/* Subtle active left accent line */}
                  {isActive && (
                    <motion.span
                      layoutId="activeTabIndicator"
                      className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-[#818CF8]"
                    />
                  )}

                  <div className="flex items-center gap-3">
                    <span
                      className={`transition-colors ${
                        isActive ? 'text-[#818CF8]' : 'text-slate-400 group-hover:text-slate-200'
                      }`}
                    >
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded-md font-mono font-medium ${
                        isActive
                          ? 'bg-indigo-500/20 text-[#818CF8] border border-indigo-500/30'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
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
        <div className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-700/60 relative overflow-hidden group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase font-mono text-[#38BDF8] font-bold flex items-center gap-1.5">
              <BookOpen className="w-3 h-3 text-[#38BDF8]" /> Active Subject
            </span>
            <span className="text-[10px] font-mono text-slate-400 font-semibold">{activeModule.code}</span>
          </div>

          <h5 className="text-xs font-bold text-white leading-tight mb-1 truncate group-hover:text-[#38BDF8] transition-colors">
            {activeModule.name}
          </h5>
          <p className="text-[11px] text-slate-400 leading-snug line-clamp-2 mb-3">
            {activeModule.description}
          </p>

          {/* Clean progress bar */}
          <div className="space-y-1.5 pt-1 border-t border-slate-700/50">
            <div className="flex justify-between text-[10px] text-slate-300">
              <span>Syllabus Cleared</span>
              <span className="font-mono text-[#38BDF8] font-semibold">
                {activeModule.completedTopics} / {activeModule.totalTopics}
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-slate-900 overflow-hidden">
              <div
                className="h-full rounded-full bg-[#38BDF8] transition-all duration-300"
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

      {/* Footer: Student Viva Readiness Card */}
      <div className="p-3.5 rounded-2xl bg-slate-800/50 border border-slate-700/60 relative overflow-hidden">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] uppercase font-mono text-slate-400 font-bold tracking-wider">
            Viva Readiness
          </span>
          <span className="text-xs font-mono font-bold text-[#34D399] flex items-center">
            {user.stats.vivaReadinessIndex}%
          </span>
        </div>

        <div className="w-full h-1.5 rounded-full bg-slate-900 overflow-hidden mb-2.5">
          <div
            className="h-full rounded-full bg-[#34D399] transition-all duration-500"
            style={{ width: `${user.stats.vivaReadinessIndex}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span>Streak: <strong className="text-amber-400 font-semibold">{user.stats.academicStreakDays}d</strong></span>
          <motion.button
            whileHover={{ x: 1 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            onClick={() => handleSelectTab('viva')}
            className="text-[11px] text-[#818CF8] hover:text-indigo-300 font-semibold flex items-center gap-0.5 hover:underline cursor-pointer"
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
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
            onClick={onCloseMobile}
          />
          <motion.div
            initial={{ x: -264 }}
            animate={{ x: 0 }}
            exit={{ x: -264 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="relative z-10"
          >
            {sidebarContent}
          </motion.div>
        </div>
      )}
    </>
  );
});
