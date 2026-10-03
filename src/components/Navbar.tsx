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

  const getModuleIcon = (iconName: string) => {
    switch (iconName) {
      case 'Cpu':
        return <Cpu className="w-4 h-4 text-cyan-400" />;
      case 'Database':
        return <Database className="w-4 h-4 text-indigo-400" />;
      case 'Code2':
        return <Code2 className="w-4 h-4 text-emerald-400" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-4 h-4 text-amber-400" />;
      default:
        return <BookOpen className="w-4 h-4 text-cyan-400" />;
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full h-16 bg-[#0B0914]/90 backdrop-blur-md border-b border-white/10 px-4 lg:px-8 flex items-center justify-between transition-colors">
      {/* Left: Mobile Toggle + Logo */}
      <div className="flex items-center gap-4">
        {onToggleMobileSidebar && (
          <button
            onClick={onToggleMobileSidebar}
            className="p-2 -ml-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 md:hidden"
            aria-label="Toggle navigation menu"
          >
            {isMobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        )}

        <div className="flex items-center gap-3 select-none">
          {/* Cyan Neural Node Icon with pulse */}
          <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-[#00E5FF]/25 via-[#6366F1]/20 to-[#FF007F]/20 border border-[#00E5FF]/40 cyber-glow-cyan">
            <svg
              className="w-5 h-5 text-[#00E5FF]"
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
            <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00E5FF] opacity-80"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00E5FF]"></span>
            </span>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-base font-extrabold tracking-tight text-white font-sans">
                Cogni<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] via-[#A855F7] to-[#FF007F]">Struct</span>
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/30 font-semibold shadow-sm shadow-[#00E5FF]/20">
                PRO 2.4
              </span>
            </div>
            <span className="text-[10px] text-slate-400 hidden sm:inline-block">
              AI Academic & Engineering Engine
            </span>
          </div>
        </div>
      </div>

      {/* Center: Current Active Subject Selector Dropdown */}
      <div className="relative">
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => setIsSubjectDropdownOpen(!isSubjectDropdownOpen)}
          className="flex items-center gap-2.5 px-3 py-1.5 rounded-2xl bg-white/5 border border-white/10 hover:border-[#00E5FF]/50 text-xs font-semibold text-slate-200 transition-all hover:shadow-[0_0_20px_rgba(0,229,255,0.2)] group cursor-pointer"
        >
          <div className="p-1 rounded-xl bg-white/5 group-hover:bg-[#00E5FF]/15 transition-colors">
            {getModuleIcon(activeModule.iconName)}
          </div>
          <span className="max-w-[140px] sm:max-w-[220px] truncate text-white font-medium">
            {activeModule.name}
          </span>
          <span className="hidden md:inline-block text-[10px] px-1.5 py-0.5 rounded-lg bg-white/5 text-[#00E5FF] font-mono border border-white/5">
            {activeModule.code}
          </span>
          <ChevronDown
            className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
              isSubjectDropdownOpen ? 'rotate-180 text-[#00E5FF]' : ''
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
                initial={{ opacity: 0, y: 8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.98 }}
                transition={{ duration: 0.15 }}
                className="absolute left-0 sm:left-auto sm:right-0 mt-2 w-72 sm:w-80 p-2.5 rounded-3xl bg-[#0E0B1A]/95 backdrop-blur-md border border-white/10 shadow-[0_0_35px_rgba(0,229,255,0.15)] z-30 divide-y divide-white/5"
              >
                <div className="px-3 py-2 text-[11px] font-bold text-[#00E5FF] uppercase font-mono tracking-wider">
                  Active MCA Modules
                </div>
                <div className="py-1 space-y-1">
                  {user.activeModules.map((module) => {
                    const isSelected = module.id === activeModule.id;
                    return (
                      <motion.button
                        key={module.id}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => {
                          setActiveModuleId(module.id as ModuleId);
                          setIsSubjectDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between p-2.5 rounded-2xl text-left text-xs transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-[#00E5FF]/15 text-[#00E5FF] border border-[#00E5FF]/40 shadow-sm shadow-[#00E5FF]/20'
                            : 'text-slate-300 hover:bg-white/5 hover:text-white border border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="p-1.5 rounded-xl bg-black/40 border border-white/5">
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
                        {isSelected && <Check className="w-4 h-4 text-[#00E5FF]" />}
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Right: Gemini Status Pill + User Avatar */}
      <div className="flex items-center gap-3">
        {/* Gemini Engine Indicator Button with scale */}
        <motion.button
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsApiKeyModalOpen(true)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl border text-[11px] font-mono font-bold transition-all cursor-pointer ${
            hasCustomKey
              ? 'bg-[#00E5FF]/10 border-[#00E5FF]/30 text-[#00E5FF] hover:bg-[#00E5FF]/20 shadow-[0_0_15px_rgba(0,229,255,0.2)]'
              : 'bg-[#FF007F]/10 border-[#FF007F]/30 text-[#FF007F] hover:bg-[#FF007F]/20'
          }`}
          title="Click to configure Gemini API Key"
        >
          <Sparkles className={`w-3.5 h-3.5 ${hasCustomKey ? 'text-[#00E5FF]' : 'text-[#FF007F]'}`} />
          <span className="hidden sm:inline">
            {hasCustomKey ? 'Gemini 1.5 Flash' : 'AI Simulator'}
          </span>
          <span
            className={`w-2 h-2 rounded-full ${
              hasCustomKey
                ? 'bg-[#00E5FF] shadow-[0_0_8px_#00E5FF]'
                : 'bg-[#39FF14] shadow-[0_0_8px_#39FF14]'
            }`}
          />
        </motion.button>

        {/* User Profile Avatar with dropdown */}
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
            className="flex items-center gap-2 p-1 pl-1.5 rounded-2xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-colors cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#FF007F] via-[#6366F1] to-[#00E5FF] flex items-center justify-center text-white text-xs font-bold ring-1 ring-white/20 shadow-sm overflow-hidden font-mono">
              AB
            </div>
            <div className="hidden lg:flex flex-col text-left">
              <span className="text-xs font-bold text-white leading-tight">
                {user.name}
              </span>
              <span className="text-[10px] text-[#00E5FF] font-mono leading-tight">
                MCA • MSIT
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
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-72 p-4 rounded-3xl bg-[#0E0B1A]/95 backdrop-blur-md border border-white/10 shadow-[0_0_35px_rgba(255,0,127,0.15)] z-30"
                >
                  <div className="flex items-center gap-3 pb-3 border-b border-white/10">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FF007F] via-[#6366F1] to-[#00E5FF] flex items-center justify-center text-white text-sm font-bold font-mono shadow-md">
                      AB
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">{user.name}</h4>
                      <p className="text-[11px] text-slate-300">{user.program}</p>
                      <p className="text-[10px] text-[#00E5FF] flex items-center gap-1 mt-0.5 font-mono">
                        <GraduationCap className="w-3 h-3" />
                        {user.institution}
                      </p>
                    </div>
                  </div>

                  <div className="py-2.5 space-y-1.5">
                    <div className="flex items-center justify-between text-xs py-1 px-1 text-slate-300">
                      <span>Viva Readiness Index</span>
                      <span className="font-mono font-bold text-[#39FF14]">
                        {user.stats.vivaReadinessIndex}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs py-1 px-1 text-slate-300">
                      <span>Academic Streak</span>
                      <span className="font-mono font-bold text-[#FF007F]">
                        🔥 {user.stats.academicStreakDays} Days
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs py-1 px-1 text-slate-300">
                      <span>Master Prompts</span>
                      <span className="font-mono font-bold text-[#00E5FF]">
                        {user.stats.masterPromptsCount}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2.5 border-t border-white/10 space-y-1.5">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setIsApiKeyModalOpen(true);
                        setIsUserDropdownOpen(false);
                      }}
                      className="w-full text-left py-2 px-3 rounded-xl bg-white/5 hover:bg-[#00E5FF]/15 text-xs text-slate-200 hover:text-[#00E5FF] transition-colors border border-transparent hover:border-[#00E5FF]/30 cursor-pointer font-semibold"
                    >
                      Gemini Engine Settings
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setIsUserDropdownOpen(false);
                        logout();
                      }}
                      className="w-full text-left py-2 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-xs text-rose-300 transition-colors flex items-center justify-between border border-rose-500/20 cursor-pointer"
                    >
                      <span className="font-semibold">Terminate Session</span>
                      <span className="text-[10px] font-mono opacity-70">Logout</span>
                    </motion.button>
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
