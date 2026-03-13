"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { 
  Search, Loader2, Sparkles, TrendingUp, MapPin, 
  PiggyBank, Activity, DollarSign, ArrowRight,
  Target, BarChart3, Globe2, Lightbulb
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { language, t } = useLanguage();
  
  const [area, setArea] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (area && showSuggestions && area.length > 2) {
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(area)}&limit=5`);
          const data = await res.json();
          setSuggestions(data);
        } catch (e) {
          console.error("Error fetching locations", e);
        }
      } else {
        setSuggestions([]);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [area, showSuggestions]);

  const handleSelectSuggestion = (suggestion: any) => {
    setArea(suggestion.display_name);
    setShowSuggestions(false);
  };

  useEffect(() => {
    if (result && area && !loading) {
      const e = { preventDefault: () => {} } as React.FormEvent;
      handleAnalyze(e);
    }
  }, [language]);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!area) return;
    
    setLoading(true);
    setResult(null);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/api/recommendations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          area, 
          user_email: session?.user?.email,
          language: language 
        }),
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Failed to fetch recommendations", error);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Target className="text-blue-500 animate-pulse" size={24} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-col lg:flex-row gap-12">
        
        {/* Left Panel: Search & Filters */}
        <div className="w-full lg:w-1/3 xl:w-1/4 space-y-8">
          <div className="glass-card p-8 bg-gradient-to-br from-blue-600/10 via-transparent to-indigo-600/10">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Target className="text-blue-500" size={20} />
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight">{t("dash_market_scope")}</h2>
            </div>
            
            <form onSubmit={handleAnalyze} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] pl-1">{t("dash_target_loc")}</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <MapPin className="text-gray-600 group-focus-within:text-blue-500 transition-colors" size={18} />
                  </div>
                  <input
                    type="text"
                    value={area}
                    onChange={(e) => {
                      setArea(e.target.value);
                      setShowSuggestions(true);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    className="bg-white/[0.03] border border-white/10 text-white text-sm font-bold rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 block w-full pl-11 pr-4 py-4.5 placeholder-gray-700 transition-all font-outfit"
                    placeholder={t("dash_enter_city")}
                    required
                    autoComplete="off"
                  />
                  
                  <AnimatePresence>
                    {showSuggestions && suggestions.length > 0 && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute z-50 w-full mt-2 glass-card bg-gray-950/95 p-2 border-white/10 shadow-2xl max-h-72 overflow-y-auto"
                      >
                        {suggestions.map((suggestion, idx) => (
                          <div
                            key={idx}
                            onMouseDown={(e) => {
                              e.preventDefault();
                              handleSelectSuggestion(suggestion);
                            }}
                            className="px-4 py-3 cursor-pointer hover:bg-white/5 rounded-xl text-xs text-gray-300 transition-all flex items-start gap-3 border border-transparent hover:border-white/5 mb-1 last:mb-0"
                          >
                            <MapPin size={14} className="mt-0.5 text-blue-500 shrink-0" />
                            <span className="leading-tight">{suggestion.display_name}</span>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
              
              <button
                type="submit"
                disabled={loading || !area}
                className="w-full h-15 premium-gradient text-white font-black uppercase tracking-[0.2em] rounded-2xl text-[11px] px-5 flex justify-center items-center gap-2 transition-all shadow-xl shadow-blue-600/20 hover:shadow-blue-600/40 hover:-translate-y-1 active:translate-y-0 disabled:opacity-30 disabled:cursor-not-allowed disabled:grayscale"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} fill="currentColor" />}
                {loading ? t("dash_analyzing") : t("dash_analyze")}
              </button>
            </form>
          </div>
          
          <div className="glass-card p-8 border-indigo-500/10 relative overflow-hidden group bg-gradient-to-br from-indigo-600/5 via-transparent to-transparent">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-indigo-500/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
            <div className="flex items-center gap-3 mb-5 relative z-10">
              <Lightbulb className="text-indigo-400" size={20} />
              <h3 className="text-lg font-bold text-white tracking-tight">{t("dash_ai_insights")}</h3>
            </div>
            <p className="text-[13px] text-gray-500 leading-relaxed mb-8 relative z-10 font-medium">{t("dash_ai_desc")}</p>
            <div className="flex flex-col gap-3 relative z-10">
               <div className="flex items-center gap-3 text-[10px] font-black text-gray-500 uppercase tracking-widest bg-white/5 p-3 rounded-xl border border-white/5 group-hover:border-blue-500/20 transition-all">
                  <Globe2 size={14} className="text-blue-500" />
                  {t("dash_vector_global")}
               </div>
               <div className="flex items-center gap-3 text-[10px] font-black text-gray-500 uppercase tracking-widest bg-white/5 p-3 rounded-xl border border-white/5 group-hover:border-indigo-500/20 transition-all">
                  <BarChart3 size={14} className="text-indigo-500" />
                  {t("dash_vector_predict")}
               </div>
            </div>
          </div>
        </div>

        {/* Right Panel: Results */}
        <div className="w-full lg:w-2/3 xl:w-3/4">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="glass-card p-24 flex flex-col items-center justify-center min-h-[550px] text-center bg-gradient-to-b from-blue-600/10 to-transparent border-blue-500/20 shadow-[0_40px_100px_-20px_rgba(59,130,246,0.2)]"
              >
                <div className="relative mb-10">
                  <div className="w-32 h-32 border-2 border-dashed border-blue-500/30 rounded-full animate-[spin_15s_linear_infinite]" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 border-b-2 border-blue-500 rounded-full animate-spin" />
                  </div>
                  <div className="absolute -inset-4 bg-blue-500/5 blur-2xl rounded-full animate-pulse" />
                </div>
                <h2 className="text-3xl font-black text-white mb-3 tracking-tighter uppercase">{t("dash_analyzing")}</h2>
                <p className="text-gray-500 max-w-sm mx-auto font-bold tracking-widest text-[10px] uppercase opacity-70">Cross-Referencing Territorial Coordinates...</p>
                <div className="flex gap-6 mt-12">
                  <div className="flex items-center gap-3 px-6 py-2.5 bg-blue-500/10 rounded-2xl text-[10px] font-black text-blue-400 animate-pulse border border-blue-500/20 tracking-widest uppercase">
                    <Search size={14} /> NEURAL SCAN
                  </div>
                  <div className="flex items-center gap-3 px-6 py-2.5 bg-indigo-500/10 rounded-2xl text-[10px] font-black text-indigo-400 animate-pulse delay-75 border border-indigo-500/20 tracking-widest uppercase">
                    <BarChart3 size={14} /> ECONOMIC SYTHESIS
                  </div>
                </div>
              </motion.div>
            ) : result ? (
              <motion.div 
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-12"
              >
                <div className="glass-card p-12 bg-gradient-to-br from-blue-600/15 via-transparent to-indigo-600/10 border-blue-500/20 relative overflow-hidden shadow-2xl">
                  <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px] -mr-64 -mt-64 animate-pulse" />
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 relative z-10">
                    <div>
                      <div className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em] mb-3">{t("dash_results_header")} {language}</div>
                      <h2 className="text-5xl font-black text-white tracking-tighter capitalize selection:bg-blue-600">
                        {result.area.split(',')[0]}
                      </h2>
                    </div>
                    <div className="flex items-center gap-3 px-5 py-2.5 bg-white/5 rounded-2xl border border-white/10 text-[10px] font-black text-gray-400 tracking-widest uppercase">
                      <Globe2 size={16} className="text-blue-500" /> {language} Protocol
                    </div>
                  </div>
                  <p className="text-gray-400 leading-relaxed text-xl font-medium selection:bg-blue-500/40 relative z-10">
                    {result.analysis}
                  </p>
                </div>
                
                <div className="flex items-center gap-6 px-4">
                  <h3 className="text-2xl font-black text-white tracking-tighter whitespace-nowrap">
                    {t("dash_strategic_opps")}
                  </h3>
                  <div className="h-px w-full bg-gradient-to-r from-white/10 to-transparent" />
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                  {result.recommendations.map((rec: any, index: number) => (
                    <motion.div 
                      key={index} 
                      whileHover={{ y: -10 }}
                      onClick={() => router.push(`/roadmap?area=${encodeURIComponent(result.area)}&title=${encodeURIComponent(rec.title)}&desc=${encodeURIComponent(rec.description)}&lang=${language}`)}
                      className="glass-card p-9 cursor-pointer border-white/5 hover:border-blue-500/40 hover:bg-white/[0.04] transition-all duration-500 group relative flex flex-col h-full bg-gradient-to-b from-white/[0.02] to-transparent card-hover shadow-xl overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/0 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                      
                      <div className="flex justify-between items-start mb-8 relative z-10">
                        <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-2xl group-hover:bg-blue-600/20 border border-blue-500/10">
                          <span className="text-blue-500 font-black text-2xl group-hover:text-white transition-colors">{index + 1}</span>
                        </div>
                        <div className="flex flex-col items-end gap-1.5">
                           <div className="flex items-center gap-2 bg-green-500/10 text-green-400 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-green-500/20 shadow-[0_0_20px_rgba(34,197,94,0.15)]">
                             <TrendingUp size={14} /> {rec.profitability_score}% {t("dash_match_score")}
                           </div>
                        </div>
                      </div>
                      
                      <h4 className="text-2xl font-black text-white mb-5 leading-tight group-hover:text-blue-400 transition-colors tracking-tight relative z-10">
                        {rec.title}
                      </h4>
                      <p className="text-gray-500 text-[15px] leading-relaxed mb-10 flex-grow font-medium relative z-10">
                        {rec.description}
                      </p>
                      
                      {(rec.funding_required || rec.survival_rate || rec.estimated_profit) && (
                        <div className="space-y-4 mb-10 bg-black/40 p-6 rounded-[2rem] border border-white/5 relative z-10 group-hover:border-blue-500/10 transition-colors shadow-inner">
                          <div className="flex items-center justify-between text-xs">
                             <span className="text-gray-600 font-black uppercase tracking-[0.2em] flex items-center gap-3"><PiggyBank size={16} className="text-blue-500" /> {t("dash_capital")}</span>
                             <span className="text-gray-200 font-black tracking-tight">{rec.funding_required}</span>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                             <span className="text-gray-600 font-black uppercase tracking-[0.2em] flex items-center gap-3"><Activity size={16} className="text-indigo-500" /> {t("dash_prob")}</span>
                             <span className="text-gray-200 font-black tracking-tight">{rec.survival_rate}</span>
                          </div>
                          <div className="flex items-center justify-between text-xs pt-1">
                             <span className="text-gray-600 font-black uppercase tracking-[0.2em] flex items-center gap-3"><DollarSign size={16} className="text-green-500" /> {t("dash_revenue")}</span>
                             <span className="text-green-500 font-black tracking-tight text-sm shadow-[0_0_15px_rgba(34,197,94,0.2)]">{rec.estimated_profit}</span>
                          </div>
                        </div>
                      )}

                      <div className="pt-8 border-t border-white/5 flex justify-between items-center group/btn mt-auto relative z-10">
                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] group-hover:text-white transition-colors">{t("dash_view_plan")}</span>
                        <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white text-blue-500 transition-all duration-500 shadow-xl group-hover:shadow-blue-600/40">
                          <ArrowRight size={18} />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {result.logs && (result.logs.reddit?.length > 0 || result.logs.web?.length > 0) && (
                  <div className="mt-20 glass-card p-12 bg-black/50 border-white/5 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-grid-white/[0.01] pointer-events-none" />
                    <h3 className="text-2xl font-black text-white mb-10 flex items-center gap-4 relative z-10">
                      <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-gray-500 group-hover:text-blue-500 transition-colors border border-white/10">
                        <BarChart3 size={20} />
                      </div>
                      {t("dash_neural_input")}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
                      {result.logs.web?.length > 0 && (
                        <div className="space-y-6">
                          <h4 className="text-blue-500 text-[11px] font-black uppercase tracking-[0.3em] flex items-center gap-3">
                             <div className="w-1.5 h-1.5 bg-blue-500 rounded-full shadow-[0_0_15px_#3b82f6] animate-pulse" /> {t("dash_source_web")}
                          </h4>
                          <div className="space-y-4">
                            {result.logs.web.map((log: string, idx: number) => (
                              <div key={idx} className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 text-[11px] text-gray-500 leading-relaxed font-bold tracking-tight hover:text-gray-300 transition-colors cursor-default hover:bg-white/[0.04]">
                                {log}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {result.logs.reddit?.length > 0 && (
                        <div className="space-y-6">
                          <h4 className="text-orange-500 text-[11px] font-black uppercase tracking-[0.3em] flex items-center gap-3">
                             <div className="w-1.5 h-1.5 bg-orange-500 rounded-full shadow-[0_0_15px_#f97316] animate-pulse" /> {t("dash_source_reddit")}
                          </h4>
                          <div className="space-y-4">
                            {result.logs.reddit.map((log: string, idx: number) => (
                              <div key={`reddit-${idx}`} className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 text-[11px] text-gray-500 leading-relaxed font-bold tracking-tight hover:text-gray-300 transition-colors cursor-default hover:bg-white/[0.04]">
                                {log}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass-card p-24 flex flex-col items-center justify-center min-h-[550px] text-center bg-gradient-to-tr from-blue-600/5 via-transparent to-indigo-600/5 border-white/5 shadow-inner"
              >
                <div className="w-32 h-32 bg-white/5 rounded-[2.5rem] flex items-center justify-center mb-12 transform -rotate-12 border border-white/10 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.4)] group transition-all hover:rotate-0 hover:scale-110 duration-700">
                  <Globe2 className="text-blue-500/30 group-hover:text-blue-500 transition-colors" size={56} />
                </div>
                <h2 className="text-4xl font-black text-white mb-5 tracking-tighter uppercase">{t("dash_empty_title")}</h2>
                <p className="text-gray-500 max-w-sm mx-auto mb-12 leading-relaxed font-bold tracking-tight uppercase text-xs opacity-60">{t("dash_empty_desc")}</p>
                <div className="flex flex-wrap gap-3 justify-center max-w-lg">
                   {['Bhopal', 'London', 'Berlin', 'New York'].map(city => (
                      <button key={city} onClick={() => setArea(city)} className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black text-gray-600 hover:text-white hover:border-blue-500/50 hover:bg-blue-500/10 transition-all uppercase tracking-[0.2em]">{city}</button>
                   ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
      </div>
    </div>
  );
}
