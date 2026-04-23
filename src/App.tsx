/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, Suspense } from "react";
import { 
  Activity, 
  Map as MapIcon, 
  ShieldAlert, 
  LayoutDashboard, 
  Database, 
  Settings, 
  Search,
  Bell,
  Cpu,
  Globe,
  Radio,
  FileText,
  Sun,
  Moon,
  Languages,
  User,
  History
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Canvas } from "@react-three/fiber";
import { StatCard } from "./components/ui/StatCard";
import { GlobalMap } from "./components/GlobalMap";
import { AlertPanel } from "./components/AlertPanel";
import { AnalysisPanel } from "./components/AnalysisPanel";
import { TemporalPredictionChart } from "./components/TemporalPredictionChart";
import { MedicalGlobeScene } from "./components/MedicalGlobe";
import { MOCK_CASES } from "./constants";
import { EpidemicStatus, Severity } from "./types";
import { analyzePopulationData } from "./services/geminiService";
import { useTranslation } from "react-i18next";
import "./i18n";

import { AuthSection } from "./components/AuthSection";
import { HeroSection } from "./components/HeroSection";
import { LanguageSelector } from "./components/LanguageSelector";

type AppView = "hero" | "auth" | "language" | "dashboard";

export default function App() {
  const { t, i18n } = useTranslation();
  const [view, setView] = useState<AppView>("hero");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [status, setStatus] = useState<EpidemicStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [user, setUser] = useState<FirebaseUser | null>(null);

  useEffect(() => {
    testFirestoreConnection();
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u && view === 'auth') setView('language');
    });

    async function loadData() {
      setLoading(true);
      try {
        const data = await analyzePopulationData(MOCK_CASES);
        setStatus(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();

    return () => unsubscribe();
  }, [view]);

  const handleLoginSuccess = () => setView("language");
  const handleLanguageSelect = () => setView("dashboard");
  const handleLogout = async () => {
    await logOut();
    setView("hero");
  };

  const menuItems = [
    { id: "dashboard", icon: LayoutDashboard, label: t('dashboard') },
    { id: "epidemiology", icon: Globe, label: t('epidemiology') },
    { id: "analysis", icon: Activity, label: t('analysis') },
    { id: "reports", icon: History, label: t('reports') },
    { id: "settings", icon: Settings, label: t('settings') },
  ];

  return (
    <div className="relative h-screen w-full selection:bg-neon-blue/30 overflow-hidden font-sans bg-dark-bg">
      
      {/* PERSISTENT 3D BACKGROUND (Cinematic) */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
          <Suspense fallback={null}>
            <MedicalGlobeScene />
          </Suspense>
        </Canvas>
      </div>

      <div className="relative z-10 w-full h-full">
        <AnimatePresence mode="wait">
          {view === "hero" && (
            <motion.div
              key="hero"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full h-full"
            >
              <HeroSection onStart={() => setView("auth")} onLogin={() => setView("auth")} />
            </motion.div>
          )}

          {view === "auth" && (
            <motion.div
              key="auth"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full h-full"
            >
              <AuthSection onSuccess={handleLoginSuccess} onBack={() => setView("hero")} />
            </motion.div>
          )}

          {view === "language" && (
            <motion.div
              key="language"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full h-full"
            >
              <LanguageSelector onSelect={handleLanguageSelect} />
            </motion.div>
          )}

          {view === "dashboard" && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex h-screen w-full overflow-hidden"
            >
              {/* Sidebar Navigation */}
              <aside className="w-20 lg:w-64 border-r border-white/5 flex flex-col items-center lg:items-stretch backdrop-blur-md z-50 bg-black/40">
                <div className="p-6 flex items-center gap-3">
                  <div className="relative">
                    <div className="absolute inset-0 bg-neon-blue blur-md opacity-20 rounded-full scale-150 animate-pulse" />
                    <Cpu className="w-8 h-8 text-neon-blue relative" />
                  </div>
                  <span className="hidden lg:block text-xl font-bold tracking-tighter text-white uppercase italic">
                    EP <span className="text-neon-blue">PULSE</span>
                  </span>
                </div>

                <nav className="flex-1 mt-8 space-y-2 px-4">
                  {menuItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all group relative ${
                        activeTab === item.id 
                          ? "bg-neon-blue/10 text-neon-blue border border-neon-blue/20 shadow-[0_0_15px_rgba(0,245,255,0.1)]" 
                          : "text-slate-500 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="hidden lg:block text-[10px] font-bold uppercase tracking-[0.2em]">{item.label}</span>
                      {activeTab === item.id && (
                        <motion.div 
                          layoutId="active-pill" 
                          className="hidden lg:block absolute left-2 w-1 h-6 bg-neon-blue rounded-full shadow-[0_0_10px_#00F5FF]" 
                        />
                      )}
                    </button>
                  ))}
                </nav>

                <div className="p-6 border-t border-white/5 space-y-4">
                  <div 
                    className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 group cursor-pointer hover:bg-white/10 transition-colors" 
                    onClick={handleLogout}
                  >
                    <div className="w-8 h-8 rounded-lg p-0.5 bg-gradient-to-tr from-neon-blue to-neon-purple shadow-lg">
                        <div className="w-full h-full rounded-lg bg-black flex items-center justify-center text-[10px] font-bold text-white overflow-hidden">
                          {user?.photoURL ? (
                            <img src={user.photoURL} alt="avatar" className="w-full h-full object-cover" />
                          ) : (
                            <User className="w-4 h-4" />
                          )}
                        </div>
                    </div>
                    <div className="hidden lg:block overflow-hidden">
                        <p className="text-xs font-bold text-white truncate">{user?.displayName || "Agent Pulse"}</p>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest leading-none mt-1">{t('logout')}</p>
                    </div>
                  </div>
                </div>
              </aside>

              {/* Main Dashboard Area */}
              <main className="flex-1 overflow-y-auto medical-grid custom-scrollbar bg-black/20">
                <header className="sticky top-0 h-20 border-b border-white/5 flex items-center justify-between px-8 z-40 backdrop-blur-xl bg-black/40">
                   <div className="flex items-center gap-8">
                      <div className="hidden md:flex flex-col">
                         <h1 className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.2em]">SECURED NETWORK STATUS</h1>
                         <p className="text-[10px] font-mono text-neon-blue animate-pulse">CONNECTION STABLE • CRYPTO NODE_0721</p>
                      </div>
                      <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-neon-blue transition-colors" />
                        <input 
                          type="text" 
                          placeholder="SCAN POPULATION DATA..."
                          className="bg-white/5 border border-white/10 rounded-full pl-10 pr-4 py-2 text-xs text-white focus:outline-none focus:border-neon-blue/30 w-64 lg:w-96 transition-all"
                        />
                      </div>
                   </div>

                   <div className="flex items-center gap-4">
                      <div className="flex flex-col items-end">
                        <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                          {new Date().toLocaleDateString(i18n.language === 'fr' ? 'fr-FR' : 'en-US', { weekday: 'long', day: 'numeric', month: 'long' })}
                        </p>
                        <p className="text-[10px] font-mono text-neon-blue uppercase">Node Time: {new Date().toLocaleTimeString()}</p>
                      </div>
                   </div>
                </header>

                <div className="p-8">
                  <AnimatePresence mode="wait">
                    {activeTab === "dashboard" ? (
                      <motion.div
                        key="dashboard-content"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-8"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                          <StatCard 
                            title={t('risk_level')} 
                            value={loading ? "..." : `${status?.globalRiskScore || 0}%`}
                            icon={ShieldAlert}
                            trend={{ value: 12, label: "Spiking Detected" }}
                            color="red"
                          />
                          <StatCard 
                            title="Sample Nodes" 
                            value={loading ? "..." : status?.totalCases || 0}
                            icon={Activity}
                            trend={{ value: 5, label: "Upward progression" }}
                            color="blue"
                          />
                          <StatCard 
                            title="Deep Clusters" 
                            value={loading ? "..." : status?.activeClusters.length || 0}
                            icon={Radio}
                            trend={{ value: -2, label: "Mitigating" }}
                            color="purple"
                          />
                          <StatCard 
                            title="AI Sync Integrity" 
                            value="98.2%" 
                            icon={Database}
                            color="green"
                          />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                           <div className="lg:col-span-2 space-y-8">
                              <div className="h-[500px] glass-panel p-4 overflow-hidden relative group">
                                 <div className="absolute inset-0 bg-neon-blue/5 pointer-events-none group-hover:opacity-20 transition-opacity" />
                                 <GlobalMap 
                                    markers={status?.activeClusters.map(c => ({
                                      id: c.id, lat: c.center.lat, lng: c.center.lng,
                                      name: c.name, size: c.riskScore / 5,
                                      color: c.riskScore > 50 ? "#ff0044" : "#bc13fe"
                                    })) || []} 
                                 />
                              </div>
                              <div className="h-[400px] border-neon-blue/10">
                                <TemporalPredictionChart data={status?.temporalPrediction || []} />
                              </div>
                           </div>
                           <div className="lg:col-span-1 h-[932px]">
                              <AlertPanel alerts={status?.alerts || []} />
                           </div>
                        </div>
                      </motion.div>
                    ) : activeTab === "analysis" ? (
                      <motion.div
                        key="analysis-tab"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="max-w-4xl mx-auto h-[calc(100vh-12rem)]"
                      >
                        <AnalysisPanel />
                      </motion.div>
                    ) : activeTab === "reports" ? (
                      <motion.div
                        key="reports-tab"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-4xl mx-auto h-[calc(100vh-12rem)]"
                      >
                        <HistoryPanel />
                      </motion.div>
                    ) : (
                        <div className="h-[60vh] flex flex-col items-center justify-center opacity-20">
                           <Cpu className="w-32 h-32 mb-4 animate-slow-spin" />
                           <h2 className="text-2xl font-mono uppercase tracking-[0.5em]">SYSTEM MODULE OFFLINE</h2>
                        </div>
                    )}
                  </AnimatePresence>
                </div>
              </main>

              <footer className="fixed bottom-0 left-0 lg:left-64 right-0 h-6 bg-black/80 backdrop-blur-md border-t border-white/5 px-4 flex items-center justify-between z-50">
                 <div className="flex items-center gap-4">
                    <span className="text-[9px] font-mono text-neon-blue flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-neon-blue animate-pulse" />
                      SECURE_NODE: PAR_CORTEX_01
                    </span>
                    <span className="text-[9px] font-mono text-slate-600">|</span>
                    <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">GEMINI MULTIMODAL V3 FLASH</span>
                 </div>
                 <div className="flex items-center gap-4">
                    <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">TLS_SECURITY_ACTIVE</span>
                    <span className="text-[9px] font-mono text-neon-cyan neon-text-glow">ENCRYPTED_UPLINK</span>
                 </div>
              </footer>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
