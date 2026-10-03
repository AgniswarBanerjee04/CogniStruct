import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload,
  FileText,
  Sparkles,
  AlertCircle,
  BookOpen,
  ArrowRight,
  Layers,
  X,
  Flame,
  Check,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  parseSyllabusWithGemini,
  generateTopicTechnicalBreakdown,
  hasValidApiKey,
} from '../services/geminiService';
import type { ParsedSyllabusTopic } from '../types';

export const SyllabusUpload: React.FC = () => {
  const {
    activeModule,
    parsedSyllabusTopics,
    setParsedSyllabusTopics,
    toggleParsedTopicCompletion,
    setIsApiKeyModalOpen,
    setCurrentTab,
  } = useApp();

  const [syllabusText, setSyllabusText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedTopicForExplanation, setSelectedTopicForExplanation] = useState<ParsedSyllabusTopic | null>(null);
  const [explanationContent, setExplanationContent] = useState<string | null>(null);
  const [isGeneratingExplanation, setIsGeneratingExplanation] = useState(false);

  // Drag and drop state
  const [isDragging, setIsDragging] = useState(false);

  const sampleSyllabusText = `UNIVERSITY SYLLABUS: COMPUTER SCIENCE - OPERATING SYSTEMS & CONCURRENCY
MODULE 1: Kernel Architecture & Process Management
- Process Control Block (PCB), Context Switching Mechanics, State Transitions
- CPU Scheduling: FCFS, Shortest Job First, Multi-Level Feedback Queues
- POSIX Process Creation (fork, exec, wait, exit)

MODULE 2: Concurrency & Synchronization (High Weightage)
- Critical Section Problem, Peterson's Algorithm Proof & Modern CPU Memory Barriers
- Mutex Locks vs Counting Semaphores (wait and signal operations)
- Classical Synchronization: Bounded Buffer, Dining Philosophers, Reader-Writer
- Priority Inversion and Priority Inheritance Protocol

MODULE 3: Deadlock Characterization (High Weightage)
- Coffman's Four Necessary Conditions, Resource Allocation Graphs (RAG)
- Deadlock Avoidance: Dijkstra's Banker's Algorithm (Safety and Resource-Request Algorithms)
- Deadlock Detection, Recovery and Ostrich Algorithm

MODULE 4: Memory Management & Virtual Paging
- Logical vs Physical Address Space, Paging Hardware with TLB
- Effective Access Time (EAT) calculation, Multi-level Paging
- Page Replacement Algorithms: FIFO, Belady's Anomaly, LRU, Optimal MIN, Clock (Second Chance)
- Thrashing and Working Set Model

MODULE 5: Storage & File Systems
- Disk Scheduling: FCFS, SSTF, SCAN, C-SCAN, LOOK, C-LOOK
- Inode Data Structures, File Allocation Methods (Indexed, Linked)
- Crash Consistency, Write-Ahead Logging (WAL) and Journaling in Ext4`;

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileRead(files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileRead(e.target.files[0]);
    }
  };

  const handleFileRead = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setSyllabusText(content);
      }
    };
    reader.readAsText(file);
  };

  const handleAnalyzeSyllabus = async () => {
    if (!syllabusText.trim()) {
      setErrorMessage('Please paste or upload syllabus text to analyze.');
      return;
    }

    if (!hasValidApiKey()) {
      setIsApiKeyModalOpen(true);
      setErrorMessage('Please configure your Gemini API Key to enable AI syllabus parsing.');
      return;
    }

    setIsAnalyzing(true);
    setErrorMessage(null);

    try {
      const parsedTopics = await parseSyllabusWithGemini(syllabusText, activeModule.name);
      setParsedSyllabusTopics(parsedTopics);
    } catch (err: any) {
      console.error('Failed to parse syllabus:', err);
      if (err.message === 'MISSING_API_KEY') {
        setIsApiKeyModalOpen(true);
        setErrorMessage('Google Gemini API Key is required for smart parsing.');
      } else {
        setErrorMessage(err.message || 'Failed to parse syllabus with Gemini. Please try again.');
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleOpenExplanation = async (topic: ParsedSyllabusTopic) => {
    setSelectedTopicForExplanation(topic);
    setExplanationContent(null);
    setIsGeneratingExplanation(true);

    if (!hasValidApiKey()) {
      setIsApiKeyModalOpen(true);
      setExplanationContent('Please configure your Google Gemini API key to generate live AI technical breakdowns.');
      setIsGeneratingExplanation(false);
      return;
    }

    try {
      const breakdown = await generateTopicTechnicalBreakdown(topic.topicName, activeModule.name);
      setExplanationContent(breakdown);
    } catch (err: any) {
      setExplanationContent('Error generating explanation: ' + (err.message || 'API request failed.'));
    } finally {
      setIsGeneratingExplanation(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto w-full space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-slate-800/40 backdrop-blur-md border border-slate-700/60 shadow-xl relative overflow-hidden">
        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-medium">
              Curriculum Intelligence
            </span>
            <span className="text-xs text-slate-300 font-medium">Gemini 1.5 Flash Parser</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Smart Syllabus Parser & Roadmap
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl font-sans">
            Upload your university syllabus text to automatically flag high-weightage viva/exam topics, calculate mastery nodes, and generate deep technical explanations.
          </p>
        </div>

        <motion.button
          whileHover={{ y: -1 }}
          whileTap={{ y: 0 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          onClick={() => setSyllabusText(sampleSyllabusText)}
          className="px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 hover:text-white text-xs font-semibold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer relative z-10 shadow-sm"
        >
          <FileText className="w-3.5 h-3.5 text-[#38BDF8]" />
          <span>Load Sample CS Syllabus</span>
        </motion.button>
      </div>

      {/* Error alert */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/25 text-xs text-rose-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button onClick={() => setErrorMessage(null)} className="underline text-slate-400 cursor-pointer">
            Dismiss
          </button>
        </div>
      )}

      {/* Drag & Drop Upload Zone + Text Input Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`relative p-8 rounded-3xl border-2 border-dashed transition-all flex flex-col items-center justify-center text-center group cursor-pointer ${
              isDragging
                ? 'border-indigo-400 bg-indigo-500/10'
                : 'border-slate-700/80 hover:border-slate-600 bg-slate-800/30'
            }`}
          >
            <div className="p-4 rounded-2xl bg-slate-800 text-[#818CF8] border border-slate-700 mb-3 group-hover:scale-105 transition-transform">
              <Upload className="w-7 h-7 text-[#818CF8]" />
            </div>
            <h4 className="text-sm font-bold text-white mb-1">
              Drag & Drop Syllabus Document or Click to Browse
            </h4>
            <p className="text-xs text-slate-400 max-w-sm mb-4">
              Supports <span className="font-mono text-slate-300">.txt</span>, <span className="font-mono text-slate-300">.md</span>, <span className="font-mono text-slate-300">.json</span> files or paste directly below.
            </p>

            <label className="px-5 py-2.5 rounded-full bg-[#818CF8] hover:bg-[#6366F1] active:bg-[#4F46E5] text-white font-semibold text-xs cursor-pointer shadow-md transition-all">
              <span>Select Document</span>
              <input
                type="file"
                accept=".txt,.md,.json,.csv"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs text-slate-400">
              <label className="font-mono uppercase font-semibold text-[#818CF8]">Or Paste Raw Syllabus Content:</label>
              <span className="font-mono">{syllabusText.length} characters</span>
            </div>
            <textarea
              rows={6}
              value={syllabusText}
              onChange={(e) => setSyllabusText(e.target.value)}
              placeholder="Paste course modules, units, chapter objectives, or semester syllabus text..."
              className="w-full p-4 rounded-2xl bg-slate-900/60 border border-slate-700 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-[#818CF8] focus:ring-1 focus:ring-[#818CF8] font-sans leading-relaxed transition-colors"
            />
          </div>

          <motion.button
            whileHover={{ y: -1 }}
            whileTap={{ y: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            onClick={handleAnalyzeSyllabus}
            disabled={isAnalyzing || !syllabusText.trim()}
            className="w-full py-3.5 rounded-2xl bg-[#818CF8] hover:bg-[#6366F1] active:bg-[#4F46E5] text-white font-semibold text-sm transition-all shadow-md hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className={`w-4 h-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
            <span>{isAnalyzing ? 'Gemini Analyzing & Prioritizing Topics...' : 'Analyze & Generate Roadmap'}</span>
          </motion.button>
        </div>

        {/* Info & Extraction Specs */}
        <div className="p-5 rounded-3xl bg-slate-800/40 backdrop-blur-md border border-slate-700/60 space-y-4 shadow-md">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-700/60">
            <Layers className="w-4 h-4 text-[#818CF8]" />
            <h3 className="text-sm font-bold text-white">Parser Intelligence</h3>
          </div>

          <div className="space-y-3 text-xs text-slate-300">
            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-700/50 space-y-1">
              <span className="font-semibold text-[#818CF8] flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-[#818CF8]" /> High-Weightage Flagging
              </span>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Automatically isolates core viva concepts like Deadlock Handling in OS, BCNF in RDBMS, and POSIX Concurrency with clean priority tags.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-700/50 space-y-1">
              <span className="font-semibold text-[#38BDF8] flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-[#38BDF8]" /> 1-Click Deep Explanations
              </span>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Click "Generate Explanation" on any topic to synthesize an academic technical breakdown complete with mathematical proofs and examiner traps.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Structured Parsed Syllabus Roadmap Display */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <span>Parsed Syllabus Roadmap</span>
              <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-medium">
                {parsedSyllabusTopics.length} Core Topics
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Generated from university syllabus specifications for {activeModule.name}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {parsedSyllabusTopics.map((topic, index) => {
            const isHighPriority = topic.priorityLevel === 'High-Priority';
            return (
              <motion.div
                key={topic.id}
                whileHover={{ y: -1 }}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.03, ease: 'easeInOut' }}
                className={`p-4 sm:p-5 rounded-3xl bg-slate-800/40 backdrop-blur-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 border ${
                  isHighPriority
                    ? 'border-indigo-500/40 shadow-sm'
                    : 'border-slate-700/60 hover:border-slate-600'
                }`}
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => toggleParsedTopicCompletion(topic.id)}
                      className={`w-5 h-5 rounded-md flex items-center justify-center text-xs transition-colors cursor-pointer ${
                        topic.isCompleted
                          ? 'bg-[#34D399] text-slate-950 font-bold'
                          : 'border border-slate-700 hover:border-slate-500 text-transparent'
                      }`}
                      title={topic.isCompleted ? 'Mark incomplete' : 'Mark complete'}
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </button>

                    <span className="text-[10px] font-mono text-slate-400 font-semibold">Node #{index + 1}</span>

                    {/* Priority Badge */}
                    {isHighPriority ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 font-semibold">
                        <Flame className="w-3 h-3 text-amber-400" /> High-Priority / High-Weightage
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-medium border border-slate-700">
                        {topic.priorityLevel}
                      </span>
                    )}
                  </div>

                  <h3
                    className={`text-sm sm:text-base font-bold transition-colors ${
                      topic.isCompleted
                        ? 'text-slate-400 line-through'
                        : isHighPriority
                        ? 'text-white'
                        : 'text-slate-100'
                    }`}
                  >
                    {topic.topicName}
                  </h3>

                  {topic.keySubtopics && topic.keySubtopics.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {topic.keySubtopics.map((sub, i) => (
                        <span
                          key={i}
                          className="text-[10px] px-2.5 py-0.5 rounded-lg bg-slate-900/60 border border-slate-700/50 text-slate-300 font-mono"
                        >
                          {sub}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Action Triggers */}
                <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                  <motion.button
                    whileHover={{ y: -1 }}
                    whileTap={{ y: 0 }}
                    transition={{ duration: 0.2, ease: 'easeInOut' }}
                    onClick={() => handleOpenExplanation(topic)}
                    className="px-4 py-2 rounded-2xl bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white border border-slate-700 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#818CF8]" />
                    <span>Generate Explanation</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ y: -1 }}
                    whileTap={{ y: 0 }}
                    transition={{ duration: 0.2, ease: 'easeInOut' }}
                    onClick={() => setCurrentTab('viva')}
                    className="p-2.5 rounded-2xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer shadow-sm"
                    title="Launch Viva for this subject"
                  >
                    <ArrowRight className="w-4 h-4 text-[#818CF8]" />
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* AI Explanation Modal */}
      <AnimatePresence>
        {selectedTopicForExplanation && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              className="relative w-full max-w-3xl max-h-[85vh] bg-[#1E293B] border border-slate-700 rounded-3xl shadow-2xl overflow-hidden flex flex-col p-6"
            >
              <div className="flex items-start justify-between pb-4 border-b border-slate-700">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-[#818CF8]">
                    <Sparkles className="w-5 h-5 text-[#818CF8]" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-[#818CF8] uppercase font-semibold tracking-wider">
                      Academic Technical Breakdown
                    </span>
                    <h3 className="text-lg font-bold text-white">
                      {selectedTopicForExplanation.topicName}
                    </h3>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedTopicForExplanation(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 my-2 rounded-2xl bg-slate-900/80 border border-slate-700/60 text-xs sm:text-sm text-slate-200 leading-relaxed font-sans whitespace-pre-wrap">
                {isGeneratingExplanation ? (
                  <div className="py-16 text-center space-y-3">
                    <Sparkles className="w-8 h-8 text-[#818CF8] animate-spin mx-auto" />
                    <p className="text-xs font-mono text-slate-300">
                      Generating university breakdown for "{selectedTopicForExplanation.topicName}"...
                    </p>
                  </div>
                ) : (
                  explanationContent
                )}
              </div>

              <div className="pt-3 border-t border-slate-700 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-mono">
                  Syllabus Weightage: <strong className="text-slate-200">{selectedTopicForExplanation.priorityLevel}</strong>
                </span>
                <button
                  onClick={() => setSelectedTopicForExplanation(null)}
                  className="px-5 py-2 rounded-full bg-[#818CF8] hover:bg-[#6366F1] active:bg-[#4F46E5] text-white font-semibold transition-colors cursor-pointer"
                >
                  Close Breakdown
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
