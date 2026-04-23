import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Mail, Lock, User, ShieldCheck, ArrowRight, Github, Chrome } from "lucide-react";
import { useTranslation } from "react-i18next";

interface AuthSectionProps {
  onSuccess: () => void;
  onBack: () => void;
}

export function AuthSection({ onSuccess, onBack }: AuthSectionProps) {
  const { t } = useTranslation();
  const [mode, setMode] = useState<"login" | "signup">("login");

  return (
    <div className="relative min-h-screen flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="glass-panel p-8 space-y-8 relative overflow-hidden">
          {/* Decorative light streak */}
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-neon-blue to-transparent opacity-50" />

          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter text-white uppercase italic">
              {mode === "login" ? "Authentication" : "Register Node"}
            </h2>
            <p className="text-xs font-mono text-neon-blue/60 uppercase tracking-widest leading-loose">
              Security Protocol: RSA-4096 Active
            </p>
          </div>

          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); onSuccess(); }}>
            {mode === "signup" && (
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Assigned Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input type="text" className="neon-input pl-11" placeholder="Dr. John Doe" />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Network Identifier (Email)</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input type="email" className="neon-input pl-11" placeholder="name@pulse.node" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Security Key (Password)</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input type="password" className="neon-input pl-11" placeholder="••••••••" />
              </div>
            </div>

            <button type="submit" className="btn-primary w-full group mt-4">
              <span className="flex items-center justify-center gap-3">
                {mode === "login" ? "Initialize Node" : "Authorize Entry"}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
          </form>

          <div className="relative flex items-center justify-center py-4">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
            <span className="relative px-4 text-[10px] font-bold text-slate-600 bg-[#05060A] uppercase tracking-widest">
              Biometric Secondary
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-xs text-white">
              <Chrome className="w-4 h-4" /> Google
            </button>
            <button className="flex items-center justify-center gap-2 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-xs text-white">
              <Github className="w-4 h-4" /> GitHub
            </button>
          </div>

          <div className="text-center">
            <button 
              onClick={() => setMode(mode === "login" ? "signup" : "login")}
              className="text-[10px] font-bold text-neon-blue uppercase tracking-widest hover:text-white transition-colors"
            >
              {mode === "login" ? "Create new node account" : "Exist system credentials? Login"}
            </button>
          </div>
        </div>

        <button 
          onClick={onBack}
          className="mt-8 mx-auto flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-xs uppercase tracking-widest font-bold"
        >
          Return to Uplink
        </button>
      </motion.div>
    </div>
  );
}
