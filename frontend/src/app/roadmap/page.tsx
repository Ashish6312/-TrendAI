"use client";

import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { 
  ArrowLeft, CheckCircle2, Loader2, Play, 
  ChevronRight, Calendar, Users, Rocket,
  ShieldCheck, Sparkle, MapPin, Printer, Globe2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

function RoadmapContent() {
  const { status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useLanguage();
  
  const area = searchParams.get('area');
  const title = searchParams.get('title');
  const desc = searchParams.get('desc');
  const language = searchParams.get('lang') || "English";
  
  const [steps, setSteps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  useEffect(() => {
    if (!area || !title || !desc) {
      router.push("/dashboard");
      return;
    }

    const fetchRoadmap = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        const response = await fetch(`${apiUrl}/api/roadmap`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            area, 
            title, 
            description: desc,
            language: language 
          }),
        });
        
        if (response.ok) {
          const data = await response.json();
          setSteps(data.steps || []);
        } else {
          console.error("Failed to fetch roadmap");
        }
      } catch (error) {
        console.error("Error connecting to API:", error);
      } finally {
        setLoading(false);
      }
    };

    if (status === "authenticated") {
      fetchRoadmap();
    }
  }, [area, title, desc, status, router, language]);

  if (status === "loading" || loading) {
    return (
      <div className="flex h-screen items-center justify-center flex-col gap-8">
        <div className="relative">
          <div className="w-24 h-24 border-2 border-blue-500/20 rounded-full animate-ping absolute inset-0" />
          <div className="w-24 h-24 border-t-2 border-blue-600 rounded-full animate-spin shadow-[0_0_30px_rgba(37,99,235,0.3)]" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Rocket className="text-blue-500 w-10 h-10 animate-pulse" />
          </div>
        </div>
        <div className="space-y-3 text-center">
          <h2 className="text-2xl font-black text-white tracking-tighter uppercase selection:bg-blue-600">Architecting Directive</h2>
          <p className="text-gray-500 text-[10px] font-black tracking-[0.4em] uppercase opacity-70">Synthesizing Regional Intelligence...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#020617]">
      {/* Immersive Background */}
      <div className="absolute inset-0 z-0">
        <motion.img 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
          src="/roadmap_bg.png" 
          alt="Roadmap Architecture" 
          className="w-full h-full object-cover opacity-20 blur-[2px] animate-pulse-slow"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/40 via-[#020617] to-[#020617]" />
      </div>

      <div className="max-w-6xl mx-auto px-6 py-24 relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-10 mb-24">
          <motion.button 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => router.back()} 
            className="group flex items-center gap-4 px-6 py-3.5 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-emerald-500/20 text-gray-400 hover:text-white transition-all w-fit shadow-2xl backdrop-blur-xl"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1.5 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">{t("road_return")}</span>
          </motion.button>
          
          <div className="flex items-center gap-3 px-6 py-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 text-[10px] font-black text-emerald-400 uppercase tracking-[0.3em] shadow-lg">
             <Globe2 size={16} /> {language} Strategic Protocol
          </div>
        </div>

        <header className="mb-32 space-y-10 text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-8 justify-center"
          >
            <div className="h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent flex-1" />
            <Sparkle className="text-emerald-500 animate-pulse" size={40} fill="currentColor" />
            <div className="h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent flex-1" />
          </motion.div>
          
          <div className="space-y-6">
            <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-none max-w-5xl mx-auto italic">
               The <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-600">Growth</span> Directive.
            </h1>
            <div className="flex flex-col items-center gap-8">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl font-black bg-white/5 px-10 py-4 rounded-[2.5rem] border border-white/10 text-emerald-400 shadow-[0_30px_60px_rgba(0,0,0,0.4)] tracking-tight selection:bg-emerald-600"
              >
                {title}
              </motion.h2>
              <div className="flex items-center gap-3 text-gray-500 font-bold tracking-[0.4em] uppercase text-[10px]">
                 <MapPin size={18} className="text-emerald-500" /> 
                 {area}
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-20">
          {/* Progress Sidebar */}
          <div className="hidden lg:block space-y-8 sticky top-36 h-fit">
            <div className="glass-card p-10 bg-gradient-to-b from-emerald-600/15 via-emerald-600/5 to-transparent border-emerald-500/20 shadow-2xl">
               <h4 className="text-[11px] font-black text-emerald-500 uppercase tracking-[0.4em] mb-8 border-b border-white/5 pb-5">{t("road_milestones")}</h4>
               <div className="space-y-7">
                 {steps.map((_, i) => (
                   <div key={i} className="flex items-center gap-5">
                     <div className={`w-2.5 h-2.5 rounded-full transition-all duration-700 ${i === 0 ? 'bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,1)] scale-125' : 'bg-gray-800'}`} />
                     <span className={`text-[12px] font-black tracking-[0.2em] uppercase transition-colors duration-500 ${i === 0 ? 'text-white' : 'text-gray-700'}`}>{t("road_phase")} 0{i+1}</span>
                   </div>
                 ))}
               </div>
            </div>
            
            <div className="glass-card p-10 space-y-10 border-white/5 shadow-xl">
               <div className="flex items-center gap-5">
                  <div className="w-12 h-12 bg-gray-900 rounded-2xl border border-white/5 flex items-center justify-center"><Calendar className="text-gray-500" size={24} /></div>
                  <div className="space-y-1.5">
                     <div className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em]">{t("road_timeline")}</div>
                     <div className="text-sm font-black text-gray-300 italic tracking-tight underline decoration-emerald-500/20">~ 6 Months Cycle</div>
                  </div>
               </div>
               <div className="flex items-center gap-5">
                  <div className="w-12 h-12 bg-gray-900 rounded-2xl border border-white/5 flex items-center justify-center"><Users className="text-gray-500" size={24} /></div>
                  <div className="space-y-1.5">
                     <div className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em]">{t("road_team")}</div>
                     <div className="text-sm font-black text-gray-300 italic tracking-tight underline decoration-amber-500/20">Elite Taskforce</div>
                  </div>
               </div>
            </div>
          </div>

          {/* Steps Content */}
          <div className="lg:col-span-3 space-y-36 relative">
            <div className="absolute left-[59px] top-12 bottom-12 w-px bg-gradient-to-b from-emerald-500/30 via-white/5 to-emerald-500/30 hidden md:block" />
            
            <AnimatePresence>
              {steps.map((step, index) => (
                <motion.div 
                  key={index} 
                  initial={{ opacity: 0, x: 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-15%" }}
                  transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                  className="relative pl-0 md:pl-32 group"
                >
                  {/* Number Badge */}
                  <div className="hidden md:flex absolute left-0 top-0 w-28 h-28 items-center justify-center">
                    <div className="w-20 h-20 bg-gray-950 border-2 border-white/10 rounded-[2.5rem] flex items-center justify-center text-emerald-500 font-black text-3xl z-10 group-hover:border-emerald-500 group-hover:text-white group-hover:bg-emerald-600 transition-all duration-700 shadow-3xl group-hover:shadow-emerald-600/30 group-hover:-translate-y-2">
                      {step.step_number}
                    </div>
                  </div>
                  
                  <div className="glass-card p-14 md:p-16 bg-gradient-to-br from-white/[0.03] to-transparent border-white/5 hover:bg-white/[0.06] transition-all duration-700 hover:border-emerald-500/30 group-hover:shadow-[0_50px_100px_-20px_rgba(16,185,129,0.15)] relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                    
                    <div className="flex items-center gap-6 mb-10 relative z-10">
                      <div className="w-2.5 h-10 bg-emerald-600 rounded-full shadow-[0_0_30px_#10b981] animate-pulse" />
                      <h3 className="text-4xl font-black text-white tracking-tighter group-hover:text-emerald-400 transition-colors leading-[0.9]">
                        {step.step_title}
                      </h3>
                    </div>
                    
                    <div className="space-y-10 relative z-10">
                       <p className="text-gray-400 leading-relaxed text-2xl font-medium tracking-tight">
                         {step.step_description}
                       </p>
                       
                       <div className="flex flex-wrap gap-6 pt-10 border-t border-white/5">
                          <div className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em] shadow-inner">
                             <ShieldCheck size={18} /> {t("road_priority")}
                          </div>
                          <div className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-amber-500/5 border border-amber-500/15 text-[10px] font-black text-amber-500 uppercase tracking-[0.4em]">
                             <ChevronRight size={18} /> {t("road_action")}
                          </div>
                       </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Conclusion */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="glass-card p-20 md:p-28 bg-gradient-to-br from-emerald-600/15 via-transparent to-amber-600/15 border-emerald-500/30 flex flex-col items-center text-center relative overflow-hidden shadow-3xl"
            >
              <div className="absolute inset-0 bg-grid-white/[0.01] pointer-events-none" />
              <div className="w-32 h-32 bg-emerald-500/20 rounded-[3rem] flex items-center justify-center mb-12 shadow-[0_0_80px_-10px_rgba(16,185,129,0.5)] border-2 border-emerald-500/30 animate-pulse">
                <CheckCircle2 className="w-16 h-16 text-emerald-400" />
              </div>
              <h3 className="text-6xl font-black text-white mb-8 tracking-tighter uppercase italic">{t("road_readiness")}</h3>
              <p className="text-gray-400 max-w-2xl mx-auto text-2xl font-bold leading-relaxed tracking-tight selection:bg-emerald-600/30 mb-16">
                Market readiness protocol complete. Regional analysis confirms high-probability success cycle for this venture.
              </p>
              <button 
                onClick={() => window.print()} 
                className="h-20 px-16 bg-white text-black font-black rounded-[2rem] text-[12px] uppercase tracking-[0.5em] hover:bg-emerald-500 hover:text-white transition-all duration-700 shadow-2xl flex items-center gap-6 hover:-translate-y-3 active:scale-95"
              >
                <Printer size={24} />
                {t("road_print")}
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RoadmapPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center flex-col gap-8 text-gray-500 font-black animate-pulse uppercase tracking-[0.4em] text-xs"><Loader2 className="animate-spin mb-4 w-12 h-12" /> Initializing Strategy Protocol...</div>}>
      <RoadmapContent />
    </Suspense>
  );
}
