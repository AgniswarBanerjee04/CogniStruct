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
        context: `MCA Semester 2 student at Meghnad Saha Institute of Technology preparing for the practical viva on process synchronization and concurrency bugs.`,
        task: "Deconstruct Peterson's algorithm step-by-step, mathematically prove mutual exclusion in sequential consistency, then explain why modern speculative out-of-order processors break it without hardware memory fences.",
        format: '1. Formal State Transition Matrix\n2. C pseudo-code with atomic fences\n3. High-probability viva defense questions with exact model answers.',
      },
    },
    {
      name: '3NF vs BCNF Relational Decomposition Proof',
      subject: 'Database Management Systems (RDBMS)',
      blocks: {
        role: 'Database Engine Architect & Academic Database Theorist.',
        context: `MCA graduate student at Meghnad Saha Institute of Technology mastering functional dependency theory for database design.`,
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
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
              RCTF Architecture
            </span>
            <span className="text-xs text-slate-400">Precision Prompt Engineering</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            RCTF Prompt Sandbox
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Synthesize high-order university prompts using the four-pillar framework:
            <strong className="text-indigo-400 font-semibold"> Role</strong>,
            <strong className="text-cyan-400 font-semibold"> Context</strong>,
            <strong className="text-emerald-400 font-semibold"> Task</strong>, and
            <strong className="text-purple-400 font-semibold"> Format</strong>.
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
                className="px-2.5 py-1.5 rounded-lg bg-[#18181c] hover:bg-white/10 text-[11px] font-medium text-slate-300 border border-white/10 transition-colors truncate max-w-[140px]"
                title={preset.name}
              >
                {preset.name.split('&')[0].trim()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Title Input */}
      <div className="p-4 rounded-2xl bg-[#141417] border border-white/10 flex flex-col sm:flex-row items-center gap-3">
        <label className="text-xs font-mono text-slate-400 uppercase tracking-wider shrink-0">
          Prompt Title:
        </label>
        <input
          type="text"
          value={promptTitle}
          onChange={(e) => setPromptTitle(e.target.value)}
          placeholder="e.g. Concurrency Deadlock Detection Proof..."
          className="w-full px-3 py-1.5 bg-black/40 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-500/50"
        />
      </div>

      {/* The 4 RCTF Blocks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* R - ROLE */}
        <div className="relative rounded-2xl bg-[#141417] border border-indigo-500/30 p-5 shadow-lg shadow-indigo-500/5 flex flex-col justify-between group">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-mono font-bold text-xs border border-indigo-500/30">
                  R
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Role</h3>
                  <p className="text-[11px] text-slate-400">Embodied academic persona & authority</p>
                </div>
              </div>
              <span className="text-[10px] font-mono text-indigo-400 px-2 py-0.5 rounded bg-indigo-500/10">
                Pillar 1
              </span>
            </div>

            <textarea
              rows={4}
              value={blocks.role}
              onChange={(e) => setBlocks({ ...blocks, role: e.target.value })}
              className="w-full p-3 rounded-xl bg-black/40 border border-white/10 text-xs sm:text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/60 font-sans leading-relaxed"
              placeholder="e.g. Principal Systems Architect & Senior University Professor specializing in operating systems..."
            />
          </div>

          {/* Quick Token Injections */}
          <div className="pt-3 border-t border-white/5 flex flex-wrap items-center gap-1.5 text-[10px]">
            <span className="text-slate-500 font-mono">Quick Tokens:</span>
            <button
              onClick={() => injectToken('role', 'Senior University External Examiner')}
              className="px-2 py-0.5 rounded bg-white/5 hover:bg-indigo-500/20 text-slate-400 hover:text-indigo-300 transition-colors"
            >
              + External Examiner
            </button>
            <button
              onClick={() => injectToken('role', 'Kernel Systems Engineer')}
              className="px-2 py-0.5 rounded bg-white/5 hover:bg-indigo-500/20 text-slate-400 hover:text-indigo-300 transition-colors"
            >
              + Kernel Engineer
            </button>
          </div>
        </div>

        {/* C - CONTEXT */}
        <div className="relative rounded-2xl bg-[#141417] border border-cyan-500/30 p-5 shadow-lg shadow-cyan-500/5 flex flex-col justify-between group">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-mono font-bold text-xs border border-cyan-500/30">
                  C
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Context</h3>
                  <p className="text-[11px] text-slate-400">Student background, institution, & constraints</p>
                </div>
              </div>
              <span className="text-[10px] font-mono text-cyan-400 px-2 py-0.5 rounded bg-cyan-500/10">
                Pillar 2
              </span>
            </div>

            <textarea
              rows={4}
              value={blocks.context}
              onChange={(e) => setBlocks({ ...blocks, context: e.target.value })}
              className="w-full p-3 rounded-xl bg-black/40 border border-white/10 text-xs sm:text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/60 font-sans leading-relaxed"
              placeholder="e.g. MCA Semester 2 candidate at Meghnad Saha Institute of Technology preparing for practical viva..."
            />
          </div>

          {/* Quick Token Injections */}
          <div className="pt-3 border-t border-white/5 flex flex-wrap items-center gap-1.5 text-[10px]">
            <span className="text-slate-500 font-mono">Quick Tokens:</span>
            <button
              onClick={() => injectToken('context', `Candidate: ${user.name} (${user.program})`)}
              className="px-2 py-0.5 rounded bg-white/5 hover:bg-cyan-500/20 text-slate-400 hover:text-cyan-300 transition-colors"
            >
              + Student Credentials
            </button>
            <button
              onClick={() => injectToken('context', `Institution: ${user.institution}`)}
              className="px-2 py-0.5 rounded bg-white/5 hover:bg-cyan-500/20 text-slate-400 hover:text-cyan-300 transition-colors"
            >
              + MSIT Institution
            </button>
          </div>
        </div>

        {/* T - TASK */}
        <div className="relative rounded-2xl bg-[#141417] border border-emerald-500/30 p-5 shadow-lg shadow-emerald-500/5 flex flex-col justify-between group">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-mono font-bold text-xs border border-emerald-500/30">
                  T
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Task</h3>
                  <p className="text-[11px] text-slate-400">Core problem, algorithm, or theorem to resolve</p>
                </div>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10">
                Pillar 3
              </span>
            </div>

            <textarea
              rows={4}
              value={blocks.task}
              onChange={(e) => setBlocks({ ...blocks, task: e.target.value })}
              className="w-full p-3 rounded-xl bg-black/40 border border-white/10 text-xs sm:text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/60 font-sans leading-relaxed"
              placeholder="e.g. Derive Peterson's algorithm concurrency guarantee and explain why CPU out-of-order execution breaks it..."
            />
          </div>

          {/* Quick Token Injections */}
          <div className="pt-3 border-t border-white/5 flex flex-wrap items-center gap-1.5 text-[10px]">
            <span className="text-slate-500 font-mono">Quick Tokens:</span>
            <button
              onClick={() => injectToken('task', 'Prove time and space asymptotic bounds.')}
              className="px-2 py-0.5 rounded bg-white/5 hover:bg-emerald-500/20 text-slate-400 hover:text-emerald-300 transition-colors"
            >
              + Asymptotic Proof
            </button>
            <button
              onClick={() => injectToken('task', 'Highlight critical edge cases and failure modes.')}
              className="px-2 py-0.5 rounded bg-white/5 hover:bg-emerald-500/20 text-slate-400 hover:text-emerald-300 transition-colors"
            >
              + Edge Cases
            </button>
          </div>
        </div>

        {/* F - FORMAT */}
        <div className="relative rounded-2xl bg-[#141417] border border-purple-500/30 p-5 shadow-lg shadow-purple-500/5 flex flex-col justify-between group">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center font-mono font-bold text-xs border border-purple-500/30">
                  F
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Format</h3>
                  <p className="text-[11px] text-slate-400">Output structure, code snippets, & viva checklist</p>
                </div>
              </div>
              <span className="text-[10px] font-mono text-purple-400 px-2 py-0.5 rounded bg-purple-500/10">
                Pillar 4
              </span>
            </div>

            <textarea
              rows={4}
              value={blocks.format}
              onChange={(e) => setBlocks({ ...blocks, format: e.target.value })}
              className="w-full p-3 rounded-xl bg-black/40 border border-white/10 text-xs sm:text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-purple-500/60 font-sans leading-relaxed"
              placeholder="e.g. 1. Mathematical derivation, 2. Annotated C code, 3. Top 3 viva trap questions..."
            />
          </div>

          {/* Quick Token Injections */}
          <div className="pt-3 border-t border-white/5 flex flex-wrap items-center gap-1.5 text-[10px]">
            <span className="text-slate-500 font-mono">Quick Tokens:</span>
            <button
              onClick={() => injectToken('format', 'Include Markdown tables and ASCII state diagrams.')}
              className="px-2 py-0.5 rounded bg-white/5 hover:bg-purple-500/20 text-slate-400 hover:text-purple-300 transition-colors"
            >
              + ASCII Diagrams
            </button>
            <button
              onClick={() => injectToken('format', 'Provide 3 high-probability oral viva questions with model answers.')}
              className="px-2 py-0.5 rounded bg-white/5 hover:bg-purple-500/20 text-slate-400 hover:text-purple-300 transition-colors"
            >
              + Viva Questions
            </button>
          </div>
        </div>
      </div>

      {/* Action Toolbar: Compile, Copy, Run */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[#141417] border border-white/10">
        <div className="flex items-center gap-2">
          <button
            onClick={handleCompile}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-black font-bold text-xs sm:text-sm shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate Master Prompt</span>
          </button>

          <button
            onClick={handleRunGemini}
            disabled={isRunningGemini}
            className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs sm:text-sm font-medium text-slate-200 hover:text-white transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <Play className={`w-3.5 h-3.5 text-cyan-400 ${isRunningGemini ? 'animate-spin' : ''}`} />
            <span>{isRunningGemini ? 'Synthesizing...' : 'Execute with Gemini'}</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            onClick={handleSaveToPrompts}
            className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
          >
            <BookmarkPlus className="w-3.5 h-3.5 text-indigo-400" />
            <span>{savedSuccess ? 'Saved to Library!' : 'Save to Library'}</span>
          </button>
        </div>
      </div>

      {/* Compiled Master Prompt Preview Box */}
      <AnimatePresence>
        {(isCompiled || compiledPrompt) && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl bg-[#0f0f12] border border-white/15 p-5 shadow-2xl space-y-3"
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                  Compiled Master Prompt Specification
                </span>
              </div>
              <span className="text-[11px] font-mono text-slate-500">Ready for LLM Ingestion</span>
            </div>

            <pre className="p-4 rounded-xl bg-black/60 border border-white/5 text-xs text-slate-300 font-mono whitespace-pre-wrap leading-relaxed overflow-x-auto max-h-72">
              {compiledPrompt || generatePromptString()}
            </pre>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gemini Live Execution Output */}
      <AnimatePresence>
        {geminiResult && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl bg-[#141417] border border-cyan-500/30 p-6 shadow-2xl space-y-4 neural-glow"
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
                <h3 className="text-sm font-bold text-white">
                  Gemini Academic Synthesis Output
                </h3>
              </div>
              <span className="text-[10px] font-mono text-cyan-400 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
                CogniStruct Verified
              </span>
            </div>

            <div className="p-4 rounded-xl bg-black/50 border border-white/5 text-xs sm:text-sm text-slate-200 font-sans leading-relaxed whitespace-pre-wrap">
              {geminiResult}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
