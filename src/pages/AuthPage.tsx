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
  Check,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AuthPage: React.FC = () => {
  const { login, loginAsDemo } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [fullName, setFullName] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !rollNumber.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      login(email.trim(), rollNumber.trim(), fullName.trim(), rememberMe);
      setIsSubmitting(false);
    }, 400);
  };

  const handleRecruiterDemo = () => {
    loginAsDemo();
  };

  return (
    <div className="relative min-h-screen w-full bg-[#0F172A] flex items-center justify-center p-4 sm:p-6 overflow-hidden select-none font-sans text-slate-100">
      {/* Background Soft Ambient Lighting & Grid */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-40" />

        {/* Soft calm ambient gradients */}
        <div className="absolute -top-[15%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-indigo-500/[0.07] blur-[140px]" />
        <div className="absolute -bottom-[20%] -right-[10%] w-[55vw] h-[55vw] rounded-full bg-sky-500/[0.06] blur-[140px]" />
      </div>

      {/* Main Clean Glassmorphic Container */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
        className="relative z-10 w-full max-w-md bg-slate-800/40 backdrop-blur-md border border-slate-700/60 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden"
      >
        {/* Header Branding */}
        <div className="text-center space-y-3 mb-7">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-[#818CF8] mx-auto mb-1">
            <GraduationCap className="w-6 h-6 text-[#818CF8]" />
          </div>

          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center justify-center gap-1.5">
              Cogni<span className="text-[#818CF8]">Struct</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              AI Academic & Engineering Study Platform
            </p>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 text-[11px] font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-[#34D399]" />
            Enterprise Academic Edition • Computer Science
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name field */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#818CF8]" /> Candidate Full Name
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Alex Morgan"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900/60 border border-slate-700/70 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#818CF8] focus:ring-1 focus:ring-[#818CF8] transition-all font-sans"
            />
          </div>

          {/* Email input */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#38BDF8]" /> University Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. student@university.edu"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900/60 border border-slate-700/70 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#38BDF8] focus:ring-1 focus:ring-[#38BDF8] transition-all font-sans"
            />
          </div>

          {/* University Roll Number */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Hash className="w-3.5 h-3.5 text-[#818CF8]" /> University Roll Number
            </label>
            <input
              type="text"
              required
              value={rollNumber}
              onChange={(e) => setRollNumber(e.target.value)}
              placeholder="e.g. CS-2026-001"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900/60 border border-slate-700/70 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#818CF8] focus:ring-1 focus:ring-[#818CF8] transition-all font-mono"
            />
          </div>

          {/* Password field */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-[#38BDF8]" /> Academic Session Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900/60 border border-slate-700/70 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#38BDF8] focus:ring-1 focus:ring-[#38BDF8] transition-all font-mono"
            />
          </div>

          {/* Remember Me Checkbox */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer group select-none">
              <div
                onClick={() => setRememberMe(!rememberMe)}
                className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${
                  rememberMe
                    ? 'bg-[#818CF8] border-[#818CF8] text-white'
                    : 'bg-slate-900/60 border-slate-700 group-hover:border-slate-500'
                }`}
              >
                {rememberMe && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
              <span className="text-xs text-slate-300 group-hover:text-white transition-colors">
                Remember Me
              </span>
            </label>
            <span className="text-[11px] text-slate-400">
              {rememberMe ? 'Persistent session' : 'Session expires on close'}
            </span>
          </div>

          {/* Primary CTA Button: Soft Indigo (#818CF8) */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 sm:py-3 px-6 rounded-full bg-[#818CF8] hover:bg-[#6366F1] active:bg-[#4F46E5] text-white font-semibold text-sm transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-50"
            >
              <span>{isSubmitting ? 'Authenticating...' : 'Sign In to Workspace'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </form>

        {/* Recruiter Demo Mode Action */}
        <div className="mt-5 pt-5 border-t border-slate-700/60 text-center space-y-2">
          <p className="text-[11px] text-slate-400">
            Evaluating CogniStruct for hiring or academic review?
          </p>
          <button
            type="button"
            onClick={handleRecruiterDemo}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700/80 active:bg-slate-700 text-xs font-semibold text-slate-200 hover:text-white border border-slate-700 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span>View Demo Dashboard</span>
          </button>
        </div>

        {/* Footer Security Badges */}
        <div className="mt-6 flex items-center justify-center gap-4 text-[10px] text-slate-400 font-mono">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-[#34D399]" /> Secure Academic Gateway
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-[#38BDF8]" /> RCTF Framework v2.4
          </span>
        </div>
      </motion.div>
    </div>
  );
};
