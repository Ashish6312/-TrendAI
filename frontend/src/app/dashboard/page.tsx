"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import ProtectedRoute from "../../components/ProtectedRoute";
import { 
  Search, Loader2, Sparkles, TrendingUp, MapPin, 
  PiggyBank, Activity, DollarSign, ArrowRight,
  Target, BarChart3, Globe2, Lightbulb, ShieldCheck, RefreshCw, Star
} from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { useNotifications } from "@/context/NotificationContext";
import { useSubscription } from "@/context/SubscriptionContext";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "next/navigation";
import PaymentSuccessModal from "../../components/PaymentSuccessModal";
import { Terminal, Cpu, Database, Fingerprint, Activity as Pulse } from "lucide-react";

function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { language, t } = useLanguage();
  const { addNotification, userLocation, refreshLocation } = useNotifications();
  const { plan, theme, planFeatures, canAccessFeature, getRemainingAnalyses, hasReachedAnalysisLimit } = useSubscription();
  const searchParams = useSearchParams();
  
  const [area, setArea] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [result, setResult] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [analysisCount, setAnalysisCount] = useState(0);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    if (searchParams.get('payment_success') === 'true') {
      setShowSuccessModal(true);
    }
    
    // Handle area or q from notifications
    const areaParam = searchParams.get('area') || searchParams.get('q');
    if (areaParam) {
      setArea(decodeURIComponent(areaParam));
    } else if (userLocation && !area) {
      // Pre-fill with detected location if no explicit search is active
      setArea(userLocation.city);
    }
  }, [searchParams, userLocation]);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  useEffect(() => {
    if (session?.user?.email) {
      fetchHistory();
    }
  }, [session]);

  const fetchHistory = async () => {
    if (!session?.user?.email) return;
    try {
      const response = await fetch(`${apiUrl}/api/history/${session.user.email}`);
      const data = await response.json();
      setHistory(data);
      setAnalysisCount(data.length);
    } catch (e) {
      console.error("Failed to fetch history", e);
    }
  };

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

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!area) return;
    
    if (hasReachedAnalysisLimit(analysisCount)) {
      alert(`You've reached your analysis limit of ${planFeatures.maxAnalyses} analyses. Please upgrade your plan to continue.`);
      router.push('/acquisition-tiers');
      return;
    }
    
    setLoading(true);
    setLoadingProgress(0);
    setResult(null);

    const progressInterval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 95) return prev;
        const increment = Math.random() * (prev < 50 ? 8 : prev < 80 ? 3 : 1);
        return Math.min(prev + increment, 95);
      });
    }, 800);

    try {
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
      setLoadingProgress(100);
      setTimeout(() => {
        setResult(data);
        clearInterval(progressInterval);
        setLoading(false);
        
        if (session?.user?.email) {
          addNotification({
            type: 'analysis',
            title: 'Market Analysis Complete',
            message: `Your analysis for ${area} is ready with ${data.recommendations?.length || 0} business opportunities`,
            priority: 'high',
            actionUrl: '/dashboard',
            metadata: {
              location: area,
              analysisId: `analysis_${Date.now()}`,
              recommendationCount: data.recommendations?.length || 0
            }
          });
        }
      }, 500);
      fetchHistory();
    } catch (error) {
      console.error("Failed to fetch recommendations", error);
      clearInterval(progressInterval);
      setLoading(false);
    }
  };

  const loadFromHistory = (item: any) => {
    setArea(item.area);
    setResult({
      area: item.area,
      analysis: item.analysis,
      recommendations: item.recommendations,
      id: item.id
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (status === "loading") {
    return (
      <ProtectedRoute>
        <div className="flex h-screen items-center justify-center bg-white dark:bg-[#020617] relative overflow-hidden transition-colors duration-500">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.05),transparent_70%)]" />
          <div className="relative">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="w-32 h-32 border-4 border-emerald-500/10 border-t-emerald-500 rounded-full shadow-[0_0_50px_rgba(16,185,129,0.2)]" 
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Target className="text-emerald-500" size={40} />
              </motion.div>
            </div>
          </div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-12 text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500/40 italic"
          >
            Loading Dashboard...
          </motion.div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="bg-slate-50 dark:bg-[#020617] min-h-screen text-slate-900 dark:text-white transition-colors duration-500">
        <div className="responsive-container py-6 sm:py-8 md:py-12">
          
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            
            {/* Left Panel: SEARCH AREA */}
            <div className="w-full lg:w-1/3 xl:w-1/4 space-y-6">
              
              {/* SELECT YOUR LOCATION */}
              <div className="glass-card p-8 bg-white dark:bg-[#0a0f25] border-slate-200 dark:border-white/5 shadow-2xl">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                    <Target className="text-emerald-500" size={20} />
                  </div>
                  <div>
                    <h2 className="text-sm font-black uppercase tracking-[0.2em] text-slate-900 dark:text-white">Region Search</h2>
                    <div className="h-0.5 w-12 bg-emerald-500 mt-1 opacity-50" />
                  </div>
                </div>
                
                <form onSubmit={handleAnalyze} className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest pl-1">CITY OR REGION</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                      <input
                        type="text"
                        value={area}
                        onChange={(e) => {
                          setArea(e.target.value);
                          setShowSuggestions(true);
                        }}
                        onFocus={() => setShowSuggestions(true)}
                        className="w-full bg-slate-50 dark:bg-[#050818] border border-slate-200 dark:border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-700 transition-all focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5 italic"
                        placeholder="Type city or region name..."
                        required
                        autoComplete="off"
                      />
                      
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <button 
                          type="button"
                          onClick={() => {
                            refreshLocation();
                            addNotification({
                              type: 'location',
                              title: 'Finding Location',
                              message: 'Getting your current location... Please wait.',
                              priority: 'low'
                            } as any);
                          }}
                          className="p-2 rounded-lg hover:bg-emerald-500/10 text-gray-700 hover:text-emerald-500 transition-all"
                        >
                          <Pulse size={16} className={`${!userLocation ? "animate-spin" : ""} transition-transform`} />
                        </button>
                      </div>

                      <AnimatePresence>
                        {showSuggestions && suggestions.length > 0 && (
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute z-50 w-full mt-3 glass-card bg-[#0a0f25] border border-emerald-500/20 shadow-3xl max-h-72 overflow-y-auto p-2"
                          >
                            {suggestions.map((s, i) => (
                              <button
                                key={i}
                                type="button"
                                onMouseDown={(e) => {
                                  e.preventDefault();
                                  handleSelectSuggestion(s);
                                }}
                                className="w-full text-left p-3 rounded-xl hover:bg-emerald-500/10 text-[10px] font-bold text-slate-500 hover:text-white transition-all text-xs"
                              >
                                {s.display_name}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={loading || !area || hasReachedAnalysisLimit(analysisCount)}
                    className="w-full py-5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-emerald-500/30 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-white transition-all shadow-xl disabled:opacity-30 disabled:grayscale"
                  >
                    {loading ? <Loader2 className="animate-spin mx-auto" size={16} /> : hasReachedAnalysisLimit(analysisCount) ? "LIMIT REACHED" : "SEARCH NOW"}
                  </button>

                  {hasReachedAnalysisLimit(analysisCount) && (
                    <div className="text-center">
                      <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest italic mb-2">Limit reached for your plan</p>
                      <Link href="/acquisition-tiers" className="text-[10px] font-black text-blue-400 underline decoration-2 underline-offset-4">UPGRADE NOW →</Link>
                    </div>
                  )}
                </form>
              </div>

              {/* RECENT SEARCHES */}
              <div className="glass-card p-8 bg-[#0a0f25] border-white/5">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                    <Pulse className="text-blue-500" size={20} />
                  </div>
                  <h2 className="text-sm font-black uppercase tracking-[0.2em] text-white">Recent Searches</h2>
                </div>
                
                <div className="space-y-4">
                  {history.length > 0 ? (
                    history.slice(0, 5).map((item, i) => (
                      <button 
                        key={i}
                        type="button"
                        onClick={() => loadFromHistory(item)}
                        className="w-full p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-blue-500/30 text-left group transition-all"
                      >
                        <div className="text-[10px] font-black text-slate-400 group-hover:text-white truncate uppercase tracking-tighter">{item.area}</div>
                        <div className="text-[8px] font-bold text-slate-600 mt-1 uppercase tracking-widest">{new Date(item.created_at).toLocaleDateString()}</div>
                      </button>
                    ))
                  ) : (
                    <div className="py-12 text-center">
                      <div className="text-[9px] font-black text-slate-800 uppercase tracking-widest italic">NO SEARCH HISTORY</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Smart Features */}
              <div className="glass-card p-8 bg-[#0a0f25] border-white/5 space-y-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                    <Lightbulb className="text-purple-500" size={20} />
                  </div>
                  <h2 className="text-sm font-black uppercase tracking-[0.2em] text-white">Smart Features</h2>
                </div>
                
                <p className="text-[9px] font-bold text-slate-500 leading-relaxed uppercase tracking-widest italic">
                  We check local search trends and competition to find the best business for you.
                </p>
                
                <div className="space-y-3">
                  <div className="p-3 bg-slate-100 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 rounded-xl flex items-center gap-3 group">
                    <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform"><Globe2 size={12} /></div>
                    <span className="text-[8px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">LIVE DATA SEARCH</span>
                  </div>
                  <div className="p-3 bg-slate-100 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 rounded-xl flex items-center gap-3 group">
                    <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform"><TrendingUp size={12} /></div>
                    <span className="text-[8px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">PROFIT PREDICTIONS</span>
                  </div>
                </div>
              </div>
            </div>            {/* Right Panel: ANALYSIS RESULTS */}
            <div className="flex-1 space-y-8">
              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.div 
                    key="loading-terminal"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.02 }}
                    className="glass-card bg-white dark:bg-[#050818] border-slate-200 dark:border-emerald-500/10 min-h-[600px] flex flex-col items-center justify-center text-center p-12 shadow-2xl dark:shadow-[0_0_100px_-20px_rgba(16,185,129,0.1)]"
                  >
                    <div className="w-32 h-32 relative mb-12">
                       <div className="absolute inset-0 rounded-full border-2 border-emerald-500/10 animate-ping" />
                       <div className="absolute inset-2 rounded-full border border-emerald-500/20 animate-pulse" />
                       <div className="absolute inset-0 flex items-center justify-center">
                          <Loader2 className="text-emerald-500 animate-spin" size={48} />
                       </div>
                    </div>
                    <h2 className="text-4xl font-black text-slate-900 dark:text-white italic tracking-tighter mb-4 animate-pulse uppercase">Searching Market</h2>
                    <p className="text-slate-500 dark:text-gray-500 text-[10px] font-black uppercase tracking-[0.4em] mb-12">FINDING BEST BUSINESS IDEAS FOR YOU...</p>
                    <div className="w-full max-w-md h-1.5 bg-white/5 rounded-full overflow-hidden">
                       <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${loadingProgress}%` }}
                          className="h-full bg-emerald-500 shadow-[0_0_20px_#10b981]"
                       />
                    </div>
                  </motion.div>
                ) : result ? (
                   <motion.div 
                      key="results-terminal"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-8"
                   >
                      {/* Header: Area Summary */}
                      <div className="glass-card p-10 bg-white dark:bg-[#0a0f25] border-slate-200 dark:border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-8 shadow-2xl">
                         <div className="space-y-3">
                            <div className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em] mb-2">Search Complete</div>
                            <h2 className="text-5xl font-black text-white tracking-tighter italic leading-none">{area}</h2>
                         </div>
                         <div className="flex gap-4">
                            <button type="button" onClick={() => window.print()} className="h-14 px-8 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">Save Report</button>
                            <Link href={`/roadmap?area=${encodeURIComponent(area)}&title=${encodeURIComponent(result.recommendations?.[0]?.title || result.analysis?.potential_business_model || "New Business")}&desc=${encodeURIComponent(result.analysis?.executive_summary || "Market Opportunity")}&lang=${language}`} className="h-14 px-8 bg-emerald-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all flex items-center shadow-lg shadow-emerald-600/20">Create 6-Month Plan</Link>
                         </div>
                      </div>

                      {/* ANALYSIS CONTENT */}
                      <div className="grid md:grid-cols-2 gap-8">
                         <div className="glass-card p-10 bg-[#0a0f25] border-white/5">
                            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-8 border-b border-white/5 pb-4">Smart Summary</h4>
                            <p className="text-base font-medium text-slate-300 leading-relaxed italic">"{result.analysis?.executive_summary || result.analysis?.market_overview}"</p>
                         </div>
                         <div className="glass-card p-10 bg-[#0a0f25] border-white/5 grid grid-cols-2 gap-8">
                            <div>
                               <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-2">Profit Chance</div>
                               <div className="text-3xl font-black text-emerald-500 tracking-tighter">{result.analysis?.confidence_score || "85%"}</div>
                            </div>
                            <div>
                               <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-2">Business Gap</div>
                               <div className="text-3xl font-black text-blue-500 tracking-tighter">{result.analysis?.market_gap_intensity || "High"}</div>
                            </div>
                         </div>
                      </div>

                      {/* Business Ideas */}
                      <div className="space-y-6">
                         <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.5em] mb-10 text-center">Business Ideas for You</h3>
                         <div className="grid gap-6">
                            {result.recommendations?.map((rec: any, idx: number) => (
                               <motion.div 
                                  key={idx}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: idx * 0.1 }}
                                  className="glass-card p-10 bg-[#0a0f25] border-white/5 hover:border-emerald-500/20 group transition-all"
                               >
                                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                                     <div className="space-y-3">
                                        <h4 className="text-3xl font-black text-white tracking-tighter italic group-hover:text-emerald-400 transition-colors uppercase">{rec.title}</h4>
                                        <p className="text-sm font-medium text-slate-400 leading-relaxed max-w-2xl">{rec.description}</p>
                                     </div>
                                     <div className="flex flex-col gap-2 min-w-[150px]">
                                        <div className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Profit Potential</div>
                                        <div className="text-xl font-black text-emerald-500 italic">High Potential</div>
                                        <div className="h-1 w-full bg-white/5 rounded-full mt-2 overflow-hidden">
                                           <div className="h-full bg-emerald-500 w-[75%]" />
                                        </div>
                                     </div>
                                  </div>
                               </motion.div>
                            ))}
                         </div>
                      </div>
                   </motion.div>
                ) : (
                  <motion.div 
                    key="idle-terminal"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="glass-card bg-[#050818] border-white/5 min-h-[600px] flex flex-col items-center justify-center text-center p-12 transition-all shadow-2xl"
                  >
                    <motion.div 
                      animate={{ 
                         scale: [1, 1.05, 1],
                         opacity: [0.3, 0.6, 0.3]
                      }}
                      transition={{ duration: 4, repeat: Infinity }}
                      className="w-48 h-48 bg-blue-600/5 rounded-[4rem] flex items-center justify-center mb-16 border border-white/5 shadow-3xl"
                    >
                      <Globe2 className="text-blue-500 opacity-80" size={64} />
                    </motion.div>
                    
                    <h1 className="text-6xl font-black text-white tracking-tighter italic mb-8 uppercase">Ready to Search</h1>
                    <p className="text-slate-600 max-w-xl text-[10px] font-black uppercase tracking-[0.3em] leading-relaxed mb-16 opacity-70">
                      TYPE YOUR CITY NAME TO FIND THE BEST BUSINESS IDEAS FOR YOUR AREA.
                    </p>
                    
                    <div className="flex flex-wrap justify-center gap-4">
                      {["BHOPAL", "LONDON", "BERLIN", "NEW YORK"].map(city => (
                        <button 
                          key={city}
                          type="button"
                          onClick={() => setArea(city)}
                          className="px-8 py-3 bg-white/5 border border-white/5 rounded-xl text-[9px] font-black text-slate-500 hover:text-white hover:border-emerald-500/30 hover:bg-white/10 transition-all uppercase tracking-widest shadow-inner active:scale-95"
                        >
                          {city}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
      <PaymentSuccessModal isOpen={showSuccessModal} onClose={() => setShowSuccessModal(false)} />
    </ProtectedRoute>
  );
}

export default Dashboard;