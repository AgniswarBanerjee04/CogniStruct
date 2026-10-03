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

  if (!user) return null;

  const toggleExpand = (id: string) => {
    setExpandedNodeId(expandedNodeId === id ? null : id);
  };

  const completedCount = roadmapNodes.filter((n) => n.status === 'completed').length;
  const progressPercent = Math.round((completedCount / roadmapNodes.length) * 100);

  return (
    <div className="max-w-5xl mx-auto w-full space-y-8 pb-16">
      {/* Header & Master Progress */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 sm:p-8 rounded-3xl bg-slate-800/40 backdrop-blur-md border border-slate-700/60 shadow-xl relative overflow-hidden">
        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-medium">
              Curriculum Roadmap
            </span>
            <span className="text-xs text-slate-300 font-medium">{activeModule.name}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Syllabus Mastery Timeline
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Sequential technical milestones structured for university examinations and practical viva defense.
          </p>
        </div>

        {/* Global Progress Bar */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-700/60 space-y-2.5 shrink-0 min-w-[240px] relative z-10">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-300">Mastery Progress</span>
            <span className="font-mono font-bold text-[#34D399]">{progressPercent}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden">
            <div
              className="h-full rounded-full bg-[#34D399] transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="text-[11px] text-slate-400 flex justify-between font-mono">
            <span>{completedCount} of {roadmapNodes.length} Nodes</span>
            <span className="text-slate-300 font-medium">{user.name}</span>
          </div>
        </div>
      </div>

      {/* Vertical Timeline Container */}
      <div className="relative pl-6 sm:pl-10 space-y-6">
        {/* Timeline spine vertical line */}
        <div className="absolute left-[15px] sm:[23px] top-6 bottom-6 w-0.5 bg-slate-700/80 rounded-full" />

        {roadmapNodes.map((node, index) => {
          const isCompleted = node.status === 'completed';
          const isInProgress = node.status === 'in-progress';
          const isExpanded = expandedNodeId === node.id;

          return (
            <motion.div
              key={node.id}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.25, delay: index * 0.04, ease: 'easeInOut' }}
              className="relative group"
            >
              {/* Timeline Node Badge Icon (Clickable) */}
              <button
                onClick={() => toggleNodeCompletion(node.id)}
                className={`absolute -left-[27px] sm:-left-[35px] top-4 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-colors z-10 cursor-pointer ${
                  isCompleted
                    ? 'bg-[#34D399] text-slate-950 ring-4 ring-[#0F172A]'
                    : isInProgress
                    ? 'bg-[#818CF8] text-white ring-4 ring-[#0F172A]'
                    : 'bg-slate-800 border border-slate-700 text-slate-400 hover:text-white ring-4 ring-[#0F172A]'
                }`}
                title={isCompleted ? 'Click to mark incomplete' : 'Click to mark complete'}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4 stroke-[3]" />
                ) : (
                  <span className="text-[11px] font-mono font-bold">D{node.day}</span>
                )}
              </button>

              {/* Main Node Card with gentle hover */}
              <motion.div
                whileHover={{ y: -1 }}
                transition={{ duration: 0.2, ease: 'easeInOut' }}
                className={`rounded-3xl bg-slate-800/40 backdrop-blur-md transition-all overflow-hidden border ${
                  isInProgress
                    ? 'border-indigo-500/50 shadow-md'
                    : isCompleted
                    ? 'border-slate-700/60 hover:border-slate-600'
                    : 'border-slate-700/60 hover:border-slate-600'
                }`}
              >
                {/* Header Row */}
                <div
                  onClick={() => toggleExpand(node.id)}
                  className="p-5 sm:p-6 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none hover:bg-slate-800/30 transition-colors"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-semibold border border-slate-700">
                        Day {node.day}
                      </span>
                      <span
                        className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full uppercase font-semibold ${
                          node.difficulty === 'Advanced'
                            ? 'bg-indigo-500/15 text-[#818CF8] border border-indigo-500/30'
                            : node.difficulty === 'Intermediate'
                            ? 'bg-sky-500/15 text-[#38BDF8] border border-sky-500/30'
                            : 'bg-emerald-500/15 text-[#34D399] border border-emerald-500/30'
                        }`}
                      >
                        {node.difficulty}
                      </span>
                      <span
                        className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full font-medium ${
                          isCompleted
                            ? 'bg-emerald-500/15 text-[#34D399]'
                            : isInProgress
                            ? 'bg-indigo-500/15 text-[#818CF8]'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {isCompleted ? '✓ Completed' : isInProgress ? '● In Progress' : '○ Upcoming'}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-white tracking-tight group-hover:text-[#818CF8] transition-colors">
                      {node.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                      {node.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleNodeCompletion(node.id);
                      }}
                      className={`px-3.5 py-1.5 rounded-2xl border text-xs font-semibold transition-colors cursor-pointer ${
                        isCompleted
                          ? 'bg-emerald-500/15 border-emerald-500/30 text-[#34D399] hover:bg-emerald-500/25'
                          : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-750'
                      }`}
                    >
                      {isCompleted ? 'Completed' : 'Mark Done'}
                    </button>

                    <div className="p-1.5 rounded-xl text-slate-400 group-hover:text-white">
                      {isExpanded ? <ChevronUp className="w-5 h-5 text-[#818CF8]" /> : <ChevronDown className="w-5 h-5" />}
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
                      transition={{ duration: 0.2, ease: 'easeInOut' }}
                      className="px-5 pb-5 sm:px-6 sm:pb-6 pt-2 border-t border-slate-700/60 space-y-4"
                    >
                      {/* Key Concepts Chips */}
                      <div>
                        <div className="text-[11px] font-mono text-slate-400 uppercase font-semibold tracking-wider mb-2">
                          Core Architectural Primitives:
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {node.keyConcepts.map((concept, i) => (
                            <span
                              key={i}
                              className="text-xs px-3 py-1 rounded-xl bg-slate-900/60 border border-slate-700/60 text-slate-300 font-mono shadow-sm"
                            >
                              {concept}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Expected Viva Questions Section */}
                      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-700/60 space-y-2">
                        <div className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                          <HelpCircle className="w-3.5 h-3.5 text-amber-400" /> High-Probability Examiner Inquiries:
                        </div>
                        <ul className="space-y-2">
                          {node.expectedVivaQuestions.map((q, idx) => (
                            <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                              <span className="font-mono text-[#818CF8] font-bold shrink-0">Q{idx + 1}:</span>
                              <span>"{q}"</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Quick Revision Summary */}
                      <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-slate-200">
                        <span className="font-semibold text-white font-mono block mb-1">
                          ⚡ 60-Second Viva Revision Digest:
                        </span>
                        {node.revisionSummary}
                      </div>

                      {/* Quick Action Footer */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                        <span className="text-[11px] text-slate-400 font-mono">
                          Curriculum Syllabus Specification
                        </span>
                        <motion.button
                          whileHover={{ y: -1 }}
                          whileTap={{ y: 0 }}
                          transition={{ duration: 0.2, ease: 'easeInOut' }}
                          onClick={() => setCurrentTab('viva')}
                          className="px-5 py-2.5 rounded-2xl bg-[#818CF8] hover:bg-[#6366F1] active:bg-[#4F46E5] text-white font-semibold text-xs transition-all shadow-md hover:shadow-lg flex items-center gap-1.5 cursor-pointer"
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
