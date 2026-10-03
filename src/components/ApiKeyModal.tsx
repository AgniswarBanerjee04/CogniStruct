import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Key, Sparkles, CheckCircle2, AlertCircle, X, ExternalLink, Shield } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ApiKeyModal: React.FC = () => {
  const { isApiKeyModalOpen, setIsApiKeyModalOpen, apiKey, updateApiKey, hasCustomKey } = useApp();
  const [inputValue, setInputValue] = useState(apiKey);
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'failed'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isApiKeyModalOpen) return null;

  const handleSave = () => {
    updateApiKey(inputValue);
    setIsApiKeyModalOpen(false);
  };

  const handleClear = () => {
    setInputValue('');
    updateApiKey('');
    setTestStatus('idle');
  };

  const testKey = async () => {
    if (!inputValue || inputValue.length < 10) {
      setTestStatus('failed');
      setErrorMessage('Please enter a valid Google Gemini API key.');
      return;
    }

    setTestStatus('testing');
    setErrorMessage('');

    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${inputValue.trim()}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: 'Respond with the single word: "READY"' }] }],
          }),
        }
      );

      if (res.ok) {
        setTestStatus('success');
      } else {
        const error = await res.json().catch(() => ({}));
        setTestStatus('failed');
        setErrorMessage(error?.error?.message || 'Invalid API key or model quota exceeded.');
      }
    } catch {
      setTestStatus('failed');
      setErrorMessage('Network error while testing connection to Google AI Studio.');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-lg bg-[#0B0914]/95 backdrop-blur-md border border-white/10 rounded-3xl shadow-[0_0_50px_rgba(0,229,255,0.15)] overflow-hidden p-6"
        >
          {/* Subtle Cyber Accents Glow */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#00E5FF]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-[#FF007F]/20 rounded-full blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="flex items-start justify-between mb-5 relative z-10">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-[#00E5FF]/10 border border-[#00E5FF]/30 text-[#00E5FF] cyber-glow-cyan">
                <Key className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight">Gemini AI Engine Configuration</h3>
                <p className="text-xs text-slate-300">Active Google Gemini API integration for CogniStruct</p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsApiKeyModalOpen(false)}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </motion.button>
          </div>

          {/* Status banner */}
          <div
            className={`p-3.5 mb-5 rounded-2xl border flex items-center gap-3 text-xs relative z-10 ${
              hasCustomKey
                ? 'bg-[#00E5FF]/10 border-[#00E5FF]/30 text-[#00E5FF]'
                : 'bg-[#FF007F]/10 border-[#FF007F]/30 text-[#FF007F]'
            }`}
          >
            <Sparkles className={`w-4 h-4 shrink-0 ${hasCustomKey ? 'text-[#00E5FF]' : 'text-[#FF007F]'}`} />
            <div>
              <span className="font-bold">
                Current Engine: {hasCustomKey ? 'Live Google Gemini 1.5 Flash' : 'High-Fidelity CS Academic Simulator'}
              </span>
              <p className="opacity-90 mt-0.5">
                {hasCustomKey
                  ? 'Prompts and Oral Viva queries are sent directly to Google Gemini 1.5 Flash.'
                  : 'Configure your Gemini key to activate dynamic oral examinations without mock loops.'}
              </p>
            </div>
          </div>

          {/* Input field */}
          <div className="space-y-2 mb-4 relative z-10">
            <label className="text-xs font-semibold text-slate-200 flex items-center justify-between">
              <span>Google Gemini API Key</span>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-[#00E5FF] hover:underline flex items-center gap-1 font-mono font-bold"
              >
                Get free key from Google AI Studio <ExternalLink className="w-3 h-3" />
              </a>
            </label>
            <div className="relative">
              <input
                type="password"
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  setTestStatus('idle');
                }}
                placeholder="AQ.Ab8RN... or AIzaSy..."
                className="w-full px-4 py-3 bg-black/60 border border-white/15 rounded-2xl text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-[#00E5FF] focus:ring-1 focus:ring-[#00E5FF] font-mono transition-all"
              />
            </div>
          </div>

          {/* Test Status feedback */}
          {testStatus === 'success' && (
            <div className="p-3 mb-4 rounded-2xl bg-[#39FF14]/10 border border-[#39FF14]/30 text-[#39FF14] text-xs flex items-center gap-2 relative z-10 shadow-[0_0_15px_rgba(57,255,20,0.15)]">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>API Key validated successfully with Google Gemini endpoint!</span>
            </div>
          )}

          {testStatus === 'failed' && (
            <div className="p-3 mb-4 rounded-2xl bg-rose-500/10 border border-rose-500/25 text-rose-300 text-xs flex items-center gap-2 relative z-10">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Security note */}
          <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-6 relative z-10">
            <Shield className="w-3.5 h-3.5 shrink-0 text-[#00E5FF]" />
            <span>Keys are saved locally in .env or your secure browser session storage.</span>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-between pt-3 border-t border-white/10 relative z-10">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={handleClear}
              className="text-xs text-slate-400 hover:text-[#FF007F] transition-colors cursor-pointer"
            >
              Reset Key
            </motion.button>
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={testKey}
                disabled={testStatus === 'testing' || !inputValue}
                className="px-4 py-2 text-xs font-semibold text-slate-200 bg-white/5 hover:bg-white/10 border border-white/15 rounded-xl transition-colors disabled:opacity-50 cursor-pointer"
              >
                {testStatus === 'testing' ? 'Testing...' : 'Test Connection'}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={handleSave}
                className="px-4 py-2 text-xs font-extrabold text-black bg-gradient-to-r from-[#00E5FF] to-[#6366F1] hover:from-[#00E5FF] hover:to-[#FF007F] rounded-xl shadow-[0_0_20px_rgba(0,229,255,0.4)] transition-all cursor-pointer"
              >
                Save Configuration
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
