import React from 'react';
import { motion } from 'framer-motion';
import {
  GraduationCap,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Cpu,
  Database,
  Code2,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  Flame,
  Clock,
  Layers,
  Award,
  FileUp,
  Zap,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { ModuleId } from '../types';

export const Overview: React.FC = () => {
  const { user, setActiveModuleId, setCurrentTab, masterPrompts, roadmapNodes } = useApp();
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  if (!user) return null;

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getModuleIcon = (iconName: string) => {
    switch (iconName) {
      case 'Cpu':
        return <Cpu className="w-5 h-5 text-[#38BDF8]" />;
      case 'Database':
        return <Database className="w-5 h-5 text-[#818CF8]" />;
      case 'Code2':
        return <Code2 className="w-5 h-5 text-[#34D399]" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-5 h-5 text-[#FBBF24]" />;
      default:
        return <Layers className="w-5 h-5 text-[#818CF8]" />;
    }
  };

  const completedRoadmapCount = roadmapNodes.filter((n) => n.status === 'completed').length;

  return (
    <div className="max-w-7xl mx-auto w-full space-y-8 pb-12">
      {/* Hero Calm EdTech Banner */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
        className="relative overflow-hidden rounded-3xl bg-slate-800/40 backdrop-blur-md border border-slate-700/60 p-6 sm:p-8 shadow-xl"
      >
        {/* Soft background ambient gradient */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/[0.05] rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-sky-500/[0.04] rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 text-xs font-mono font-medium shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-[#818CF8]" /> Academic Workspace Active
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 text-xs font-mono font-medium shadow-sm">
                <GraduationCap className="w-3.5 h-3.5 text-[#38BDF8]" /> {user.program}
              </span>
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
                Welcome back, <span className="text-[#818CF8]">{user.name}</span>
              </h1>
              <p className="text-sm sm:text-base text-slate-300 mt-1 max-w-2xl font-sans">
                {user.institution} • {user.program} track. Your next viva evaluation simulation is primed.
              </p>
            </div>
          </div>

          {/* Quick Action Buttons with Framer Motion hover */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <motion.button
              whileHover={{ y: -1 }}
              whileTap={{ y: 0 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              onClick={() => setCurrentTab('syllabus')}
              className="px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-xs sm:text-sm font-semibold text-slate-200 hover:text-white transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <FileUp className="w-4 h-4 text-[#38BDF8]" />
              <span>Syllabus Parser</span>
            </motion.button>
            <motion.button
              whileHover={{ y: -1 }}
              whileTap={{ y: 0 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              onClick={() => setCurrentTab('rctf')}
              className="px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-xs sm:text-sm font-semibold text-slate-200 hover:text-white transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <Cpu className="w-4 h-4 text-[#818CF8]" />
              <span>RCTF Sandbox</span>
            </motion.button>
            <motion.button
              whileHover={{ y: -1 }}
              whileTap={{ y: 0 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              onClick={() => setCurrentTab('viva')}
              className="px-5 py-2.5 rounded-2xl bg-[#818CF8] hover:bg-[#6366F1] active:bg-[#4F46E5] text-white font-semibold text-xs sm:text-sm transition-all shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer"
            >
              <span>Launch Live Viva</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>
        </div>

        {/* Highlight Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-700/60">
          <div className="space-y-1">
            <div className="text-xs text-slate-400 flex items-center gap-1.5 font-medium">
              <TrendingUp className="w-3.5 h-3.5 text-[#34D399]" /> Viva Readiness Index
            </div>
            <div className="text-3xl font-extrabold font-mono text-white flex items-baseline gap-1">
              {user.stats.vivaReadinessIndex}%
              <span className="text-xs font-semibold text-[#34D399] font-mono">+4% this week</span>
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-xs text-slate-400 flex items-center gap-1.5 font-medium">
              <Flame className="w-3.5 h-3.5 text-amber-400" /> Focus Streak
            </div>
            <div className="text-3xl font-extrabold font-mono text-amber-400 flex items-baseline gap-1">
              {user.stats.academicStreakDays} <span className="text-xs text-slate-400 font-sans font-normal">Days</span>
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-xs text-slate-400 flex items-center gap-1.5 font-medium">
              <Zap className="w-3.5 h-3.5 text-[#38BDF8]" /> Master Prompts
            </div>
            <div className="text-3xl font-extrabold font-mono text-[#38BDF8]">
              {masterPrompts.length} <span className="text-xs text-slate-400 font-sans font-normal">Compiled</span>
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-xs text-slate-400 flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#34D399]" /> Syllabus Nodes Cleared
            </div>
            <div className="text-3xl font-extrabold font-mono text-white">
              {completedRoadmapCount} <span className="text-xs text-slate-400 font-sans font-normal">/ {roadmapNodes.length}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Active Academic Modules Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <span>Active Academic Modules</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                Semester 2
              </span>
            </h2>
            <p className="text-xs text-slate-400">Curriculum-aligned course subjects</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {user.activeModules.map((module) => (
            <motion.div
              key={module.id}
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              className="group p-5 rounded-3xl bg-slate-800/40 backdrop-blur-md border border-slate-700/60 hover:border-slate-600 transition-all flex flex-col justify-between cursor-pointer shadow-md"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 rounded-2xl bg-slate-900/60 border border-slate-700/50">
                    {getModuleIcon(module.iconName)}
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-900/60 text-slate-400 font-semibold border border-slate-700/40">
                    {module.code}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white mb-1 group-hover:text-[#818CF8] transition-colors">
                  {module.name}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
                  {module.description}
                </p>
              </div>

              <div className="space-y-3 pt-3 border-t border-slate-700/50">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-400">Viva Readiness</span>
                  <span className="font-mono text-[#34D399] font-bold">
                    {module.readinessScore}%
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-900 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#34D399] transition-all duration-300"
                    style={{ width: `${module.readinessScore}%` }}
                  />
                </div>

                <motion.button
                  whileHover={{ y: -1 }}
                  whileTap={{ y: 0 }}
                  transition={{ duration: 0.2, ease: 'easeInOut' }}
                  onClick={() => {
                    setActiveModuleId(module.id as ModuleId);
                    setCurrentTab('viva');
                  }}
                  className="w-full mt-2 py-2 px-3 rounded-2xl bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white border border-slate-700 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <span>Practice Subject</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#818CF8]" />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom 2-Column Section: Hot Viva Topics & Recent Master Prompts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Master Prompts (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">Compiled Master Prompts</h2>
              <p className="text-xs text-slate-400">Pre-engineered structured academic prompt frameworks</p>
            </div>
            <motion.button
              whileHover={{ x: 1 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              onClick={() => setCurrentTab('rctf')}
              className="text-xs text-[#818CF8] hover:underline flex items-center gap-1 font-semibold cursor-pointer"
            >
              Build New <ArrowRight className="w-3 h-3" />
            </motion.button>
          </div>

          <div className="space-y-3">
            {masterPrompts.map((prompt) => (
              <motion.div
                key={prompt.id}
                whileHover={{ y: -1 }}
                transition={{ duration: 0.2, ease: 'easeInOut' }}
                className="p-5 rounded-3xl bg-slate-800/40 backdrop-blur-md border border-slate-700/60 hover:border-slate-600 transition-all space-y-3 shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/10 text-[#818CF8] border border-indigo-500/20 font-semibold">
                        {prompt.subject}
                      </span>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {prompt.createdAt}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-white">{prompt.title}</h3>
                  </div>

                  <motion.button
                    whileHover={{ y: -1 }}
                    whileTap={{ y: 0 }}
                    transition={{ duration: 0.2, ease: 'easeInOut' }}
                    onClick={() => handleCopy(prompt.id, prompt.compiledPrompt)}
                    className="p-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors shrink-0 flex items-center gap-1.5 text-xs font-semibold cursor-pointer shadow-sm"
                    title="Copy full compiled prompt"
                  >
                    {copiedId === prompt.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#34D399]" />
                        <span className="text-[11px] text-[#34D399] font-semibold">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span className="text-[11px]">Copy</span>
                      </>
                    )}
                  </motion.button>
                </div>

                <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-700/50 text-xs text-slate-300 font-mono line-clamp-2">
                  {prompt.compiledPrompt}
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {prompt.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-slate-900/60 text-slate-400 font-mono border border-slate-700/40"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Hot Viva Questions Alert Widget (1 col) */}
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <Award className="w-4 h-4 text-[#818CF8]" /> High-Probability Viva
            </h2>
            <p className="text-xs text-slate-400">Targeted viva questions based on active syllabus</p>
          </div>

          <div className="p-5 rounded-3xl bg-slate-800/40 backdrop-blur-md border border-slate-700/60 space-y-4 shadow-xl relative overflow-hidden">
            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-700/50 space-y-1.5">
                <span className="text-[10px] font-mono text-[#38BDF8] uppercase font-semibold">
                  Operating Systems
                </span>
                <p className="text-xs font-medium text-slate-200">
                  "Explain how Peterson’s algorithm prevents race conditions, and why hardware memory barriers are required on modern CPUs."
                </p>
                <div className="text-[10px] text-slate-400 font-mono">Frequency: High • Weightage: Advanced</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-700/50 space-y-1.5">
                <span className="text-[10px] font-mono text-[#818CF8] uppercase font-semibold">
                  Database Management Systems
                </span>
                <p className="text-xs font-medium text-slate-200">
                  "Why is BCNF strictly stronger than 3NF? Provide a relation that satisfies 3NF but violates BCNF."
                </p>
                <div className="text-[10px] text-slate-400 font-mono">Frequency: Critical • Weightage: Core</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-700/50 space-y-1.5">
                <span className="text-[10px] font-mono text-[#34D399] uppercase font-semibold">
                  Python & Data Structures
                </span>
                <p className="text-xs font-medium text-slate-200">
                  "Compare Red-Black Tree rotation overhead during insertion versus deletion. Which tree is flatter, AVL or Red-Black?"
                </p>
                <div className="text-[10px] text-slate-400 font-mono">Frequency: High • Weightage: Advanced</div>
              </div>
            </div>

            <motion.button
              whileHover={{ y: -1 }}
              whileTap={{ y: 0 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              onClick={() => setCurrentTab('viva')}
              className="w-full py-3 rounded-2xl bg-[#818CF8] hover:bg-[#6366F1] active:bg-[#4F46E5] text-white text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <span>Test with Examiner Terminal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};
