import React from "react";
import { motion } from "motion/react";
import { ArrowRight, Shield, Activity, Globe } from "lucide-react";
import { useTranslation } from "react-i18next";

interface HeroSectionProps {
  onStart: () => void;
  onLogin: () => void;
}

export function HeroSection({ onStart, onLogin }: HeroSectionProps) {
  const { t } = useTranslation();

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
      {/* Cinematic Content */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative z-10 text-center max-w-4xl"
      >
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="inline-block px-4 py-1 rounded-full border border-neon-blue/30 bg-neon-blue/5 text-neon-blue text-[10px] font-bold uppercase tracking-[0.3em] mb-8"
        >
          Neural Pulse Intelligence System
        </motion.div>

        <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-white mb-6 italic leading-none">
          EPI <span className="text-neon-blue neon-text-glow">PULSE</span>
        </h1>

        <p className="text-lg md:text-xl text-slate-400 font-light max-w-2xl mx-auto mb-12 leading-relaxed">
          The next generation of AI-powered disease detection and global epidemic monitoring. 
          Real-time intelligence for a safer tomorrow.
        </p>

        <div className="flex flex-col md:flex-row items-center justify-center gap-6">
          <button onClick={onStart} className="btn-primary group">
            <span className="flex items-center gap-3">
              Get Started
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>
          <button onClick={onLogin} className="btn-secondary">
            Authorized Personnel Login
          </button>
        </div>
      </motion.div>

      {/* Floating Feature Cards */}
      <div className="absolute bottom-12 left-0 w-full px-12 hidden lg:flex justify-between gap-8 z-10">
        {[
          { icon: Shield, title: "Biometric Shield", desc: "Advanced multimodal detection" },
          { icon: Globe, title: "Global Sync", desc: "Real-time spread tracking" },
          { icon: Activity, title: "Neural Analysis", desc: "Computer vision for malnutrition" },
        ].map((feature, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + (i * 0.2) }}
            className="glass-panel p-6 flex flex-col gap-3 w-64 animate-float"
            style={{ animationDelay: `${i * 1.5}s` }}
          >
            <feature.icon className="w-8 h-8 text-neon-blue" />
            <h3 className="text-sm font-bold text-white uppercase tracking-widest">{feature.title}</h3>
            <p className="text-xs text-slate-500">{feature.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* Background Decorative Elements */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-neon-blue/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-neon-purple/10 blur-[120px] rounded-full pointer-events-none" />
    </div>
  );
}
