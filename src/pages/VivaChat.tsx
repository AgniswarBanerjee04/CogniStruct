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

// Soft celebratory particles for score >= 8.0
const CONFETTI_PARTICLES = Array.from({ length: 20 }, (_, i) => {
  const angle = (i / 20) * 360 * (Math.PI / 180);
  const distance = 35 + ((i * 17) % 55);
  const colors = ['#818CF8', '#38BDF8', '#34D399', '#FBBF24', '#C084FC'];
  const color = colors[i % colors.length];
  return {
    id: i,
    x: Math.cos(angle) * distance,
    y: Math.sin(angle) * distance,
    color,
    size: 4 + (i % 3),
    rotation: (i * 45) % 360,
  };
});

const ScoreConfettiBurst: React.FC = React.memo(() => {
  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-20 overflow-visible">
      {CONFETTI_PARTICLES.map((p) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 1, scale: 0, x: 0, y: 0, rotate: 0 }}
          animate={{
            opacity: [1, 1, 0],
            scale: [0, 1.2, 0.3],
            x: p.x,
            y: p.y,
            rotate: p.rotation,
          }}
          transition={{ duration: 1.0, ease: 'easeOut' }}
          className="absolute rounded-full"
          style={{
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
          }}
        />
      ))}
    </div>
  );
});

// Memoized Assessment Rubric
interface AssessmentRubricProps {
  selectedEvaluation: VivaEvaluation | null;
  showConfetti: boolean;
}

const AssessmentRubric: React.FC<AssessmentRubricProps> = React.memo(
  ({ selectedEvaluation, showConfetti }) => {
    return (
      <div className="p-5 rounded-3xl bg-slate-800/40 backdrop-blur-md border border-slate-700/60 space-y-5 shadow-xl relative overflow-hidden">
        <div className="flex items-center justify-between pb-3 border-b border-slate-700/60">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-[#818CF8]" />
            <h3 className="text-sm font-bold text-white tracking-tight">Examiner Assessment Rubric</h3>
          </div>
          <span className="text-[10px] font-mono text-slate-300 px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 font-medium">
            Live Academic Rubric
          </span>
        </div>

        {selectedEvaluation ? (
          <div className="space-y-4 relative">
            {/* Soft Particle Confetti on high score */}
            {showConfetti && <ScoreConfettiBurst />}

            {/* Overall Score Badge */}
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-700/60 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-400 font-medium">
                  Oral Viva Score
                </span>
                <h4 className="text-3xl font-extrabold font-mono text-white flex items-baseline gap-1 mt-0.5">
                  {selectedEvaluation.overallScore}
                  <span className="text-xs text-slate-400 font-sans font-normal">/ 10.0</span>
                </h4>
              </div>
              <div
                className={`px-3 py-1.5 rounded-full text-xs font-mono font-semibold ${
                  selectedEvaluation.overallScore >= 8.0
                    ? 'bg-emerald-500/15 text-[#34D399] border border-emerald-500/30'
                    : selectedEvaluation.overallScore >= 6.0
                    ? 'bg-sky-500/15 text-[#38BDF8] border border-sky-500/30'
                    : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                }`}
              >
                {selectedEvaluation.overallScore >= 8.0
                  ? 'Distinction'
                  : selectedEvaluation.overallScore >= 6.0
                  ? 'Passing Grade'
                  : 'Needs Revision'}
              </div>
            </div>

            {/* Hardware-accelerated Progress Bars */}
            <div className="space-y-3.5">
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-300">Technical Accuracy</span>
                  <span className="font-mono text-[#38BDF8] font-semibold">
                    {selectedEvaluation.accuracyScore} / 10
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-900 overflow-hidden">
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: Math.min(1, selectedEvaluation.accuracyScore / 10) }}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                    style={{ transformOrigin: 'left' }}
                    className="h-full w-full rounded-full bg-[#38BDF8]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-300">Depth of Explanation</span>
                  <span className="font-mono text-[#818CF8] font-semibold">
                    {selectedEvaluation.depthScore} / 10
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-900 overflow-hidden">
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: Math.min(1, selectedEvaluation.depthScore / 10) }}
                    transition={{ duration: 0.5, delay: 0.05, ease: 'easeInOut' }}
                    style={{ transformOrigin: 'left' }}
                    className="h-full w-full rounded-full bg-[#818CF8]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-300">Academic Vocabulary</span>
                  <span className="font-mono text-[#34D399] font-semibold">
                    {selectedEvaluation.confidenceScore} / 10
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-900 overflow-hidden">
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: Math.min(1, selectedEvaluation.confidenceScore / 10) }}
                    transition={{ duration: 0.5, delay: 0.1, ease: 'easeInOut' }}
                    style={{ transformOrigin: 'left' }}
                    className="h-full w-full rounded-full bg-[#34D399]"
                  />
                </div>
              </div>
            </div>

            {/* Examiner Critique Note */}
            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-700/60 space-y-1.5">
              <span className="text-[10px] font-mono text-[#818CF8] uppercase font-semibold flex items-center gap-1">
                <Zap className="w-3 h-3 text-[#818CF8]" /> Examiner Critique:
              </span>
              <p className="text-xs text-slate-300 leading-relaxed italic">
                "{selectedEvaluation.examinerCritique}"
              </p>
            </div>

            {/* Strengths & Weaknesses */}
            <div className="space-y-2 text-xs">
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-[#34D399] font-semibold uppercase flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-[#34D399]" /> Confirmed Strengths:
                </span>
                <ul className="list-disc list-inside text-slate-300 text-[11px] space-y-0.5">
                  {selectedEvaluation.strengths.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>

              {selectedEvaluation.weaknesses.length > 0 && (
                <div className="space-y-1 pt-1">
                  <span className="text-[10px] font-mono text-amber-400 font-semibold uppercase flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 text-amber-400" /> Focus Areas:
                  </span>
                  <ul className="list-disc list-inside text-slate-300 text-[11px] space-y-0.5">
                    {selectedEvaluation.weaknesses.map((w, i) => (
                      <li key={i}>{w}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="space-y-1 pt-1">
                <span className="text-[10px] font-mono text-[#38BDF8] font-semibold uppercase flex items-center gap-1">
                  <Flame className="w-3 h-3 text-[#38BDF8]" /> Suggested Revision:
                </span>
                <p className="text-[11px] text-slate-300 leading-normal">
                  {selectedEvaluation.suggestedRevision}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-900/60 border border-slate-700/60 mx-auto flex items-center justify-center text-slate-400">
              <FileCheck className="w-6 h-6 text-[#818CF8]" />
            </div>
            <h4 className="text-xs font-semibold text-white">Dynamic Examiner Rubric Ready</h4>
            <p className="text-xs text-slate-400 max-w-[220px] mx-auto">
              Submit your oral response to Gemini. The examiner will evaluate accuracy, depth, and vocabulary in real time.
            </p>
          </div>
        )}
      </div>
    );
  }
);

// Memoized Chat Input Form
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
      <div className="p-3 sm:p-4 bg-slate-900/90 border-t border-slate-700/60 space-y-3">
        {/* Quick Answer Prompt Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-[11px] text-slate-400 scrollbar-none">
          <span className="shrink-0 text-slate-400 font-mono font-medium">Quick Prompts:</span>
          <button
            type="button"
            onClick={() =>
              setInputAnswer(
                `Can you provide the complete technical answer for this ${activeSubject} concept?`
              )
            }
            className="px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 hover:text-white border border-slate-700 text-slate-300 shrink-0 transition-colors font-sans cursor-pointer"
          >
            "Give me the complete technical answer"
          </button>
          <button
            type="button"
            onClick={() => setInputAnswer("I don't know the exact mechanism, Professor.")}
            className="px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 hover:text-white border border-slate-700 text-slate-300 shrink-0 transition-colors font-sans cursor-pointer"
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
            className="flex-1 px-4 py-3 rounded-2xl bg-slate-900 border border-slate-700 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#818CF8] focus:ring-1 focus:ring-[#818CF8] transition-colors"
          />
          <motion.button
            whileHover={{ y: -1 }}
            whileTap={{ y: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            type="submit"
            disabled={isEvaluating || !inputAnswer.trim()}
            className="px-6 py-3 rounded-2xl bg-[#818CF8] hover:bg-[#6366F1] active:bg-[#4F46E5] text-white font-semibold text-xs sm:text-sm transition-all shadow-md hover:shadow-lg disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
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

  // Subject change reset
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

  const speakText = useCallback(
    (text: string) => {
      if (!isAudioEnabled || typeof window === 'undefined' || !window.speechSynthesis) return;
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 0.95;
      window.speechSynthesis.speak(utterance);
    },
    [isAudioEnabled]
  );

  const handleSubmitAnswer = useCallback(
    async (studentText: string) => {
      if (!studentText.trim() || isEvaluating) return;

      setErrorMessage(null);

      if (!hasValidApiKey()) {
        setIsApiKeyModalOpen(true);
        setErrorMessage(
          'A valid Google Gemini API Key is required for live oral viva examination. Please configure your key.'
        );
        return;
      }

      const lastExaminerMsg =
        [...vivaMessages].reverse().find((m) => m.sender === 'examiner')?.text ||
        `Explain the fundamental mechanisms of ${activeSubject}.`;

      const studentMessage: VivaMessage = {
        id: `student-msg-${Date.now()}`,
        sender: 'student',
        text: studentText,
        timestamp: 'Just now',
      };
      addVivaMessage(studentMessage);
      setIsEvaluating(true);

      try {
        const { examinerReply, evaluation } = await evaluateStudentVivaAnswer(
          lastExaminerMsg,
          studentText,
          activeSubject
        );

        const examinerMessage: VivaMessage = {
          id: `examiner-msg-${Date.now() + 1}`,
          sender: 'examiner',
          text: examinerReply,
          timestamp: 'Just now',
          evaluation,
        };

        addVivaMessage(examinerMessage);
        setSelectedEvaluation(evaluation);

        if (evaluation.overallScore >= 8.0) {
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 2000);
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
    [isEvaluating, vivaMessages, activeSubject, addVivaMessage, setIsApiKeyModalOpen, speakText]
  );

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col space-y-4 pb-8">
      {/* Missing API Key Warning Banner if not set */}
      {!hasCustomKey && (
        <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-200">
          <div className="flex items-center gap-2.5">
            <Key className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong>Gemini API Key Required:</strong> To activate the live external examiner without mock loops, please configure your Google Gemini API key.
            </span>
          </div>
          <button
            onClick={() => setIsApiKeyModalOpen(true)}
            className="px-3 py-1.5 rounded-lg bg-amber-400 text-black font-semibold hover:bg-amber-300 transition-colors shrink-0 text-xs shadow-sm cursor-pointer"
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-3xl bg-slate-800/40 backdrop-blur-md border border-slate-700/60 shadow-xl relative overflow-hidden">
        <div className="flex items-center gap-3 relative z-10">
          <div className="p-2.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-[#818CF8]">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Live Practical Viva Voce
              </h1>
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1.5 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-[#34D399]" />
                Live Gemini Examiner
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Candidate: <strong className="text-white font-medium">{user.name}</strong> • Active Subject Domain:{' '}
              <strong className="text-[#38BDF8] font-mono font-medium">{activeSubject}</strong>
            </p>
          </div>
        </div>

        {/* Toolbar Controls */}
        <div className="flex flex-wrap items-center gap-2 relative z-10">
          {/* Audio voice toggle */}
          <motion.button
            whileHover={{ y: -1 }}
            whileTap={{ y: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            onClick={() => setIsAudioEnabled(!isAudioEnabled)}
            className={`p-2.5 rounded-2xl border text-xs transition-colors flex items-center gap-1.5 cursor-pointer ${
              isAudioEnabled
                ? 'bg-indigo-500/20 border-indigo-500/40 text-[#818CF8]'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white hover:bg-slate-750'
            }`}
            title={isAudioEnabled ? 'Examiner Voice Reading: ON' : 'Examiner Voice Reading: OFF'}
          >
            {isAudioEnabled ? <Volume2 className="w-4 h-4 text-[#818CF8]" /> : <VolumeX className="w-4 h-4" />}
          </motion.button>

          {/* Reset session button */}
          <motion.button
            whileHover={{ y: -1 }}
            whileTap={{ y: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            onClick={() => resetVivaChat(activeSubject)}
            className="px-3.5 py-2 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Reset Viva Session"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Reset Session</span>
          </motion.button>
        </div>
      </div>

      {/* Main 2-Column Terminal Layout: Chat on Left, Dynamic Rubric on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 flex-1 min-h-[520px]">
        {/* Chat Feed (2 Cols) */}
        <div className="lg:col-span-2 flex flex-col justify-between rounded-3xl bg-slate-800/40 backdrop-blur-md border border-slate-700/60 overflow-hidden shadow-xl relative">
          {/* Messages Scroll Area */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 max-h-[560px]">
            <AnimatePresence>
              {vivaMessages.map((msg) => {
                const isExaminer = msg.sender === 'examiner';
                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, ease: 'easeInOut' }}
                    className={`flex gap-3 sm:gap-4 ${isExaminer ? 'justify-start' : 'justify-end'}`}
                  >
                    {isExaminer && (
                      <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-[#818CF8] shrink-0 font-bold shadow-sm">
                        <GraduationCap className="w-4 h-4" />
                      </div>
                    )}

                    <div className="space-y-1.5 max-w-[85%] sm:max-w-[78%]">
                      <div
                        className={`flex items-center gap-2 text-[10px] text-slate-400 ${
                          isExaminer ? 'justify-start' : 'justify-end'
                        }`}
                      >
                        <span className="font-semibold text-slate-300 font-mono">
                          {isExaminer ? 'University External Examiner' : user.name}
                        </span>
                        <span>• {msg.timestamp}</span>
                      </div>

                      <div
                        className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap transition-colors shadow-sm ${
                          isExaminer
                            ? 'bg-slate-800/80 border border-slate-700/70 text-slate-100'
                            : 'bg-indigo-600/20 border border-indigo-500/40 text-slate-100'
                        }`}
                      >
                        {msg.text}
                      </div>

                      {/* View Evaluation Breakdown Link */}
                      {msg.evaluation && (
                        <div className="flex items-center gap-2 pt-1">
                          <button
                            onClick={() => setSelectedEvaluation(msg.evaluation!)}
                            className="text-[11px] text-[#818CF8] hover:text-indigo-300 flex items-center gap-1 font-mono font-medium hover:underline cursor-pointer"
                          >
                            <Award className="w-3.5 h-3.5 text-[#34D399]" />
                            <span>Score: {msg.evaluation.overallScore}/10 (Inspect Rubric)</span>
                          </button>
                        </div>
                      )}
                    </div>

                    {!isExaminer && (
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-sky-500 flex items-center justify-center text-white font-mono font-bold text-xs shrink-0 shadow-sm">
                        {user.name.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {/* Typing state */}
            {isEvaluating && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, ease: 'easeInOut' }}
                className="flex gap-3 sm:gap-4 justify-start"
              >
                <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-[#818CF8] shrink-0 font-bold shadow-sm">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div className="space-y-1.5 max-w-[85%] sm:max-w-[78%]">
                  <div className="flex items-center gap-2 text-[10px] text-slate-400">
                    <span className="font-semibold text-slate-300 font-mono">University External Examiner</span>
                    <span>• Evaluating</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 text-slate-300 flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#818CF8] animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-[#818CF8] animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-[#818CF8] animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                    <span className="text-xs font-mono text-slate-300">
                      Examiner is evaluating response in {activeSubject}...
                    </span>
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Localized Chat Input Form */}
          <ChatInputForm
            onSubmitAnswer={handleSubmitAnswer}
            isEvaluating={isEvaluating}
            activeSubject={activeSubject}
          />
        </div>

        {/* Dynamic Examiner Feedback & Rubric */}
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
