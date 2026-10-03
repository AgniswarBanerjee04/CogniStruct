import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  Sparkles,
  BookOpen,
  GraduationCap,
  Cpu,
  Database,
  Code2,
  ShieldCheck,
  Check,
  Menu,
  X,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { ModuleId } from '../types';

interface NavbarProps {
  onToggleMobileSidebar?: () => void;
  isMobileSidebarOpen?: boolean;
}

export const Navbar: React.FC<NavbarProps> = React.memo(({
  onToggleMobileSidebar,
  isMobileSidebarOpen,
}) => {
  const {
    user,
    activeModule,
    setActiveModuleId,
    hasCustomKey,
    setIsApiKeyModalOpen,
    logout,
  } = useApp();

  const [isSubjectDropdownOpen, setIsSubjectDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  if (!user) return null;

  const getUserInitials = (name: string) => {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return 'CS';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const getModuleIcon = (iconName: string) => {
    switch (iconName) {
      case 'Cpu':
        return <Cpu className="w-4 h-4 text-[#38BDF8]" />;
      case 'Database':
        return <Database className="w-4 h-4 text-[#818CF8]" />;
      case 'Code2':
        return <Code2 className="w-4 h-4 text-[#34D399]" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-4 h-4 text-[#FBBF24]" />;
      default:
        return <BookOpen className="w-4 h-4 text-[#818CF8]" />;
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full h-16 bg-[#0F172A]/90 backdrop-blur-md border-b border-slate-700/60 px-4 lg:px-8 flex items-center justify-between transition-colors">
      {/* Left: Mobile Toggle + Logo */}
      <div className="flex items-center gap-4">
        {onToggleMobileSidebar && (
          <button
            onClick={onToggleMobileSidebar}
            className="p-2 -ml-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors md:hidden cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {isMobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        )}

        <div className="flex items-center gap-3 select-none">
          {/* Minimalist Logo Icon */}
          <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-[#818CF8]">
            <svg
              className="w-5 h-5 text-[#818CF8]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="3" />
              <path d="M12 2v4m0 12v4M2 12h4m12 0h4" />
              <path d="m4.93 4.93 2.83 2.83m8.48 8.48 2.83 2.83m-14.14 0 2.83-2.83m8.48-8.48 2.83-2.83" />
            </svg>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-base font-bold tracking-tight text-white font-sans">
                Cogni<span className="text-[#818CF8]">Struct</span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-semibold">
                v2.4
              </span>
            </div>
            <span className="text-[10px] text-slate-400 hidden sm:inline-block">
              AI Academic & Engineering Platform
            </span>
          </div>
        </div>
      </div>

      {/* Center: Current Active Subject Selector Dropdown */}
      <div className="relative">
        <motion.button
          whileHover={{ y: -1 }}
          whileTap={{ y: 0 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          onClick={() => setIsSubjectDropdownOpen(!isSubjectDropdownOpen)}
          className="flex items-center gap-2.5 px-3 py-1.5 rounded-2xl bg-slate-800/50 border border-slate-700/60 hover:border-slate-600 text-xs font-semibold text-slate-200 transition-colors group cursor-pointer shadow-sm"
        >
          <div className="p-1 rounded-xl bg-slate-900/60">
            {getModuleIcon(activeModule.iconName)}
          </div>
          <span className="max-w-[140px] sm:max-w-[220px] truncate text-white font-medium">
            {activeModule.name}
          </span>
          <span className="hidden md:inline-block text-[10px] px-1.5 py-0.5 rounded-lg bg-slate-900/60 text-[#38BDF8] font-mono border border-slate-700/50">
            {activeModule.code}
          </span>
          <ChevronDown
            className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
              isSubjectDropdownOpen ? 'rotate-180 text-[#818CF8]' : ''
            }`}
          />
        </motion.button>

        <AnimatePresence>
          {isSubjectDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-20"
                onClick={() => setIsSubjectDropdownOpen(false)}
              />
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.15, ease: 'easeInOut' }}
                className="absolute left-0 sm:left-auto sm:right-0 mt-2 w-72 sm:w-80 p-2.5 rounded-2xl bg-[#1E293B] border border-slate-700 shadow-xl z-30 divide-y divide-slate-750"
              >
                <div className="px-3 py-2 text-[11px] font-bold text-slate-400 uppercase font-mono tracking-wider">
                  Active Academic Modules
                </div>
                <div className="py-1 space-y-1">
                  {user.activeModules.map((module) => {
                    const isSelected = module.id === activeModule.id;
                    return (
                      <button
                        key={module.id}
                        onClick={() => {
                          setActiveModuleId(module.id as ModuleId);
                          setIsSubjectDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left text-xs transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-indigo-500/15 text-[#818CF8] border border-indigo-500/30'
                            : 'text-slate-300 hover:bg-slate-700/50 hover:text-white border border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="p-1.5 rounded-xl bg-slate-900/60 border border-slate-700/50">
                            {getModuleIcon(module.iconName)}
                          </div>
                          <div>
                            <div className="font-semibold text-white flex items-center gap-1.5">
                              {module.name}
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono">
                              {module.code} • {module.semester}
                            </div>
                          </div>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-[#818CF8]" />}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Right: Engine Indicator Pill + User Avatar */}
      <div className="flex items-center gap-3">
        {/* Gemini Engine Indicator Button */}
        <motion.button
          whileHover={{ y: -1 }}
          whileTap={{ y: 0 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          onClick={() => setIsApiKeyModalOpen(true)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl border text-[11px] font-mono font-medium transition-colors cursor-pointer ${
            hasCustomKey
              ? 'bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-600'
              : 'bg-amber-500/10 border-amber-500/30 text-amber-300 hover:bg-amber-500/20'
          }`}
          title="Click to configure Gemini API Key"
        >
          <Sparkles className={`w-3.5 h-3.5 ${hasCustomKey ? 'text-[#818CF8]' : 'text-amber-400'}`} />
          <span className="hidden sm:inline">
            {hasCustomKey ? 'Gemini 1.5 Flash' : 'Simulator Mode'}
          </span>
          <span
            className={`w-2 h-2 rounded-full ${
              hasCustomKey ? 'bg-[#34D399]' : 'bg-amber-400'
            }`}
          />
        </motion.button>

        {/* User Profile Avatar with dropdown */}
        <div className="relative">
          <motion.button
            whileHover={{ y: -1 }}
            whileTap={{ y: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
            className="flex items-center gap-2 p-1 pl-1.5 rounded-2xl hover:bg-slate-800 border border-transparent hover:border-slate-700 transition-colors cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-sky-500 flex items-center justify-center text-white text-xs font-bold ring-1 ring-white/10 overflow-hidden font-mono shadow-sm">
              {getUserInitials(user.name)}
            </div>
            <div className="hidden lg:flex flex-col text-left">
              <span className="text-xs font-semibold text-white leading-tight">
                {user.name}
              </span>
              <span className="text-[10px] text-slate-400 font-mono leading-tight truncate max-w-[120px]">
                {user.institution}
              </span>
            </div>
            <ChevronDown className="w-3 h-3 text-slate-400 hidden lg:inline-block" />
          </motion.button>

          <AnimatePresence>
            {isUserDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-20"
                  onClick={() => setIsUserDropdownOpen(false)}
                />
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.15, ease: 'easeInOut' }}
                  className="absolute right-0 mt-2 w-72 p-4 rounded-2xl bg-[#1E293B] border border-slate-700 shadow-xl z-30"
                >
                  <div className="flex items-center gap-3 pb-3 border-b border-slate-700">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-sky-500 flex items-center justify-center text-white text-sm font-bold font-mono shadow-sm">
                      {getUserInitials(user.name)}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">{user.name}</h4>
                      <p className="text-[11px] text-slate-300">{user.program}</p>
                      <p className="text-[10px] text-[#818CF8] flex items-center gap-1 mt-0.5 font-mono">
                        <GraduationCap className="w-3 h-3" />
                        {user.institution}
                      </p>
                    </div>
                  </div>

                  <div className="py-2.5 space-y-1.5">
                    <div className="flex items-center justify-between text-xs py-1 px-1 text-slate-300">
                      <span>Viva Readiness Index</span>
                      <span className="font-mono font-bold text-[#34D399]">
                        {user.stats.vivaReadinessIndex}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs py-1 px-1 text-slate-300">
                      <span>Academic Streak</span>
                      <span className="font-mono font-bold text-amber-400">
                        {user.stats.academicStreakDays} Days
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs py-1 px-1 text-slate-300">
                      <span>Master Prompts</span>
                      <span className="font-mono font-bold text-[#38BDF8]">
                        {user.stats.masterPromptsCount}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2.5 border-t border-slate-700 space-y-1.5">
                    <button
                      onClick={() => {
                        setIsApiKeyModalOpen(true);
                        setIsUserDropdownOpen(false);
                      }}
                      className="w-full text-left py-2 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-xs text-slate-200 hover:text-white transition-colors border border-slate-700/60 cursor-pointer font-medium"
                    >
                      Gemini Engine Settings
                    </button>
                    <button
                      onClick={() => {
                        setIsUserDropdownOpen(false);
                        logout();
                      }}
                      className="w-full text-left py-2 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-xs text-rose-300 transition-colors flex items-center justify-between border border-rose-500/20 cursor-pointer"
                    >
                      <span className="font-medium">Sign Out</span>
                      <span className="text-[10px] font-mono opacity-70">Logout</span>
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
});
