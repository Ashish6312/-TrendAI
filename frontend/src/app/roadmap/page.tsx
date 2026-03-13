"use client";

import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { 
  ArrowLeft, CheckCircle2, Loader2, 
  ChevronRight, Calendar, Users, Rocket,
  ShieldCheck, Sparkle, MapPin, Printer, Globe2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

interface RoadmapStep {
  step_number: number;
  step_title: string;
  step_description: string;
}

function RoadmapContent() {
  const { status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useLanguage();
  
  const area = searchParams.get('area');
  const title = searchParams.get('title');
  const desc = searchParams.get('desc');
  const language = searchParams.get('lang') || "English";
  
  const [steps, setSteps] = useState<RoadmapStep[]>([]);
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
    <div className="max-w-5xl mx-auto px-6 py-16">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-10 mb-20">
        <motion.button 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => router.back()} 
          className="group flex items-center gap-4 px-6 py-3.5 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 text-gray-400 hover:text-white transition-all w-fit shadow-lg"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1.5 transition-transform" />
          <span className="text-xs font-black uppercase tracking-[0.2em]">{t("road_return")}</span>
        </motion.button>
        
        <div className="flex items-center gap-3 px-6 py-3 bg-blue-500/10 rounded-2xl border border-blue-500/20 text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] shadow-[0_0_20px_rgba(59,130,246,0.1)]">
           <Globe2 size={16} /> {language} Operational Protocol
        </div>
      </div>

      <header className="mb-24 space-y-8">
        <div className="flex items-center gap-6">
          <div className="h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent flex-1" />
          <Sparkle className="text-blue-500 animate-pulse shadow-[0_0_20px_rgba(59,130,246,0.5)]" size={32} fill="currentColor" />
          <div className="h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent flex-1" />
        </div>
        
        <div className="text-center">
          <h1 className="text-6xl md:text-7xl font-black text-white mb-8 tracking-tighter leading-[0.9] max-w-4xl mx-auto selection:bg-blue-600">
            {t("road_directive")}
          </h1>
          <div className="flex flex-col items-center gap-6">
            <h2 className="text-2xl font-black bg-white/5 px-8 py-3 rounded-2xl border border-white/10 text-blue-400 shadow-[0_20px_50px_rgba(0,0,0,0.3)] tracking-tight">{title}</h2>
            <div className="flex items-center gap-3 text-gray-500 font-bold tracking-widest uppercase text-xs">
               <MapPin size={18} className="text-blue-500" /> 
               {area}
            </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-16">
        {/* Progress Sidebar */}
        <div className="hidden lg:block space-y-6 sticky top-36 h-fit">
          <div className="glass-card p-8 bg-gradient-to-b from-blue-600/15 via-blue-600/5 to-transparent border-blue-500/20 shadow-2xl">
             <h4 className="text-[11px] font-black text-blue-500 uppercase tracking-[0.3em] mb-6 border-b border-blue-500/10 pb-4">{t("road_milestones")}</h4>
             <div className="space-y-5">
               {steps.map((_, i) => (
                 <div key={i} className="flex items-center gap-4">
                   <div className={`w-2 h-2 rounded-full transition-all duration-700 ${i === 0 ? 'bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,1)] scale-125' : 'bg-gray-800'}`} />
                   <span className={`text-[12px] font-black tracking-widest transition-colors duration-500 ${i === 0 ? 'text-white' : 'text-gray-700'}`}>{t("road_phase")} 0{i+1}</span>
                 </div>
               ))}
             </div>
          </div>
          
          <div className="glass-card p-8 space-y-8 border-white/5 shadow-xl">
             <div className="flex items-center gap-4">
                <div className="p-2.5 bg-gray-900 rounded-xl border border-white/5"><Calendar className="text-gray-500" size={20} /></div>
                <div className="space-y-1">
                   <div className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em]">{t("road_timeline")}</div>
                   <div className="text-xs font-black text-gray-300 italic tracking-tight">~ 4-6 Months</div>
                </div>
             </div>
             <div className="flex items-center gap-4">
                <div className="p-2.5 bg-gray-900 rounded-xl border border-white/5"><Users className="text-gray-500" size={20} /></div>
                <div className="space-y-1">
                   <div className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em]">{t("road_team")}</div>
                   <div className="text-xs font-black text-gray-300 italic tracking-tight">2-5 Stakeholders</div>
                </div>
             </div>
          </div>
        </div>

        {/* Steps Content */}
        <div className="lg:col-span-3 space-y-32 relative">
          <div className="absolute left-[47px] top-10 bottom-10 w-px bg-gradient-to-b from-blue-500/30 via-white/5 to-blue-500/30 hidden md:block" />
          
          <AnimatePresence>
            {steps.map((step, index) => (
              <motion.div 
                key={index} 
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.8, delay: index * 0.1, ease: "easeOut" }}
                className="relative pl-0 md:pl-28 group"
              >
                {/* Number Badge */}
                <div className="hidden md:flex absolute left-0 top-0 w-24 h-24 items-center justify-center">
                  <div className="w-px h-full bg-blue-500/20 absolute top-12" />
                  <div className="w-16 h-16 bg-gray-950 border-2 border-white/10 rounded-[2rem] flex items-center justify-center text-blue-500 font-black text-2xl z-10 group-hover:border-blue-500 group-hover:text-white group-hover:bg-blue-600 transition-all duration-700 shadow-[0_20px_50px_rgba(0,0,0,0.5)] group-hover:shadow-blue-600/30 group-hover:-translate-y-1">
                    {step.step_number}
                  </div>
                </div>
                
                <div className="glass-card p-12 md:p-14 bg-gradient-to-br from-white/[0.03] to-transparent border-white/5 hover:bg-white/[0.05] transition-all duration-700 hover:border-blue-500/30 group-hover:shadow-[0_40px_100px_-20px_rgba(59,130,246,0.2)] relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                  
                  <div className="flex items-center gap-5 mb-8 relative z-10">
                    <div className="w-2 h-8 bg-blue-600 rounded-full shadow-[0_0_20px_#2563eb] animate-pulse" />
                    <h3 className="text-3xl font-black text-white tracking-tighter group-hover:text-blue-400 transition-colors selection:bg-blue-600">
                      {step.step_title}
                    </h3>
                  </div>
                  
                  <div className="space-y-8 relative z-10">
                     <p className="text-gray-400 leading-relaxed text-xl font-medium selection:bg-blue-500/40">
                       {step.step_description}
                     </p>
                     
                     <div className="flex flex-wrap gap-5 pt-8 border-t border-white/5">
                        <div className="flex items-center gap-3 px-5 py-2.5 bg-blue-500/10 rounded-2xl border border-blue-500/20 text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] shadow-inner">
                           <ShieldCheck size={16} /> {t("road_priority")}
                        </div>
                        <div className="flex items-center gap-3 px-5 py-2.5 bg-green-500/5 rounded-2xl border border-green-500/15 text-[10px] font-black text-green-500 uppercase tracking-[0.2em]">
                           <ChevronRight size={16} /> {t("road_action")}
                        </div>
                     </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Conclusion */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-card p-16 md:p-20 bg-gradient-to-br from-green-600/15 via-transparent to-blue-600/15 border-green-500/30 flex flex-col items-center text-center relative overflow-hidden shadow-2xl"
          >
            <div className="absolute inset-0 bg-grid-white/[0.02] pointer-events-none" />
            <div className="w-24 h-24 bg-green-500/20 rounded-[2.5rem] flex items-center justify-center mb-10 shadow-[0_0_60px_-10px_rgba(34,197,94,0.4)] border-2 border-green-500/30 animate-pulse">
              <CheckCircle2 className="w-12 h-12 text-green-400" />
            </div>
            <h3 className="text-5xl font-black text-white mb-6 tracking-tighter uppercase">{t("road_readiness")}</h3>
            <p className="text-gray-400 max-w-xl mx-auto text-xl font-bold leading-relaxed tracking-tight selection:bg-green-600/40">
              {t("road_confirmed_desc")}
            </p>
            <button 
              onClick={() => window.print()} 
              className="mt-14 h-16 px-12 bg-white text-black font-black rounded-2xl text-[11px] uppercase tracking-[0.3em] hover:bg-gray-200 transition-all shadow-[0_20px_50px_rgba(255,255,255,0.2)] flex items-center gap-4 hover:-translate-y-1 active:translate-y-0"
            >
              <Printer size={20} />
              {t("road_print")}
            </button>
          </motion.div>
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
