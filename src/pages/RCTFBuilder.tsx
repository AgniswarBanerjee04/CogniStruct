import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Copy,
  Check,
  Play,
  BookmarkPlus,
  Terminal,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { RCTFBlocks, MasterPrompt } from '../types';
import { executePromptWithGemini } from '../services/geminiService';

export const RCTFBuilder: React.FC = () => {
  const { user, activeModule, addMasterPrompt } = useApp();

  const presets: { name: string; subject: string; blocks: RCTFBlocks }[] = [
    {
      name: "Peterson's Algorithm & Memory Barrier Breakdown",
      subject: 'Operating Systems',
      blocks: {
        role: 'Distinguished Systems Architect & University OS Professor specializing in Linux kernel concurrency.',
        context: `Computer Science student at Apex Institute of Technology preparing for the practical viva on process synchronization and concurrency bugs.`,
        task: "Deconstruct Peterson's algorithm step-by-step, mathematically prove mutual exclusion in sequential consistency, then explain why modern speculative out-of-order processors break it without hardware memory fences.",
        format: '1. Formal State Transition Matrix\n2. C pseudo-code with atomic fences\n3. High-probability viva defense questions with exact model answers.',
      },
    },
    {
      name: '3NF vs BCNF Relational Decomposition Proof',
      subject: 'Database Management Systems (RDBMS)',
      blocks: {
        role: 'Database Engine Architect & Academic Database Theorist.',
        context: `Graduate computer science student at Apex Institute of Technology mastering functional dependency theory for database design.`,
        task: 'Provide a concrete relational schema R(A, B, C) with functional dependencies that satisfies Third Normal Form (3NF) but strictly violates Boyce-Codd Normal Form (BCNF). Prove why lossless-join and dependency preservation properties conflict.',
        format: 'Mathematical dependency analysis table followed by minimal cover algorithm and step-by-step decomposition proof.',
      },
    },
    {
      name: 'B+ Tree Page Splitting & Disk I/O Asymptotics',
      subject: 'Python & Data Structures',
      blocks: {
        role: 'Principal Algorithms Researcher and Systems Programmer.',
        context: `Computer science student analyzing indexing architectures in relational and distributed database storage engines.`,
        task: 'Illustrate how a B+ Tree of order m splits internal vs leaf nodes during sequential insertion. Calculate the exact worst-case block I/O reads for a range query spanning 100,000 keys.',
        format: '1. Step-by-step ASCII memory representation\n2. Big-O mathematical derivation\n3. Top 3 viva trap questions examiners use during oral exams.',
      },
    },
  ];

  const [blocks, setBlocks] = useState<RCTFBlocks>(presets[0].blocks);
  const [promptTitle, setPromptTitle] = useState(presets[0].name);
  const [compiledPrompt, setCompiledPrompt] = useState<string>('');
  const [isCompiled, setIsCompiled] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [isRunningGemini, setIsRunningGemini] = useState<boolean>(false);
  const [geminiResult, setGeminiResult] = useState<string | null>(null);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  if (!user) return null;

  const handleCompile = () => {
    const compiled = `### [ROLE]\n${blocks.role.trim()}\n\n### [CONTEXT]\n${blocks.context.trim()}\n\n### [TASK]\n${blocks.task.trim()}\n\n### [FORMAT]\n${blocks.format.trim()}`;
    setCompiledPrompt(compiled);
    setIsCompiled(true);
  };

  const handleCopy = () => {
    if (!compiledPrompt) handleCompile();
    navigator.clipboard.writeText(compiledPrompt || generatePromptString());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const generatePromptString = () => {
    return `### [ROLE]\n${blocks.role.trim()}\n\n### [CONTEXT]\n${blocks.context.trim()}\n\n### [TASK]\n${blocks.task.trim()}\n\n### [FORMAT]\n${blocks.format.trim()}`;
  };

  const handleRunGemini = async () => {
    const textToRun = compiledPrompt || generatePromptString();
    if (!compiledPrompt) {
      setCompiledPrompt(textToRun);
      setIsCompiled(true);
    }
    setIsRunningGemini(true);
    setGeminiResult(null);

    try {
      const output = await executePromptWithGemini(textToRun);
      setGeminiResult(output);
    } catch {
      setGeminiResult('Error executing prompt. Please check your Gemini API key or network connection.');
    } finally {
      setIsRunningGemini(false);
    }
  };

  const handleSaveToPrompts = () => {
    const promptStr = compiledPrompt || generatePromptString();
    const newMasterPrompt: MasterPrompt = {
      id: `prompt-${Date.now()}`,
      title: promptTitle || 'Structured Academic Framework',
      subject: activeModule.name,
      blocks,
      compiledPrompt: promptStr,
      createdAt: 'Just now',
      tags: ['RCTF', activeModule.name, 'MasterPrompt'],
    };

    addMasterPrompt(newMasterPrompt);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const applyPreset = (preset: (typeof presets)[0]) => {
    setBlocks(preset.blocks);
    setPromptTitle(preset.name);
    setIsCompiled(false);
    setGeminiResult(null);
  };

  const injectToken = (blockKey: keyof RCTFBlocks, tokenText: string) => {
    setBlocks((prev) => ({
      ...prev,
      [blockKey]: prev[blockKey] ? `${prev[blockKey]} ${tokenText}` : tokenText,
    }));
  };

  return (
    <div className="max-w-7xl mx-auto w-full space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-medium">
              RCTF Architecture
            </span>
            <span className="text-xs text-slate-400">Structured Academic Engineering</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            RCTF Prompt Sandbox
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Synthesize high-order university prompts using the four-pillar framework:
            <strong className="text-[#818CF8] font-semibold"> Role</strong>,
            <strong className="text-[#38BDF8] font-semibold"> Context</strong>,
            <strong className="text-[#34D399] font-semibold"> Task</strong>, and
            <strong className="text-purple-300 font-semibold"> Format</strong>.
          </p>
        </div>

        {/* Preset Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium hidden sm:inline">Presets:</span>
          <div className="flex flex-wrap gap-1.5">
            {presets.map((preset, index) => (
              <button
                key={index}
                onClick={() => applyPreset(preset)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-[11px] font-medium text-slate-300 hover:text-white border border-slate-700 transition-colors truncate max-w-[150px] cursor-pointer"
                title={preset.name}
              >
                {preset.name.split('&')[0].trim()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Title Input */}
      <div className="p-4 rounded-2xl bg-slate-800/40 backdrop-blur-md border border-slate-700/60 flex flex-col sm:flex-row items-center gap-3">
        <label className="text-xs font-mono text-slate-400 uppercase tracking-wider shrink-0 font-medium">
          Prompt Title:
        </label>
        <input
          type="text"
          value={promptTitle}
          onChange={(e) => setPromptTitle(e.target.value)}
          placeholder="e.g. Concurrency Deadlock Detection Proof..."
          className="w-full px-3.5 py-2 bg-slate-900/70 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-[#818CF8] transition-colors"
        />
      </div>

      {/* The 4 RCTF Blocks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* R - ROLE */}
        <div className="rounded-2xl bg-slate-800/40 backdrop-blur-md border border-indigo-500/25 p-5 shadow-sm flex flex-col justify-between group">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-indigo-500/15 text-[#818CF8] flex items-center justify-center font-mono font-bold text-xs border border-indigo-500/30">
                  R
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Role</h3>
                  <p className="text-[11px] text-slate-400">Embodied academic persona & authority</p>
                </div>
              </div>
              <span className="text-[10px] font-mono text-[#818CF8] px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 font-medium">
                Pillar 1
              </span>
            </div>

            <textarea
              rows={4}
              value={blocks.role}
              onChange={(e) => setBlocks({ ...blocks, role: e.target.value })}
              className="w-full p-3 rounded-xl bg-slate-900/70 border border-slate-700/70 text-xs sm:text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-[#818CF8] font-sans leading-relaxed transition-colors"
              placeholder="e.g. Principal Systems Architect & Senior University Professor specializing in operating systems..."
            />
          </div>

          {/* Quick Token Injections */}
          <div className="pt-3 border-t border-slate-700/50 flex flex-wrap items-center gap-1.5 text-[10px]">
            <span className="text-slate-400 font-mono">Quick Tokens:</span>
            <button
              onClick={() => injectToken('role', 'Senior University External Examiner')}
              className="px-2 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700 cursor-pointer"
            >
              + External Examiner
            </button>
            <button
              onClick={() => injectToken('role', 'Kernel Systems Engineer')}
              className="px-2 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700 cursor-pointer"
            >
              + Kernel Engineer
            </button>
          </div>
        </div>

        {/* C - CONTEXT */}
        <div className="rounded-2xl bg-slate-800/40 backdrop-blur-md border border-sky-500/25 p-5 shadow-sm flex flex-col justify-between group">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-sky-500/15 text-[#38BDF8] flex items-center justify-center font-mono font-bold text-xs border border-sky-500/30">
                  C
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Context</h3>
                  <p className="text-[11px] text-slate-400">Student background, institution, & constraints</p>
                </div>
              </div>
              <span className="text-[10px] font-mono text-[#38BDF8] px-2 py-0.5 rounded-full bg-sky-500/10 border border-sky-500/20 font-medium">
                Pillar 2
              </span>
            </div>

            <textarea
              rows={4}
              value={blocks.context}
              onChange={(e) => setBlocks({ ...blocks, context: e.target.value })}
              className="w-full p-3 rounded-xl bg-slate-900/70 border border-slate-700/70 text-xs sm:text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-[#38BDF8] font-sans leading-relaxed transition-colors"
              placeholder="e.g. Computer Science student at Apex Institute of Technology preparing for practical viva..."
            />
          </div>

          {/* Quick Token Injections */}
          <div className="pt-3 border-t border-slate-700/50 flex flex-wrap items-center gap-1.5 text-[10px]">
            <span className="text-slate-400 font-mono">Quick Tokens:</span>
            <button
              onClick={() => injectToken('context', `Candidate: ${user.name} (${user.program})`)}
              className="px-2 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700 cursor-pointer"
            >
              + Student Credentials
            </button>
            <button
              onClick={() => injectToken('context', `Institution: ${user.institution}`)}
              className="px-2 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700 cursor-pointer"
            >
              + University Tag
            </button>
          </div>
        </div>

        {/* T - TASK */}
        <div className="rounded-2xl bg-slate-800/40 backdrop-blur-md border border-emerald-500/25 p-5 shadow-sm flex flex-col justify-between group">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/15 text-[#34D399] flex items-center justify-center font-mono font-bold text-xs border border-emerald-500/30">
                  T
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Task</h3>
                  <p className="text-[11px] text-slate-400">Core problem, algorithm, or theorem to resolve</p>
                </div>
              </div>
              <span className="text-[10px] font-mono text-[#34D399] px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 font-medium">
                Pillar 3
              </span>
            </div>

            <textarea
              rows={4}
              value={blocks.task}
              onChange={(e) => setBlocks({ ...blocks, task: e.target.value })}
              className="w-full p-3 rounded-xl bg-slate-900/70 border border-slate-700/70 text-xs sm:text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-[#34D399] font-sans leading-relaxed transition-colors"
              placeholder="e.g. Derive Peterson's algorithm concurrency guarantee and explain why CPU out-of-order execution breaks it..."
            />
          </div>

          {/* Quick Token Injections */}
          <div className="pt-3 border-t border-slate-700/50 flex flex-wrap items-center gap-1.5 text-[10px]">
            <span className="text-slate-400 font-mono">Quick Tokens:</span>
            <button
              onClick={() => injectToken('task', 'Prove time and space asymptotic bounds.')}
              className="px-2 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700 cursor-pointer"
            >
              + Asymptotic Proof
            </button>
            <button
              onClick={() => injectToken('task', 'Highlight critical edge cases and failure modes.')}
              className="px-2 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700 cursor-pointer"
            >
              + Edge Cases
            </button>
          </div>
        </div>

        {/* F - FORMAT */}
        <div className="rounded-2xl bg-slate-800/40 backdrop-blur-md border border-purple-500/25 p-5 shadow-sm flex flex-col justify-between group">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-purple-500/15 text-purple-300 flex items-center justify-center font-mono font-bold text-xs border border-purple-500/30">
                  F
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Format</h3>
                  <p className="text-[11px] text-slate-400">Output structure, code snippets, & viva checklist</p>
                </div>
              </div>
              <span className="text-[10px] font-mono text-purple-300 px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 font-medium">
                Pillar 4
              </span>
            </div>

            <textarea
              rows={4}
              value={blocks.format}
              onChange={(e) => setBlocks({ ...blocks, format: e.target.value })}
              className="w-full p-3 rounded-xl bg-slate-900/70 border border-slate-700/70 text-xs sm:text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-purple-400 font-sans leading-relaxed transition-colors"
              placeholder="e.g. 1. Mathematical derivation, 2. Annotated C code, 3. Top 3 viva trap questions..."
            />
          </div>

          {/* Quick Token Injections */}
          <div className="pt-3 border-t border-slate-700/50 flex flex-wrap items-center gap-1.5 text-[10px]">
            <span className="text-slate-400 font-mono">Quick Tokens:</span>
            <button
              onClick={() => injectToken('format', 'Include Markdown tables and ASCII state diagrams.')}
              className="px-2 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700 cursor-pointer"
            >
              + ASCII Diagrams
            </button>
            <button
              onClick={() => injectToken('format', 'Provide 3 high-probability oral viva questions with model answers.')}
              className="px-2 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700 cursor-pointer"
            >
              + Viva Questions
            </button>
          </div>
        </div>
      </div>

      {/* Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-800/40 backdrop-blur-md border border-slate-700/60 shadow-md">
        <div className="flex items-center gap-2">
          <button
            onClick={handleCompile}
            className="px-5 py-2.5 rounded-xl bg-[#818CF8] hover:bg-[#6366F1] active:bg-[#4F46E5] text-white font-semibold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate Master Prompt</span>
          </button>

          <button
            onClick={handleRunGemini}
            disabled={isRunningGemini}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs sm:text-sm font-semibold text-slate-200 hover:text-white transition-colors flex items-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            <Play className={`w-3.5 h-3.5 text-[#38BDF8] ${isRunningGemini ? 'animate-spin' : ''}`} />
            <span>{isRunningGemini ? 'Synthesizing...' : 'Execute with Gemini'}</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-[#34D399]" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            onClick={handleSaveToPrompts}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <BookmarkPlus className="w-3.5 h-3.5 text-[#818CF8]" />
            <span>{savedSuccess ? 'Saved to Library!' : 'Save to Library'}</span>
          </button>
        </div>
      </div>

      {/* Compiled Master Prompt Preview Box */}
      <AnimatePresence>
        {(isCompiled || compiledPrompt) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="rounded-2xl bg-slate-800/40 backdrop-blur-md border border-slate-700/60 p-5 shadow-xl space-y-3"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-700/60">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-[#818CF8]" />
                <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                  Compiled Master Prompt Specification
                </span>
              </div>
              <span className="text-[11px] font-mono text-slate-400">Ready for LLM Ingestion</span>
            </div>

            <pre className="p-4 rounded-xl bg-slate-900/80 border border-slate-700/50 text-xs text-slate-300 font-mono whitespace-pre-wrap leading-relaxed overflow-x-auto max-h-72">
              {compiledPrompt || generatePromptString()}
            </pre>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gemini Live Execution Output */}
      <AnimatePresence>
        {geminiResult && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="rounded-2xl bg-slate-800/40 backdrop-blur-md border border-slate-700/60 p-6 shadow-xl space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-700/60">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#818CF8]" />
                <h3 className="text-sm font-bold text-white">
                  Gemini Academic Synthesis Output
                </h3>
              </div>
              <span className="text-[10px] font-mono text-slate-300 px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700">
                CogniStruct Verified
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-700/50 text-xs sm:text-sm text-slate-200 font-sans leading-relaxed whitespace-pre-wrap">
              {geminiResult}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
