import { motion, AnimatePresence } from "motion/react";
import { AlertCircle, ShieldAlert, Activity, ChevronRight, X } from "lucide-react";
import { Alert, Severity } from "../types";

export function AlertPanel({ alerts, onClose }: { alerts: Alert[], onClose?: () => void }) {
  return (
    <div className="glass-panel h-full flex flex-col border-neon-red/20 overflow-hidden">
      <div className="p-4 border-b border-white/5 flex justify-between items-center bg-neon-red/5">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-neon-red" />
          <h2 className="text-sm font-mono font-bold text-white uppercase tracking-widest">Protocoles d'Alerte Actifs</h2>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neon-red/20 text-neon-red border border-neon-red/30 animate-pulse">
          LIVE
        </span>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
        <AnimatePresence mode="popLayout">
          {alerts.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center opacity-30">
              <Activity className="w-12 h-12 mb-2" />
              <p className="text-xs font-mono uppercase">Aucune menace détectée</p>
            </div>
          ) : (
            alerts.map((alert) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-3 rounded-lg bg-black/40 border border-white/5 hover:border-neon-red/30 transition-colors group cursor-pointer"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-mono text-neon-red uppercase tracking-tighter">
                    {alert.type}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">
                    {new Date(alert.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <h4 className="text-white text-sm font-bold mb-1 group-hover:text-neon-red transition-colors">
                  {alert.location}
                </h4>
                <p className="text-xs text-slate-400 line-clamp-2 italic mb-3">
                  {alert.justification}
                </p>
                <div className="flex justify-between items-center">
                  <div className={`px-2 py-0.5 rounded text-[8px] font-mono ${
                    alert.riskLevel === Severity.CRITICAL ? "bg-neon-red/20 text-neon-red" : "bg-orange-500/20 text-orange-400"
                  }`}>
                    RISQUE {alert.riskLevel}
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-neon-red transition-all group-hover:translate-x-1" />
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
