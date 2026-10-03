import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  ChevronUp,
  ArrowRight,
  HelpCircle,
  Check,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Roadmap: React.FC = () => {
  const { roadmapNodes, toggleNodeCompletion, setCurrentTab, user, activeModule } = useApp();
  const [expandedNodeId, setExpandedNodeId] = useState<string | null>(roadmapNodes[0]?.id || null);

  const toggleExpand = (id: string) => {
    setExpandedNodeId(expandedNodeId === id ? null : id);
  };

  const completedCount = roadmapNodes.filter((n) => n.status === 'completed').length;
  const progressPercent = Math.round((completedCount / roadmapNodes.length) * 100);

  return (
    <div className="max-w-5xl mx-auto w-full space-y-8 pb-16">
      {/* Header & Master Progress */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#170E33] via-[#120B24] to-[#0A0714] border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#00E5FF]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-[#00E5FF]/15 text-[#00E5FF] border border-[#00E5FF]/30 font-bold shadow-sm shadow-[#00E5FF]/20">
              Curriculum Roadmap
            </span>
            <span className="text-xs text-slate-300 font-medium">{activeModule.name}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Syllabus Mastery Timeline
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Sequential day-by-day technical milestones designed for MCA university examinations and oral viva defense.
          </p>
        </div>

        {/* Global Progress Radial / Bar */}
        <div className="p-4 rounded-2xl glass-panel space-y-2.5 shrink-0 min-w-[240px] relative z-10 border border-white/10">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-300">Mastery Progress</span>
            <span className="font-mono font-extrabold text-[#39FF14]">{progressPercent}%</span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-black/70 overflow-hidden p-0.5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#FF007F] via-[#00E5FF] to-[#39FF14] transition-all duration-700 shadow-sm shadow-[#39FF14]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="text-[11px] text-slate-400 flex justify-between font-mono">
            <span>{completedCount} of {roadmapNodes.length} Nodes</span>
            <span className="text-[#00E5FF] font-semibold">{user.name}</span>
          </div>
        </div>
      </div>

      {/* Vertical Timeline Container */}
      <div className="relative pl-6 sm:pl-10 space-y-8">
        {/* Timeline spine vertical line with cyber gradient */}
        <div className="absolute left-[15px] sm:left-[23px] top-6 bottom-6 w-1 bg-gradient-to-b from-[#00E5FF] via-[#FF007F] to-[#39FF14] rounded-full shadow-[0_0_12px_rgba(0,229,255,0.4)]" />

        {roadmapNodes.map((node, index) => {
          const isCompleted = node.status === 'completed';
          const isInProgress = node.status === 'in-progress';
          const isExpanded = expandedNodeId === node.id;

          return (
            <motion.div
              key={node.id}
              initial={{ opacity: 0, x: -15 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.35, delay: index * 0.08 }}
              className="relative group"
            >
              {/* Timeline Node Badge Icon (Clickable to toggle completion) */}
              <motion.button
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => toggleNodeCompletion(node.id)}
                className={`absolute -left-[27px] sm:-left-[35px] top-4 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all z-10 cursor-pointer ${
                  isCompleted
                    ? 'bg-[#39FF14] text-black shadow-[0_0_15px_rgba(57,255,20,0.6)] ring-4 ring-[#0B0914]'
                    : isInProgress
                    ? 'bg-[#00E5FF] text-black shadow-[0_0_18px_rgba(0,229,255,0.8)] ring-4 ring-[#0B0914] animate-pulse'
                    : 'bg-[#150F2C] border border-white/20 text-slate-400 hover:text-white hover:border-[#00E5FF] ring-4 ring-[#0B0914]'
                }`}
                title={isCompleted ? 'Click to mark incomplete' : 'Click to mark complete'}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4 stroke-[3]" />
                ) : (
                  <span className="text-[11px] font-mono font-bold">D{node.day}</span>
                )}
              </motion.button>

              {/* Main Node Card with whileHover */}
              <motion.div
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.2 }}
                className={`rounded-3xl glass-panel transition-all overflow-hidden ${
                  isInProgress
                    ? 'border-[#00E5FF]/60 shadow-[0_0_30px_rgba(0,229,255,0.25)]'
                    : isCompleted
                    ? 'border-[#39FF14]/40 hover:border-[#39FF14]/70 hover:shadow-[0_0_25px_rgba(57,255,20,0.2)]'
                    : 'border-white/10 hover:border-[#00E5FF]/50 hover:shadow-[0_0_25px_rgba(0,229,255,0.15)]'
                }`}
              >
                {/* Header Row */}
                <div
                  onClick={() => toggleExpand(node.id)}
                  className="p-5 sm:p-6 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none hover:bg-white/[0.02] transition-colors"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 text-slate-300 font-bold">
                        Day {node.day}
                      </span>
                      <span
                        className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full uppercase font-extrabold ${
                          node.difficulty === 'Advanced'
                            ? 'bg-[#FF007F]/20 text-[#FF007F] border border-[#FF007F]/40 shadow-sm shadow-[#FF007F]/20'
                            : node.difficulty === 'Intermediate'
                            ? 'bg-[#FFE600]/20 text-[#FFE600] border border-[#FFE600]/40'
                            : 'bg-[#39FF14]/20 text-[#39FF14] border border-[#39FF14]/40'
                        }`}
                      >
                        {node.difficulty}
                      </span>
                      <span
                        className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold ${
                          isCompleted
                            ? 'bg-[#39FF14]/15 text-[#39FF14]'
                            : isInProgress
                            ? 'bg-[#00E5FF]/15 text-[#00E5FF] animate-pulse'
                            : 'bg-white/5 text-slate-400'
                        }`}
                      >
                        {isCompleted ? '✓ Completed' : isInProgress ? '● In Progress' : '○ Upcoming'}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-extrabold text-white tracking-tight group-hover:text-[#00E5FF] transition-colors">
                      {node.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                      {node.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <motion.button
                      whileHover={{ scale: 1.06 }}
                      whileTap={{ scale: 0.94 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleNodeCompletion(node.id);
                      }}
                      className={`px-3.5 py-1.5 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                        isCompleted
                          ? 'bg-[#39FF14]/20 border-[#39FF14]/40 text-[#39FF14] hover:bg-[#39FF14]/30 shadow-sm shadow-[#39FF14]/20'
                          : 'bg-white/5 border-white/10 text-slate-300 hover:text-white hover:border-[#00E5FF]/40'
                      }`}
                    >
                      {isCompleted ? 'Completed' : 'Mark Done'}
                    </motion.button>

                    <div className="p-1.5 rounded-xl text-slate-400 hover:text-white">
                      {isExpanded ? <ChevronUp className="w-5 h-5 text-[#00E5FF]" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </div>
                </div>

                {/* Expanded Accordion Body */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="px-5 pb-5 sm:px-6 sm:pb-6 pt-2 border-t border-white/10 space-y-4"
                    >
                      {/* Key Concepts Chips */}
                      <div>
                        <div className="text-[11px] font-mono text-[#00E5FF] uppercase font-bold tracking-wider mb-2">
                          Core Architectural Primitives:
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {node.keyConcepts.map((concept, i) => (
                            <motion.span
                              key={i}
                              whileHover={{ scale: 1.05 }}
                              className="text-xs px-3 py-1 rounded-xl bg-black/60 border border-white/10 text-slate-200 font-mono shadow-sm cursor-default"
                            >
                              {concept}
                            </motion.span>
                          ))}
                        </div>
                      </div>

                      {/* Expected Viva Questions Section */}
                      <div className="p-4 rounded-2xl bg-black/50 border border-white/10 space-y-2">
                        <div className="text-xs font-bold text-[#FFE600] flex items-center gap-1.5">
                          <HelpCircle className="w-3.5 h-3.5" /> High-Probability Examiner Inquiries:
                        </div>
                        <ul className="space-y-2">
                          {node.expectedVivaQuestions.map((q, idx) => (
                            <li key={idx} className="text-xs text-slate-200 flex items-start gap-2">
                              <span className="font-mono text-[#00E5FF] font-bold shrink-0">Q{idx + 1}:</span>
                              <span>"{q}"</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Quick Revision Summary */}
                      <div className="p-4 rounded-2xl bg-[#00E5FF]/10 border border-[#00E5FF]/30 text-xs text-[#00E5FF]">
                        <span className="font-extrabold text-white font-mono block mb-1">
                          ⚡ 60-Second Viva Revision Digest:
                        </span>
                        {node.revisionSummary}
                      </div>

                      {/* Quick Action Footer */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                        <span className="text-[11px] text-slate-400 font-mono">
                          MCA Semester 2 Syllabus Specification
                        </span>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setCurrentTab('viva')}
                          className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#00E5FF] to-[#6366F1] hover:from-[#00E5FF] hover:to-[#FF007F] text-black font-extrabold text-xs transition-all shadow-[0_0_15px_rgba(0,229,255,0.4)] flex items-center gap-1.5 cursor-pointer"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Simulate Viva for This Topic</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
