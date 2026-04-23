import React from "react";
import { motion } from "motion/react";
import { Languages, Globe } from "lucide-react";
import { useTranslation } from "react-i18next";

interface LanguageSelectorProps {
  onSelect: () => void;
}

export function LanguageSelector({ onSelect }: LanguageSelectorProps) {
  const { i18n } = useTranslation();

  const handleSelect = (lng: string) => {
    i18n.changeLanguage(lng);
    onSelect();
  };

  const options = [
    { code: "en", name: "English Neural Core", flag: "🇺🇸", desc: "Native English System Interface" },
    { code: "fr", name: "Noyau Francophone", flag: "🇫🇷", desc: "Interface système française native" },
  ];

  return (
    <div className="relative min-h-screen flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-2xl"
      >
        <div className="text-center mb-12 space-y-4">
          <Languages className="w-16 h-16 text-neon-blue mx-auto neon-text-glow" />
          <h2 className="text-4xl font-bold tracking-tighter text-white uppercase italic">Select Uplink Protocol</h2>
          <p className="text-sm font-mono text-neon-blue/60 uppercase tracking-widest leading-loose">
            Choose your localized cognitive interface
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {options.map((opt) => (
            <button
              key={opt.code}
              onClick={() => handleSelect(opt.code)}
              className="glass-panel p-8 flex flex-col items-center gap-4 hover:border-neon-blue/50 group transition-all"
            >
              <span className="text-5xl mb-2 group-hover:scale-110 transition-transform">{opt.flag}</span>
              <div className="text-center">
                <h3 className="text-lg font-bold text-white uppercase italic">{opt.name}</h3>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">{opt.desc}</p>
              </div>
              <div className="mt-4 px-4 py-2 bg-neon-blue/10 border border-neon-blue/20 rounded-full text-[10px] font-bold text-neon-blue group-hover:bg-neon-blue group-hover:text-black transition-all">
                INITIALIZE
              </div>
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
