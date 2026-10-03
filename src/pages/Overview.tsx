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

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getModuleIcon = (iconName: string) => {
    switch (iconName) {
      case 'Cpu':
        return <Cpu className="w-5 h-5 text-[#00E5FF]" />;
      case 'Database':
        return <Database className="w-5 h-5 text-[#A855F7]" />;
      case 'Code2':
        return <Code2 className="w-5 h-5 text-[#39FF14]" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-5 h-5 text-[#FF007F]" />;
      default:
        return <Layers className="w-5 h-5 text-[#00E5FF]" />;
    }
  };

  const completedRoadmapCount = roadmapNodes.filter((n) => n.status === 'completed').length;

  return (
    <div className="max-w-7xl mx-auto w-full space-y-8 pb-12">
      {/* Hero Gamified Cyber Banner */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#170E33] via-[#120B24] to-[#0A0714] border border-white/10 p-6 sm:p-8 shadow-2xl relative"
      >
        {/* Glow gradients */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#00E5FF]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-[#FF007F]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00E5FF]/15 border border-[#00E5FF]/40 text-[#00E5FF] text-xs font-mono font-bold shadow-sm shadow-[#00E5FF]/20">
                <Sparkles className="w-3.5 h-3.5 text-[#00E5FF]" /> Cyber-Academic Engine Active
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF007F]/15 border border-[#FF007F]/40 text-[#FF007F] text-xs font-mono font-bold shadow-sm shadow-[#FF007F]/20">
                <GraduationCap className="w-3.5 h-3.5 text-[#FF007F]" /> {user.program}
              </span>
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
                Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] via-[#A855F7] to-[#FF007F]">{user.name}</span>
              </h1>
              <p className="text-sm sm:text-base text-slate-300 mt-1 max-w-2xl font-sans">
                {user.institution} • MCA Computer Systems Engineering track. Your next viva evaluation simulation is primed.
              </p>
            </div>
          </div>

          {/* Quick Action Buttons with Framer Motion hover */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentTab('syllabus')}
              className="px-4 py-2.5 rounded-2xl bg-white/5 hover:bg-[#00E5FF]/15 border border-[#00E5FF]/30 text-xs sm:text-sm font-semibold text-[#00E5FF] transition-all flex items-center gap-2 cursor-pointer shadow-sm shadow-[#00E5FF]/10"
            >
              <FileUp className="w-4 h-4 text-[#00E5FF]" />
              <span>Syllabus Parser</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentTab('rctf')}
              className="px-4 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/15 text-xs sm:text-sm font-semibold text-white transition-all flex items-center gap-2 cursor-pointer"
            >
              <Cpu className="w-4 h-4 text-[#A855F7]" />
              <span>RCTF Sandbox</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentTab('viva')}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#00E5FF] via-[#6366F1] to-[#FF007F] hover:from-[#00E5FF] hover:to-[#FF007F] text-black font-extrabold text-xs sm:text-sm transition-all shadow-[0_0_20px_rgba(0,229,255,0.4)] flex items-center gap-2 cursor-pointer"
            >
              <span>Launch Live Viva</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>
        </div>

        {/* Highlight Gamified Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/10">
          <div className="space-y-1">
            <div className="text-xs text-slate-400 flex items-center gap-1.5 font-semibold">
              <TrendingUp className="w-3.5 h-3.5 text-[#39FF14]" /> Viva Readiness Index
            </div>
            <div className="text-3xl font-extrabold font-mono text-white flex items-baseline gap-1">
              {user.stats.vivaReadinessIndex}%
              <span className="text-xs font-semibold text-[#39FF14] font-mono">+4% this week</span>
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-xs text-slate-400 flex items-center gap-1.5 font-semibold">
              <Flame className="w-3.5 h-3.5 text-[#FF007F]" /> Focus Streak
            </div>
            <div className="text-3xl font-extrabold font-mono text-[#FF007F] flex items-baseline gap-1">
              {user.stats.academicStreakDays} <span className="text-xs text-slate-400 font-sans font-normal">Days 🔥</span>
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-xs text-slate-400 flex items-center gap-1.5 font-semibold">
              <Zap className="w-3.5 h-3.5 text-[#00E5FF]" /> Master Prompts
            </div>
            <div className="text-3xl font-extrabold font-mono text-[#00E5FF]">
              {masterPrompts.length} <span className="text-xs text-slate-400 font-sans font-normal">Synthesized</span>
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-xs text-slate-400 flex items-center gap-1.5 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#39FF14]" /> Syllabus Nodes Cleared
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
              <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/30">
                Semester 2
              </span>
            </h2>
            <p className="text-xs text-slate-400">Curriculum-aligned course subjects for MCA</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {user.activeModules.map((module) => (
            <motion.div
              key={module.id}
              whileHover={{ scale: 1.04, y: -4 }}
              transition={{ duration: 0.2 }}
              className="group p-5 rounded-3xl glass-panel hover:border-[#00E5FF]/50 hover:shadow-[0_0_25px_rgba(0,229,255,0.15)] flex flex-col justify-between cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10 group-hover:scale-110 transition-transform">
                    {getModuleIcon(module.iconName)}
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/5 text-slate-400 font-semibold">
                    {module.code}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white mb-1 group-hover:text-[#00E5FF] transition-colors">
                  {module.name}
                </h3>
                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed mb-4">
                  {module.description}
                </p>
              </div>

              <div className="space-y-3 pt-3 border-t border-white/5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-400">Viva Readiness</span>
                  <span className="font-mono text-[#00E5FF] font-bold">
                    {module.readinessScore}%
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-black/60 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#6366F1] via-[#00E5FF] to-[#39FF14]"
                    style={{ width: `${module.readinessScore}%` }}
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => {
                    setActiveModuleId(module.id as ModuleId);
                    setCurrentTab('viva');
                  }}
                  className="w-full mt-2 py-2 px-3 rounded-2xl bg-white/5 hover:bg-[#00E5FF]/15 hover:text-[#00E5FF] hover:border-[#00E5FF]/40 border border-white/10 text-xs font-semibold text-slate-200 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Practice Subject</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#00E5FF]" />
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
              whileHover={{ scale: 1.05 }}
              onClick={() => setCurrentTab('rctf')}
              className="text-xs text-[#00E5FF] hover:underline flex items-center gap-1 font-bold cursor-pointer"
            >
              Build New <ArrowRight className="w-3 h-3" />
            </motion.button>
          </div>

          <div className="space-y-3">
            {masterPrompts.map((prompt) => (
              <motion.div
                key={prompt.id}
                whileHover={{ scale: 1.015 }}
                className="p-5 rounded-3xl glass-panel hover:border-[#FF007F]/40 hover:shadow-[0_0_20px_rgba(255,0,127,0.1)] transition-all space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/30 font-bold">
                        {prompt.subject}
                      </span>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {prompt.createdAt}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-white">{prompt.title}</h3>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleCopy(prompt.id, prompt.compiledPrompt)}
                    className="p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-colors shrink-0 flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
                    title="Copy full compiled prompt"
                  >
                    {copiedId === prompt.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#39FF14]" />
                        <span className="text-[11px] text-[#39FF14] font-bold">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span className="text-[11px]">Copy</span>
                      </>
                    )}
                  </motion.button>
                </div>

                <div className="p-3 rounded-2xl bg-black/50 border border-white/5 text-xs text-slate-300 font-mono line-clamp-2">
                  {prompt.compiledPrompt}
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {prompt.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 text-slate-400 font-mono"
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
              <Award className="w-4 h-4 text-[#FF007F]" /> High-Probability Viva
            </h2>
            <p className="text-xs text-slate-400">Targeted viva questions based on active syllabus</p>
          </div>

          <div className="p-5 rounded-3xl glass-panel space-y-4 shadow-xl relative overflow-hidden">
            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-black/50 border border-white/5 space-y-1.5">
                <span className="text-[10px] font-mono text-[#00E5FF] uppercase font-bold">
                  Operating Systems
                </span>
                <p className="text-xs font-semibold text-slate-200">
                  "Explain how Peterson’s algorithm prevents race conditions, and why hardware memory barriers are required on modern CPUs."
                </p>
                <div className="text-[10px] text-slate-400 font-mono">Frequency: High • Weightage: Advanced</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-black/50 border border-white/5 space-y-1.5">
                <span className="text-[10px] font-mono text-[#A855F7] uppercase font-bold">
                  Database Management Systems
                </span>
                <p className="text-xs font-semibold text-slate-200">
                  "Why is BCNF strictly stronger than 3NF? Provide a relation that satisfies 3NF but violates BCNF."
                </p>
                <div className="text-[10px] text-slate-400 font-mono">Frequency: Critical • Weightage: Core</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-black/50 border border-white/5 space-y-1.5">
                <span className="text-[10px] font-mono text-[#39FF14] uppercase font-bold">
                  Python & Data Structures
                </span>
                <p className="text-xs font-semibold text-slate-200">
                  "Compare Red-Black Tree rotation overhead during insertion versus deletion. Which tree is flatter, AVL or Red-Black?"
                </p>
                <div className="text-[10px] text-slate-400 font-mono">Frequency: High • Weightage: Advanced</div>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setCurrentTab('viva')}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#00E5FF]/20 via-[#6366F1]/20 to-[#FF007F]/20 text-[#00E5FF] hover:text-white border border-[#00E5FF]/40 text-xs font-extrabold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-[#00E5FF]/10"
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
