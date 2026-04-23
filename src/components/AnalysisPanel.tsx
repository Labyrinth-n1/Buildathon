import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Activity, Camera, Upload, Brain, ShieldAlert, Dna, Microscope, ArrowRight, Loader2, X, Eye } from "lucide-react";
import { analyzeMultimodalEntry } from "../services/geminiService";
import { IndividualAnalysis, Severity } from "../types";
import { useTranslation } from "react-i18next";
import { auth, db, handleFirestoreError } from "../lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export function AnalysisPanel() {
  const { t } = useTranslation();
  const [symptoms, setSymptoms] = useState("");
  const [ageRange, setAgeRange] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<{ diagnosis: IndividualAnalysis, visionAnalysis?: any } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!symptoms.trim() && !image) return;
    setAnalyzing(true);
    try {
      const base64Image = image ? image.split(',')[1] : undefined;
      const combinedInfo = `Age Range: ${ageRange || "Not Specified"}\nLocation: ${location || "Not Specified"}\nSymptoms: ${symptoms}`;
      const data = await analyzeMultimodalEntry(combinedInfo, base64Image);
      setResult(data);

      // Save to Firestore if user is logged in
      if (auth.currentUser) {
        try {
          await addDoc(collection(db, 'cases'), {
            userId: auth.currentUser.uid,
            timestamp: serverTimestamp(),
            symptoms: symptoms.split(',').map(s => s.trim()),
            description: symptoms,
            ageRange: ageRange || null,
            locationText: location || null,
            imageUrl: image || null,
            analysis: data.diagnosis,
            visionAnalysis: data.visionAnalysis || null,
            location: { lat: 0, lng: 0, city: location || "Unknown" }
          });
        } catch (fsError) {
          handleFirestoreError(fsError, 'create', 'cases');
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 overflow-hidden">
        {/* Left: Input & Vision */}
        <div className="space-y-6 flex flex-col overflow-y-auto custom-scrollbar pr-2">
          <div className="glass-panel p-6 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-5 h-5 text-neon-blue" />
              <h2 className="text-sm font-bold text-white uppercase tracking-widest">Clinical Data</h2>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest ml-1">Age Range</label>
                <input 
                  type="text" 
                  value={ageRange}
                  onChange={(e) => setAgeRange(e.target.value)}
                  placeholder="e.g. 5-10 years"
                  className="neon-input !py-2"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest ml-1">Node Location</label>
                <input 
                  type="text" 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Paris, FR"
                  className="neon-input !py-2"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest ml-1">Symptom Log</label>
              <textarea 
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                placeholder="Describe current condition and duration..."
                className="neon-input h-24 resize-none"
              />
            </div>
          </div>

          <div className="glass-panel p-6 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-neon-purple" />
                <h2 className="text-sm font-bold text-white uppercase tracking-widest">Vision Diagnostics</h2>
              </div>
              {image && (
                <button onClick={() => setImage(null)} className="text-[10px] text-neon-red uppercase font-bold hover:underline">
                  Clear Image
                </button>
              )}
            </div>
            
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`relative aspect-video rounded-xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center overflow-hidden ${
                image ? 'border-neon-blue/50' : 'border-white/10 hover:border-white/20 bg-white/5'
              }`}
            >
              {image ? (
                <>
                  <img src={image} alt="Upload" className="w-full h-full object-cover" />
                  {analyzing && <div className="scanning-laser z-20" />}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <span className="text-xs font-bold text-white uppercase">Replace Image</span>
                  </div>
                </>
              ) : (
                <div className="text-center p-8">
                  <Upload className="w-10 h-10 text-slate-600 mx-auto mb-4" />
                  <p className="text-xs text-slate-400 uppercase tracking-widest leading-loose">
                    Drop clinical image or click to upload<br/>
                    <span className="text-[10px] opacity-50">JPG, PNG up to 5MB</span>
                  </p>
                </div>
              )}
              <input 
                ref={fileInputRef}
                type="file" 
                accept="image/*" 
                onChange={handleImageUpload} 
                className="hidden" 
              />
            </div>
          </div>

          <button 
            onClick={handleAnalyze}
            disabled={analyzing || (!symptoms.trim() && !image)}
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            <span className="flex items-center justify-center gap-3">
              {analyzing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {t('analyzing')}
                </>
              ) : t('analyze')}
              {!analyzing && <Brain className="w-5 h-5 group-hover:scale-110 transition-transform" />}
            </span>
          </button>
        </div>

        {/* Right: Results */}
        <div className="glass-panel overflow-hidden flex flex-col">
          <div className="p-6 border-b border-white/5 bg-white/5">
            <h2 className="text-xs font-mono font-bold text-neon-blue uppercase tracking-[0.4em]">Integrated Intelligence Output</h2>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
            {!result && !analyzing && (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-30 mt-20">
                <Dna className="w-16 h-16 mb-4 animate-pulse" />
                <p className="text-sm font-mono uppercase tracking-widest">Awaiting Neural Uplink...</p>
              </div>
            )}

            {analyzing && (
              <div className="space-y-8 animate-pulse p-4">
                <div className="h-20 bg-white/5 rounded-xl" />
                <div className="h-40 bg-white/5 rounded-xl" />
                <div className="h-20 bg-white/5 rounded-xl" />
              </div>
            )}

            {result && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-8"
              >
                {/* Vision Results Section */}
                {result.visionAnalysis && (
                  <section className="space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-neon-purple shadow-[0_0_8px_#A855F7]" />
                      <h3 className="text-xs font-bold text-white uppercase italic tracking-widest">Anatomic Vision Findings</h3>
                    </div>
                    
                    <div className={`p-5 rounded-2xl border backdrop-blur-md ${
                      result.visionAnalysis.malnutritionRisk.level === 'high' 
                        ? 'bg-neon-red/10 border-neon-red/30 shadow-[0_0_15px_rgba(255,0,68,0.1)]' 
                        : 'bg-neon-purple/5 border-neon-purple/20'
                    }`}>
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Malnutrition Risk Profile</span>
                          <span className={`text-lg font-bold uppercase tracking-tighter ${
                            result.visionAnalysis.malnutritionRisk.level === 'high' ? 'text-neon-red' : 'text-neon-purple'
                          }`}>
                            {result.visionAnalysis.malnutritionRisk.level} risk
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] font-mono text-slate-500 uppercase block">Confidence</span>
                          <span className="text-sm font-bold text-white">{result.visionAnalysis.confidenceScore}%</span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed bg-black/40 p-3 rounded-xl border border-white/5 mb-4">
                        {result.visionAnalysis.malnutritionRisk.explanation}
                      </p>

                      <div className="space-y-3">
                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">Detected Indicators</span>
                        <div className="flex flex-wrap gap-2">
                          {result.visionAnalysis.detectedIndicators.map((tag: string, i: number) => (
                            <span key={i} className="px-2 py-1 bg-white/5 border border-white/10 rounded-md text-[9px] text-neon-purple font-bold uppercase">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="glass-panel p-4 space-y-3">
                       <div className="flex items-center gap-2 text-[10px] font-bold text-white uppercase">
                          <Brain className="w-3 h-3 text-neon-purple" />
                          AI Reasoning
                       </div>
                       <p className="text-[10px] text-slate-500 leading-relaxed italic">
                          {result.visionAnalysis.reasoning}
                       </p>
                    </div>

                    <div className="p-4 rounded-xl bg-neon-green/10 border border-neon-green/20">
                       <div className="flex items-center gap-2 text-[10px] font-bold text-neon-green uppercase mb-1">
                          <ShieldAlert className="w-3 h-3" />
                          Health Recommendation
                       </div>
                       <p className="text-[10px] text-slate-300">
                          {result.visionAnalysis.healthRecommendation}
                       </p>
                    </div>
                  </section>
                )}

                {/* Diagnostic Results Section */}
                <section className="space-y-4">
                  <div className="flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full bg-neon-blue shadow-[0_0_8px_#00F5FF]" />
                     <h3 className="text-xs font-bold text-white uppercase italic tracking-widest">Symptomatic Prognosis</h3>
                  </div>
                  <div className="space-y-3">
                    {result.diagnosis.diseases.map((d: any, i: number) => (
                      <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/5 group hover:border-neon-blue/20 transition-all">
                        <div className="flex justify-between items-center mb-1">
                          <h4 className="text-sm font-bold text-white italic tracking-tight">{d.name}</h4>
                          <span className="text-[10px] font-mono text-neon-blue">{d.probability}% CONF</span>
                        </div>
                        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                           <motion.div 
                             initial={{ width: 0 }}
                             animate={{ width: `${d.probability}%` }}
                             className="h-full bg-neon-blue"
                           />
                        </div>
                        <p className="text-[9px] text-slate-600 italic mt-2 line-clamp-2">
                           {d.rationale}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>

                <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20 text-[10px] text-orange-400 font-mono flex gap-3">
                  <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                  <span>DISCLAIMER: Neural analysis results are probabilistic. This is a community health support tool, not a clinical diagnostic device.</span>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
