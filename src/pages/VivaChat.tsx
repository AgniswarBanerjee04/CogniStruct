import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  Volume2,
  VolumeX,
  RotateCcw,
  Award,
  AlertCircle,
  CheckCircle2,
  GraduationCap,
  Key,
  Flame,
  FileCheck,
  Zap,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { VivaMessage, VivaEvaluation } from '../types';
import {
  evaluateStudentVivaAnswer,
  generateInitialVivaQuestion,
  hasValidApiKey,
} from '../services/geminiService';

// Celebratory particle burst component for score >= 8.0
const ScoreConfettiBurst: React.FC = React.memo(() => {
  const particles = Array.from({ length: 24 }, (_, i) => {
    const angle = (i / 24) * 360 * (Math.PI / 180);
    const distance = 40 + Math.random() * 65;
    const colors = ['#00E5FF', '#FF007F', '#39FF14', '#FFE600', '#A855F7', '#FFFFFF'];
    const color = colors[i % colors.length];
    return {
      id: i,
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
      color,
      size: 4 + Math.random() * 4,
      rotation: Math.random() * 360,
    };
  });

  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-20 overflow-visible">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 1, scale: 0, x: 0, y: 0, rotate: 0 }}
          animate={{
            opacity: [1, 1, 0],
            scale: [0, 1.4, 0.4],
            x: p.x,
            y: p.y,
            rotate: p.rotation,
          }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="absolute rounded-full shadow-md"
          style={{
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            boxShadow: `0 0 10px ${p.color}`,
          }}
        />
      ))}
    </div>
  );
});

// Memoized Assessment Rubric to prevent re-rendering when typing
interface AssessmentRubricProps {
  selectedEvaluation: VivaEvaluation | null;
  showConfetti: boolean;
}

const AssessmentRubric: React.FC<AssessmentRubricProps> = React.memo(
  ({ selectedEvaluation, showConfetti }) => {
    return (
      <div className="p-5 rounded-3xl glass-panel relative overflow-hidden space-y-5 border border-white/10 cyber-glow-cyan">
        {/* Top ambient highlight */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#00E5FF] via-[#FF007F] to-[#39FF14]" />

        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-[#00E5FF]" />
            <h3 className="text-sm font-bold text-white tracking-tight">Examiner Assessment Rubric</h3>
          </div>
          <span className="text-[10px] font-mono text-[#00E5FF] px-2 py-0.5 rounded-full bg-[#00E5FF]/10 font-bold border border-[#00E5FF]/20">
            Live MCA Rubric
          </span>
        </div>

        {selectedEvaluation ? (
          <div className="space-y-4 relative">
            {/* Celebratory Particle Confetti Burst on high score */}
            {showConfetti && <ScoreConfettiBurst />}

            {/* Overall Score Badge */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-white/[0.06] to-black/60 border border-[#00E5FF]/30 flex items-center justify-between relative overflow-hidden">
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">
                  Oral Viva Score
                </span>
                <h4 className="text-3xl font-extrabold font-mono text-white flex items-baseline gap-1 mt-0.5">
                  {selectedEvaluation.overallScore}
                  <span className="text-xs text-slate-400 font-sans font-normal">/ 10.0</span>
                </h4>
              </div>
              <div
                className={`px-3 py-1.5 rounded-full text-xs font-mono font-extrabold ${
                  selectedEvaluation.overallScore >= 8.0
                    ? 'bg-[#39FF14]/20 text-[#39FF14] border border-[#39FF14]/50 shadow-[0_0_15px_rgba(57,255,20,0.4)]'
                    : selectedEvaluation.overallScore >= 6.0
                    ? 'bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/50 shadow-[0_0_15px_rgba(0,229,255,0.4)]'
                    : 'bg-[#FF007F]/20 text-[#FF007F] border border-[#FF007F]/50 shadow-[0_0_15px_rgba(255,0,127,0.4)]'
                }`}
              >
                {selectedEvaluation.overallScore >= 8.0
                  ? '⭐ Distinction'
                  : selectedEvaluation.overallScore >= 6.0
                  ? 'Passing Grade'
                  : 'Needs Revision'}
              </div>
            </div>

            {/* Hardware-accelerated Progress Bars using scaleX */}
            <div className="space-y-3.5">
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-300">Technical Accuracy</span>
                  <span className="font-mono text-[#00E5FF] font-bold">
                    {selectedEvaluation.accuracyScore} / 10
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-black/70 overflow-hidden">
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: Math.min(1, selectedEvaluation.accuracyScore / 10) }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    style={{ transformOrigin: 'left' }}
                    className="h-full w-full rounded-full bg-[#00E5FF] shadow-[0_0_10px_rgba(0,229,255,0.6)]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-300">Depth of Explanation</span>
                  <span className="font-mono text-[#FF007F] font-bold">
                    {selectedEvaluation.depthScore} / 10
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-black/70 overflow-hidden">
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: Math.min(1, selectedEvaluation.depthScore / 10) }}
                    transition={{ duration: 0.6, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
                    style={{ transformOrigin: 'left' }}
                    className="h-full w-full rounded-full bg-[#FF007F] shadow-[0_0_10px_rgba(255,0,127,0.6)]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-300">Academic Vocabulary</span>
                  <span className="font-mono text-[#39FF14] font-bold">
                    {selectedEvaluation.confidenceScore} / 10
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-black/70 overflow-hidden">
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: Math.min(1, selectedEvaluation.confidenceScore / 10) }}
                    transition={{ duration: 0.6, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
                    style={{ transformOrigin: 'left' }}
                    className="h-full w-full rounded-full bg-[#39FF14] shadow-[0_0_10px_rgba(57,255,20,0.6)]"
                  />
                </div>
              </div>
            </div>

            {/* Examiner Critique Note */}
            <div className="p-3.5 rounded-2xl bg-black/50 border border-white/10 space-y-1.5">
              <span className="text-[10px] font-mono text-[#00E5FF] uppercase font-bold flex items-center gap-1">
                <Zap className="w-3 h-3 text-[#00E5FF]" /> Examiner Critique:
              </span>
              <p className="text-xs text-slate-200 leading-relaxed italic">
                "{selectedEvaluation.examinerCritique}"
              </p>
            </div>

            {/* Strengths & Weaknesses */}
            <div className="space-y-2 text-xs">
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-[#39FF14] font-bold uppercase flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-[#39FF14]" /> Confirmed Strengths:
                </span>
                <ul className="list-disc list-inside text-slate-300 text-[11px] space-y-0.5">
                  {selectedEvaluation.strengths.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>

              {selectedEvaluation.weaknesses.length > 0 && (
                <div className="space-y-1 pt-1">
                  <span className="text-[10px] font-mono text-[#FF007F] font-bold uppercase flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 text-[#FF007F]" /> Gaps & Weaknesses:
                  </span>
                  <ul className="list-disc list-inside text-slate-300 text-[11px] space-y-0.5">
                    {selectedEvaluation.weaknesses.map((w, i) => (
                      <li key={i}>{w}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="space-y-1 pt-1">
                <span className="text-[10px] font-mono text-[#FFE600] font-bold uppercase flex items-center gap-1">
                  <Flame className="w-3 h-3 text-[#FFE600]" /> Suggested Revision:
                </span>
                <p className="text-[11px] text-slate-300 leading-normal">
                  {selectedEvaluation.suggestedRevision}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 mx-auto flex items-center justify-center text-slate-400">
              <FileCheck className="w-6 h-6 text-[#00E5FF]" />
            </div>
            <h4 className="text-xs font-bold text-white">Dynamic Examiner Rubric Ready</h4>
            <p className="text-xs text-slate-400 max-w-[220px] mx-auto">
              Submit your oral response to live Gemini. The examiner will evaluate accuracy, depth, and vocabulary in real time.
            </p>
          </div>
        )}
      </div>
    );
  }
);

// Memoized Chat Input Form with localized state to eliminate typing lag
interface ChatInputFormProps {
  onSubmitAnswer: (text: string) => void;
  isEvaluating: boolean;
  activeSubject: string;
}

const ChatInputForm: React.FC<ChatInputFormProps> = React.memo(
  ({ onSubmitAnswer, isEvaluating, activeSubject }) => {
    const [inputAnswer, setInputAnswer] = useState('');

    const handleSubmit = (e?: React.FormEvent) => {
      if (e) e.preventDefault();
      if (!inputAnswer.trim() || isEvaluating) return;
      onSubmitAnswer(inputAnswer.trim());
      setInputAnswer('');
    };

    return (
      <div className="p-3 sm:p-4 bg-[#0E0B1A]/95 border-t border-white/10 space-y-3">
        {/* Quick Answer Prompt Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-[11px] text-slate-400 scrollbar-none">
          <span className="shrink-0 text-slate-400 font-mono font-bold">Quick Inputs:</span>
          <button
            type="button"
            onClick={() =>
              setInputAnswer(
                `Can you provide the complete technical answer for this ${activeSubject} concept?`
              )
            }
            className="px-3 py-1 rounded-xl bg-white/5 hover:bg-[#00E5FF]/15 hover:text-[#00E5FF] border border-white/10 hover:border-[#00E5FF]/40 shrink-0 transition-all font-sans cursor-pointer text-slate-300"
          >
            "Give me the complete technical answer"
          </button>
          <button
            type="button"
            onClick={() => setInputAnswer("I don't know the exact mechanism, Professor.")}
            className="px-3 py-1 rounded-xl bg-white/5 hover:bg-[#FF007F]/15 hover:text-[#FF007F] border border-white/10 hover:border-[#FF007F]/40 shrink-0 transition-all font-sans cursor-pointer text-slate-300"
          >
            "I don't know..." (Test strict fallback explanation)
          </button>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={inputAnswer}
            onChange={(e) => setInputAnswer(e.target.value)}
            placeholder={`State your technical answer directly to the ${activeSubject} examiner...`}
            disabled={isEvaluating}
            className="flex-1 px-4 py-3 rounded-2xl bg-black/60 border border-white/10 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#00E5FF] focus:ring-1 focus:ring-[#00E5FF] transition-all"
          />
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            type="submit"
            disabled={isEvaluating || !inputAnswer.trim()}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#00E5FF] to-[#6366F1] hover:from-[#00E5FF] hover:to-[#FF007F] text-black font-extrabold text-xs sm:text-sm transition-all shadow-[0_0_20px_rgba(0,229,255,0.4)] disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
          >
            <span>Submit</span>
            <Send className="w-3.5 h-3.5 stroke-[2.5]" />
          </motion.button>
        </form>
      </div>
    );
  }
);

export const VivaChat: React.FC = () => {
  const {
    user,
    activeModule,
    activeSubject,
    vivaMessages,
    setVivaMessages,
    addVivaMessage,
    resetVivaChat,
    setIsApiKeyModalOpen,
    hasCustomKey,
  } = useApp();

  const [isEvaluating, setIsEvaluating] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const [selectedEvaluation, setSelectedEvaluation] = useState<VivaEvaluation | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [vivaMessages, isEvaluating]);

  // Dynamic Subject Routing & Reset on Change:
  // When activeModule.id changes, clear the chat history, reset rubric scores to zero,
  // and initialize a new Viva session by passing the newly selected subject into the Gemini prompt.
  useEffect(() => {
    setSelectedEvaluation(null);
    setErrorMessage(null);
    setIsEvaluating(true);
    let isCancelled = false;

    generateInitialVivaQuestion(activeSubject)
      .then((openingQuestion) => {
        if (!isCancelled) {
          setVivaMessages([
            {
              id: `viva-${Date.now()}`,
              sender: 'examiner',
              text: openingQuestion,
              timestamp: 'Just now',
            },
          ]);
          setIsEvaluating(false);
        }
      })
      .catch(() => {
        if (!isCancelled) {
          setVivaMessages([
            {
              id: `viva-${Date.now()}`,
              sender: 'examiner',
              text: `Welcome to your ${activeSubject} Practical Viva Voce. Can you explain the core architectural principles and foundational mechanisms of ${activeSubject}?`,
              timestamp: 'Just now',
            },
          ]);
          setIsEvaluating(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [activeModule.id, activeSubject, setVivaMessages]);

  // Voice speech synthesis
  const speakText = (text: string) => {
    if (!isAudioEnabled || typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 0.95;
    window.speechSynthesis.speak(utterance);
  };

  // Callback to handle answer submission
  const handleSubmitAnswer = useCallback(
    async (studentText: string) => {
      if (!studentText.trim() || isEvaluating) return;

      setErrorMessage(null);

      // Check if key is available
      if (!hasValidApiKey()) {
        setIsApiKeyModalOpen(true);
        setErrorMessage(
          'A valid Google Gemini API Key is required for live MCA oral viva examination. Please configure your key.'
        );
        return;
      }

      // Find the latest question asked by examiner
      const lastExaminerMsg =
        [...vivaMessages].reverse().find((m) => m.sender === 'examiner')?.text ||
        `Explain the fundamental mechanisms of ${activeSubject}.`;

      // 1. Immediately append user's message to the chat transcript
      const studentMessage: VivaMessage = {
        id: `student-msg-${Date.now()}`,
        sender: 'student',
        text: studentText,
        timestamp: 'Just now',
      };
      addVivaMessage(studentMessage);

      // 2. Set visible typing loading state
      setIsEvaluating(true);

      try {
        // 3. Await Gemini API response with strict university examiner system prompt
        const { examinerReply, evaluation } = await evaluateStudentVivaAnswer(
          lastExaminerMsg,
          studentText,
          activeSubject
        );

        // 4. Replace typing state with AI response
        const examinerMessage: VivaMessage = {
          id: `examiner-msg-${Date.now() + 1}`,
          sender: 'examiner',
          text: examinerReply,
          timestamp: 'Just now',
          evaluation,
        };

        addVivaMessage(examinerMessage);
        setSelectedEvaluation(evaluation);

        // Trigger gamified celebration confetti if score is >= 8.0
        if (evaluation.overallScore >= 8.0) {
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 2400);
        }

        speakText(examinerReply);
      } catch (err: any) {
        console.error('Live Gemini viva evaluation error:', err);
        if (err.message === 'MISSING_API_KEY') {
          setErrorMessage('Gemini API key is missing. Please click the key button above to add it.');
          setIsApiKeyModalOpen(true);
        } else {
          setErrorMessage(
            err.message || 'Error communicating with Gemini API. Please check your network and API key.'
          );
        }
      } finally {
        setIsEvaluating(false);
      }
    },
    [isEvaluating, vivaMessages, activeSubject, addVivaMessage, setIsApiKeyModalOpen, isAudioEnabled]
  );

  return (
    <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col space-y-4 pb-8">
      {/* Missing API Key Warning Banner if not set */}
      {!hasCustomKey && (
        <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-200">
          <div className="flex items-center gap-2.5">
            <Key className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong>Gemini API Key Required:</strong> To activate the live, dynamic external examiner without mock loops, please configure your Google Gemini API key.
            </span>
          </div>
          <button
            onClick={() => setIsApiKeyModalOpen(true)}
            className="px-3 py-1.5 rounded-lg bg-amber-400 text-black font-semibold hover:bg-amber-300 transition-colors shrink-0 text-xs shadow-sm shadow-amber-500/20"
          >
            Configure Key Now
          </button>
        </div>
      )}

      {/* Error alert banner */}
      {errorMessage && (
        <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/25 text-xs text-rose-300 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-slate-400 hover:text-white text-xs underline cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Viva Voce Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-3xl glass-panel relative overflow-hidden">
        <div className="absolute top-0 right-1/3 w-64 h-64 bg-[#00E5FF]/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center gap-3 relative z-10">
          <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-[#00E5FF]/20 via-[#6366F1]/20 to-[#FF007F]/20 border border-[#00E5FF]/40 text-[#00E5FF] cyber-glow-cyan">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-extrabold text-white tracking-tight">
                Live MCA Practical Viva Voce
              </h1>
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#00E5FF]/15 text-[#00E5FF] border border-[#00E5FF]/30 flex items-center gap-1 font-bold shadow-sm shadow-[#00E5FF]/20">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] animate-ping" />
                Live Gemini Examiner
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Candidate: <strong className="text-white font-bold">{user.name}</strong> • Active Subject Domain:{' '}
              <strong className="text-[#00E5FF] font-mono font-bold">{activeSubject}</strong>
            </p>
          </div>
        </div>

        {/* Toolbar Controls */}
        <div className="flex flex-wrap items-center gap-2 relative z-10">
          {/* Audio voice toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsAudioEnabled(!isAudioEnabled)}
            className={`p-2.5 rounded-2xl border text-xs transition-colors flex items-center gap-1.5 cursor-pointer ${
              isAudioEnabled
                ? 'bg-[#00E5FF]/20 border-[#00E5FF]/40 text-[#00E5FF] shadow-sm shadow-[#00E5FF]/20'
                : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
            }`}
            title={isAudioEnabled ? 'Examiner Voice Reading: ON' : 'Examiner Voice Reading: OFF'}
          >
            {isAudioEnabled ? <Volume2 className="w-4 h-4 text-[#00E5FF]" /> : <VolumeX className="w-4 h-4" />}
          </motion.button>

          {/* Reset session button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => resetVivaChat(activeSubject)}
            className="px-3.5 py-2 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Reset Viva Session"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#FF007F]" />
            <span className="hidden sm:inline">Reset Session</span>
          </motion.button>
        </div>
      </div>

      {/* Main 2-Column Terminal Layout: Chat on Left, Dynamic Rubric on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 flex-1 min-h-[520px]">
        {/* Chat Feed (2 Cols) */}
        <div className="lg:col-span-2 flex flex-col justify-between rounded-3xl glass-panel overflow-hidden shadow-2xl relative">
          {/* Messages Scroll Area */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-5 max-h-[560px]">
            <AnimatePresence>
              {vivaMessages.map((msg) => {
                const isExaminer = msg.sender === 'examiner';
                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, scale: 0.94, y: 12 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ type: 'spring', stiffness: 220, damping: 18 }}
                    className={`flex gap-3 sm:gap-4 ${isExaminer ? 'justify-start' : 'justify-end'}`}
                  >
                    {isExaminer && (
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#00E5FF] to-[#6366F1] flex items-center justify-center text-black shrink-0 shadow-md shadow-[#00E5FF]/20 font-bold">
                        <GraduationCap className="w-4 h-4" />
                      </div>
                    )}

                    <div className="space-y-1.5 max-w-[85%] sm:max-w-[78%]">
                      <div
                        className={`flex items-center gap-2 text-[10px] text-slate-400 ${
                          isExaminer ? 'justify-start' : 'justify-end'
                        }`}
                      >
                        <span className="font-bold text-slate-200 font-mono">
                          {isExaminer ? 'University External Examiner' : user.name}
                        </span>
                        <span>• {msg.timestamp}</span>
                      </div>

                      <div
                        className={`p-4 rounded-3xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap transition-all ${
                          isExaminer
                            ? 'bg-white/[0.05] backdrop-blur-sm border border-white/10 text-slate-100 hover:border-[#00E5FF]/40 shadow-lg'
                            : 'bg-gradient-to-r from-[#00E5FF]/20 via-[#6366F1]/20 to-[#FF007F]/20 border border-[#00E5FF]/50 text-white shadow-md shadow-[#00E5FF]/10'
                        }`}
                      >
                        {msg.text}
                      </div>

                      {/* View Evaluation Breakdown Link if message has evaluation */}
                      {msg.evaluation && (
                        <div className="flex items-center gap-2 pt-1">
                          <motion.button
                            whileHover={{ scale: 1.04 }}
                            onClick={() => setSelectedEvaluation(msg.evaluation!)}
                            className="text-[11px] text-[#00E5FF] hover:text-white flex items-center gap-1 font-mono font-bold hover:underline cursor-pointer"
                          >
                            <Award className="w-3.5 h-3.5 text-[#39FF14]" />
                            <span>Score: {msg.evaluation.overallScore}/10 (Inspect Rubric)</span>
                          </motion.button>
                        </div>
                      )}
                    </div>

                    {!isExaminer && (
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#FF007F] via-[#A855F7] to-[#00E5FF] flex items-center justify-center text-white font-mono font-extrabold text-xs shrink-0 shadow-md">
                        AB
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {/* Visible typing/loading state positioned naturally in the chat stream */}
            {isEvaluating && (
              <motion.div
                initial={{ opacity: 0, scale: 0.94, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="flex gap-3 sm:gap-4 justify-start"
              >
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#00E5FF] to-[#6366F1] flex items-center justify-center text-black shrink-0 shadow-md shadow-[#00E5FF]/20 font-bold">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div className="space-y-1.5 max-w-[85%] sm:max-w-[78%]">
                  <div className="flex items-center gap-2 text-[10px] text-slate-400">
                    <span className="font-bold text-slate-200 font-mono">University External Examiner</span>
                    <span>• Evaluating</span>
                  </div>
                  <div className="p-4 rounded-3xl bg-white/[0.05] backdrop-blur-sm border border-[#00E5FF]/40 text-slate-200 flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#00E5FF] animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 rounded-full bg-[#00E5FF] animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 rounded-full bg-[#00E5FF] animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                    <span className="text-xs font-mono text-[#00E5FF]">
                      Strict Examiner is analyzing candidate depth in {activeSubject}...
                    </span>
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Localized Chat Input Form (isolated to prevent parent re-renders while typing) */}
          <ChatInputForm
            onSubmitAnswer={handleSubmitAnswer}
            isEvaluating={isEvaluating}
            activeSubject={activeSubject}
          />
        </div>

        {/* Dynamic Examiner Feedback & Rubric (Memoized) */}
        <div className="space-y-4">
          <AssessmentRubric
            selectedEvaluation={selectedEvaluation}
            showConfetti={showConfetti}
          />
        </div>
      </div>
    </div>
  );
};
