import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  GraduationCap,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Mail,
  Hash,
  User,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AuthPage: React.FC = () => {
  const { login } = useApp();

  const [email, setEmail] = useState('agniswar.banerjee@msit.edu.in');
  const [password, setPassword] = useState('••••••••••••');
  const [rollNumber, setRollNumber] = useState('MCA-2024-042');
  const [fullName, setFullName] = useState('Agniswar Banerjee');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !rollNumber) return;

    setIsSubmitting(true);
    setTimeout(() => {
      login(email, rollNumber, fullName);
      setIsSubmitting(false);
    }, 600);
  };

  const handleQuickDemo = () => {
    setEmail('agniswar.banerjee@msit.edu.in');
    setRollNumber('MCA-2024-042');
    setFullName('Agniswar Banerjee');
    login('agniswar.banerjee@msit.edu.in', 'MCA-2024-042', 'Agniswar Banerjee');
  };

  // Floating background particles data
  const particles = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 2,
    duration: Math.random() * 8 + 8,
    delay: Math.random() * 2,
  }));

  return (
    <div className="relative min-h-screen w-full bg-[#0B0914] flex items-center justify-center p-4 sm:p-6 overflow-hidden select-none font-sans">
      {/* Background Animated Floating Particles & Neural Mesh */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-40" />

        {/* Floating animated glowing particles with multi-color neon */}
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0.1, y: 0 }}
            animate={{
              opacity: [0.1, 0.5, 0.1],
              y: [-20, 20, -20],
              x: [-10, 10, -10],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
              ease: 'easeInOut',
            }}
            className="absolute rounded-full blur-[0.5px]"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              backgroundColor: p.id % 2 === 0 ? '#00E5FF' : '#FF007F',
              boxShadow: p.id % 2 === 0 ? '0 0 10px #00E5FF' : '0 0 10px #FF007F',
            }}
          />
        ))}

        {/* Ambient radial glows */}
        <div className="absolute -top-[15%] -left-[10%] w-[55vw] h-[55vw] rounded-full bg-gradient-to-br from-[#FF007F]/15 via-[#6366F1]/10 to-transparent blur-[140px]" />
        <div className="absolute -bottom-[20%] -right-[15%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-tl from-[#00E5FF]/15 via-[#A855F7]/10 to-transparent blur-[140px]" />
      </div>

      {/* Main Glassmorphism Authentication Container */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-md bg-white/[0.04] backdrop-blur-md border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden neon-pulse-card"
      >
        {/* Subtle top rim light */}
        <div className="absolute top-0 left-1/4 right-1/4 h-[1.5px] bg-gradient-to-r from-transparent via-[#00E5FF] to-transparent opacity-90 shadow-sm shadow-[#00E5FF]" />

        {/* Header Branding */}
        <div className="text-center space-y-3 mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 border border-cyan-500/30 text-cyan-400 neural-glow mx-auto mb-1">
            <svg
              className="w-6 h-6 text-cyan-400"
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
          </div>

          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center justify-center gap-1.5">
              Cogni<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">Struct</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              AI Academic & RCTF University Learning Engine
            </p>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[11px] font-mono">
            <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
            Meghnad Saha Institute of Technology • MCA
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name field */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-3 h-3 text-cyan-400" /> Candidate Full Name
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Agniswar Banerjee"
                className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-xs sm:text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/60 transition-all font-sans"
              />
            </div>
          </div>

          {/* Email input */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Mail className="w-3 h-3 text-cyan-400" /> University Email
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="agniswar.banerjee@msit.edu.in"
                className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-xs sm:text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/60 transition-all font-sans"
              />
            </div>
          </div>

          {/* University Roll Number */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Hash className="w-3 h-3 text-indigo-400" /> University Roll Number
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
                placeholder="MCA-2024-042"
                className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-xs sm:text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/60 transition-all font-mono"
              />
            </div>
          </div>

          {/* Password field */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Lock className="w-3 h-3 text-cyan-400" /> Academic Session Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-xs sm:text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/60 transition-all font-mono"
              />
            </div>
          </div>

          {/* Primary CTA Button: Electric Indigo (#6366F1) pill with hover glow effect */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="relative w-full py-3 px-6 rounded-full bg-[#6366F1] hover:bg-[#5254e2] text-white font-semibold text-sm transition-all duration-300 shadow-[0_0_25px_rgba(99,102,241,0.5)] hover:shadow-[0_0_35px_rgba(99,102,241,0.7)] flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>{isSubmitting ? 'Authenticating Candidate...' : 'Initialize Session'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </form>

        {/* 1-Click Fast Track Demo Fill */}
        <div className="mt-5 pt-5 border-t border-white/10 text-center">
          <button
            type="button"
            onClick={handleQuickDemo}
            className="w-full py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-mono text-slate-300 hover:text-white border border-white/5 transition-colors flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Fast-Track Authenticate as Agniswar Banerjee (MSIT)</span>
          </button>
        </div>

        {/* Footer Security Badges */}
        <div className="mt-6 flex items-center justify-center gap-4 text-[10px] text-slate-500 font-mono">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-400" /> Encrypted Session
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-cyan-400" /> RCTF Core v2.4
          </span>
        </div>
      </motion.div>
    </div>
  );
};
