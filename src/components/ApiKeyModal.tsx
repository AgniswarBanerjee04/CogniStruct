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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          className="relative w-full max-w-lg bg-[#1E293B] border border-slate-700 rounded-3xl shadow-2xl overflow-hidden p-6"
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-5 relative z-10">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-[#818CF8]">
                <Key className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight">Gemini AI Engine Configuration</h3>
                <p className="text-xs text-slate-300">Active Google Gemini API integration for CogniStruct</p>
              </div>
            </div>
            <button
              onClick={() => setIsApiKeyModalOpen(false)}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Status banner */}
          <div
            className={`p-3.5 mb-5 rounded-2xl border flex items-center gap-3 text-xs relative z-10 ${
              hasCustomKey
                ? 'bg-emerald-500/10 border-emerald-500/25 text-[#34D399]'
                : 'bg-slate-800 border-slate-700 text-slate-300'
            }`}
          >
            <Sparkles className={`w-4 h-4 shrink-0 ${hasCustomKey ? 'text-[#34D399]' : 'text-[#818CF8]'}`} />
            <div>
              <span className="font-semibold">
                Current Engine: {hasCustomKey ? 'Live Google Gemini 1.5 Flash' : 'High-Fidelity CS Academic Simulator'}
              </span>
              <p className="opacity-90 mt-0.5 text-slate-400">
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
                className="text-[11px] text-[#818CF8] hover:underline flex items-center gap-1 font-mono font-medium"
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
                placeholder="AIzaSy..."
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-2xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#818CF8] focus:ring-1 focus:ring-[#818CF8] font-mono transition-colors"
              />
            </div>
          </div>

          {/* Test Status feedback */}
          {testStatus === 'success' && (
            <div className="p-3 mb-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-[#34D399] text-xs flex items-center gap-2 relative z-10">
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
            <Shield className="w-3.5 h-3.5 shrink-0 text-[#818CF8]" />
            <span>Keys are saved locally in your secure browser session storage.</span>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-700 relative z-10">
            <button
              type="button"
              onClick={handleClear}
              className="text-xs text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
            >
              Reset Key
            </button>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={testKey}
                disabled={testStatus === 'testing' || !inputValue}
                className="px-4 py-2 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-colors disabled:opacity-50 cursor-pointer"
              >
                {testStatus === 'testing' ? 'Testing...' : 'Test Connection'}
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#818CF8] hover:bg-[#6366F1] active:bg-[#4F46E5] rounded-xl shadow-md transition-all cursor-pointer"
              >
                Save Configuration
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
