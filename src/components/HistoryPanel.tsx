import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { History, FileText, Clock, ExternalLink, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { auth, db, handleFirestoreError } from "../lib/firebase";
import { collection, query, where, orderBy, getDocs, limit } from "firebase/firestore";

export function HistoryPanel() {
  const { t } = useTranslation();
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchHistory() {
      if (!auth.currentUser) return;
      setLoading(true);
      try {
        const q = query(
          collection(db, 'cases'),
          where('userId', '==', auth.currentUser.uid),
          orderBy('timestamp', 'desc'),
          limit(20)
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          date: doc.data().timestamp?.toDate().toLocaleString() || 'Recent'
        }));
        setHistory(data);
      } catch (e) {
        handleFirestoreError(e, 'list', 'cases');
      } finally {
        setLoading(false);
      }
    }

    fetchHistory();
  }, []);

  return (
    <div className="glass-panel h-full flex flex-col overflow-hidden bg-black/10">
      <div className="p-6 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <History className="w-5 h-5 text-neon-blue" />
          <h2 className="text-sm font-mono font-bold text-white uppercase tracking-widest">{t('reports')}</h2>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
        {loading ? (
          <div className="h-full flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-neon-blue animate-spin" />
          </div>
        ) : history.length > 0 ? (
          history.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 rounded-xl bg-black/40 border border-white/5 hover:border-neon-blue/20 transition-all cursor-pointer group"
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] font-mono text-neon-blue uppercase">Analysis</span>
                <div className="flex items-center gap-1 text-[8px] text-slate-500 font-mono">
                  <Clock className="w-3 h-3" />
                  {item.date}
                </div>
              </div>
              <h3 className="text-white text-xs font-bold mb-2 group-hover:text-neon-blue transition-colors truncate">
                {item.description || "System Analysis"}
              </h3>
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <span className={`px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[8px] uppercase ${
                    item.analysis?.severity === 'CRITICAL' ? 'text-neon-red' : 'text-orange-400'
                  }`}>
                    {item.analysis?.severity || 'Normal'}
                  </span>
                </div>
                <ExternalLink className="w-3 h-3 text-slate-600 group-hover:text-neon-blue transition-colors" />
              </div>
            </motion.div>
          ))
        ) : (
          <div className="h-full flex flex-col items-center justify-center opacity-30">
            <FileText className="w-12 h-12 mb-2" />
            <p className="text-xs font-mono uppercase tracking-widest">No reports found</p>
          </div>
        )}
      </div>
      
      <div className="p-4 bg-white/5 border-t border-white/5">
        <button className="w-full py-2 bg-neon-blue/10 border border-neon-blue/20 rounded-lg text-[10px] font-bold text-neon-blue hover:bg-neon-blue/20 transition-colors uppercase">
          Refresh Database
        </button>
      </div>
    </div>
  );
}
