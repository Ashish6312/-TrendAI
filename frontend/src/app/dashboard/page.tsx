"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import ProtectedRoute from "../../components/ProtectedRoute";
import { 
  Search, Loader2, Sparkles, TrendingUp, MapPin, 
  PiggyBank, Activity, DollarSign, ArrowRight,
  Target, BarChart3, Globe2, Lightbulb, ShieldCheck, RefreshCw
} from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { useNotifications } from "@/context/NotificationContext";
import { useSubscription } from "@/context/SubscriptionContext";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "next/navigation";
import PaymentSuccessModal from "../../components/PaymentSuccessModal";

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
        <div className="flex h-screen items-center justify-center bg-[var(--background)] relative overflow-hidden">
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
      <div className="responsive-container py-6 sm:py-8 md:py-12">
        <div className="flex flex-col lg:flex-row gap-6 md:gap-8 lg:gap-12">
          
          {/* Left Panel: Search & Filters */}
          <div className="w-full lg:w-1/3 xl:w-1/4 space-y-6 md:space-y-8">
            <div className="glass-card responsive-p-md md:responsive-p-lg bg-gradient-to-br from-emerald-600/10 via-transparent to-amber-600/10" style={{ borderColor: `${theme.primary}20` }}>
              <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
                <div className="p-1.5 md:p-2 rounded-lg" style={{ backgroundColor: `${theme.primary}20` }}>
                  <Target style={{ color: theme.primary }} size={16} className="md:w-5 md:h-5" />
                </div>
                <h2 className="responsive-text-lg md:responsive-text-xl font-bold text-white tracking-tight">{t("dash_market_scope")}</h2>
              </div>
              
              <form onSubmit={handleAnalyze} className="space-y-4 md:space-y-6">
                <div className="space-y-2">
                  <label className="text-[9px] md:text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] pl-1">{t("dash_target_loc")}</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 md:pl-4 flex items-center pointer-events-none">
                      <motion.div
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <MapPin className="text-emerald-500 md:w-[18px] md:h-[18px]" size={16} />
                      </motion.div>
                    </div>
                    <input
                      type="text"
                      value={area}
                      onChange={(e) => {
                        setArea(e.target.value);
                        setShowSuggestions(true);
                      }}
                      onFocus={() => setShowSuggestions(true)}
                      className="bg-white/[0.03] border border-white/10 text-white responsive-text-sm font-black rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/50 block w-full pl-10 md:pl-11 pr-12 py-4 md:py-5 placeholder-gray-800 transition-all italic tracking-tight"
                      placeholder={t("dash_enter_city")}
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
                            title: 'Syncing Location',
                            message: 'Detecting your real-time coordinates... Market data will update shortly.',
                            priority: 'low'
                          } as any);
                        }}
                        className="p-2 rounded-lg hover:bg-emerald-500/10 text-gray-700 hover:text-emerald-500 transition-all group/detect"
                        title="Auto-detect Location"
                      >
                        <RefreshCw size={16} className={`${!userLocation ? "animate-spin" : "group-hover/detect:rotate-180"} transition-transform duration-700`} />
                      </button>
                    </div>
                    
                    <AnimatePresence>
                      {showSuggestions && suggestions.length > 0 && (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.95, y: 10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: 10 }}
                          className="absolute z-50 w-full mt-3 glass-card bg-slate-900/95 p-3 border-emerald-500/20 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] max-h-72 overflow-y-auto"
                        >
                          <div className="px-3 pb-2 text-[8px] font-black uppercase tracking-widest text-slate-500 italic border-b border-white/5 mb-2 flex items-center gap-2">
                             <Search size={10} /> Radar Detections
                          </div>
                          {suggestions.map((suggestion, idx) => (
                            <div
                              key={idx}
                              onMouseDown={(e) => {
                                e.preventDefault();
                                handleSelectSuggestion(suggestion);
                              }}
                              className="px-4 py-3.5 cursor-pointer hover:bg-emerald-500/10 rounded-xl text-[10px] font-bold text-gray-400 hover:text-white transition-all flex items-start gap-4 border border-transparent hover:border-emerald-500/10 mb-1 last:mb-0 group/item"
                            >
                              <div className="p-1.5 rounded-lg bg-white/5 group-hover/item:bg-emerald-500/20 transition-colors">
                                <MapPin size={12} className="text-gray-600 group-hover/item:text-emerald-500" />
                              </div>
                              <span className="leading-snug">{suggestion.display_name}</span>
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
                
                <button
                  type="submit"
                  disabled={loading || !area || hasReachedAnalysisLimit(analysisCount)}
                  className="w-full h-12 md:h-15 text-white font-black uppercase tracking-[0.2em] rounded-xl md:rounded-2xl responsive-text-xs px-4 md:px-5 flex justify-center items-center gap-2 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 active:translate-y-0 disabled:opacity-30 disabled:cursor-not-allowed disabled:grayscale"
                  style={{ 
                    background: hasReachedAnalysisLimit(analysisCount) 
                      ? '#6b7280' 
                      : `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`,
                    boxShadow: `0 10px 30px -5px ${theme.primary}40, 0 0 0 1px ${theme.primary}20`
                  }}
                >
                  {loading ? <Loader2 className="animate-spin md:w-5 md:h-5" size={18} /> : <Sparkles className="md:w-5 md:h-5" size={18} fill="currentColor" />}
                  {hasReachedAnalysisLimit(analysisCount) 
                    ? "UPGRADE TO CONTINUE" 
                    : loading 
                      ? t("dash_analyzing") 
                      : t("dash_analyze")
                  }
                </button>
                
                {hasReachedAnalysisLimit(analysisCount) && (
                  <div className="text-center mt-3">
                    <p className="text-xs text-red-400 mb-2">
                      You've used all {planFeatures.maxAnalyses} analyses in your {planFeatures.planName} plan
                    </p>
                    <Link 
                      href="/acquisition-tiers"
                      className="text-xs font-bold text-blue-400 hover:text-blue-300 underline"
                    >
                      Upgrade for unlimited analyses →
                    </Link>
                  </div>
                )}
              </form>
            </div>
            {/* Institutional Protocol Matrix - High Engagement Utility */}
            <div className="glass-card p-6 border-white/5 bg-gradient-to-br from-slate-900/50 to-transparent relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="flex items-center gap-3 mb-6 relative z-10">
                <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20">
                  <ShieldCheck className="text-blue-400" size={18} />
                </div>
                <div>
                  <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] italic">Active Protocol Matrix</h3>
                  <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">{planFeatures.planName} Tier</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2 relative z-10">
                {[
                  { key: 'advancedFeatures', label: 'AI Profit Engine', icon: BarChart3 },
                  { key: 'prioritySupport', label: 'Priority Support', icon: Target },
                  { key: 'exportToPdf', label: 'PDF Reports', icon: RefreshCw },
                  { key: 'apiAccess', label: 'Full API Access', icon: Globe2 },
                  { key: 'realTimeAlerts', label: 'Market Alerts', icon: Activity }
                ].map((feature, idx) => (
                  <div 
                    key={idx}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all duration-500 ${
                      planFeatures[feature.key as keyof typeof planFeatures] 
                        ? 'bg-blue-500/10 border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]' 
                        : 'bg-white/5 border-white/5 opacity-30 grayscale'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <feature.icon size={14} className={planFeatures[feature.key as keyof typeof planFeatures] ? 'text-blue-400' : 'text-slate-600'} />
                      <span className={`text-[9px] font-bold uppercase tracking-wider ${planFeatures[feature.key as keyof typeof planFeatures] ? 'text-white' : 'text-slate-600'}`}>
                        {feature.label}
                      </span>
                    </div>
                    {planFeatures[feature.key as keyof typeof planFeatures] && (
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse shadow-[0_0_10px_#60a5fa]" />
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-white/5 relative z-10">
                <Link 
                  href="/acquisition-tiers"
                  className="flex items-center justify-between group/link pointer-events-auto"
                >
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover/link:text-white transition-colors">Expand Capabilities</span>
                  <ArrowRight size={14} className="text-slate-600 group-hover/link:translate-x-1 group-hover/link:text-blue-400 transition-all" />
                </Link>
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
                  className="glass-card responsive-p-lg md:responsive-p-xl flex flex-col items-center justify-center min-h-[400px] md:min-h-[550px] text-center bg-gradient-to-b from-blue-600/10 to-transparent border-blue-500/20 shadow-[0_40px_100px_-20px_rgba(59,130,246,0.2)]"
                >
                  <div className="relative mb-8 md:mb-12">
                    <div className="w-32 h-32 md:w-48 md:h-48 border-2 border-dashed border-blue-500/20 rounded-full animate-[spin_20s_linear_infinite]" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg className="w-28 h-28 md:w-40 md:h-40 transform -rotate-90">
                        <circle cx="56" cy="56" r="50" stroke="currentColor" strokeWidth="3" fill="transparent" className="text-white/5 md:hidden" />
                        <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-white/5 hidden md:block" />
                        <motion.circle
                          cx="56" cy="56" r="50" stroke="currentColor" strokeWidth="3" fill="transparent"
                          strokeDasharray={314}
                          animate={{ strokeDashoffset: 314 - (314 * loadingProgress) / 100 }}
                          className="text-emerald-500 drop-shadow-[0_0_10px_#10b981] md:hidden"
                        />
                        <motion.circle
                          cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="4" fill="transparent"
                          strokeDasharray={440}
                          animate={{ strokeDashoffset: 440 - (440 * loadingProgress) / 100 }}
                          className="text-emerald-500 drop-shadow-[0_0_10px_#10b981] hidden md:block"
                        />
                      </svg>
                    </div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <motion.span 
                        key={Math.floor(loadingProgress)}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="responsive-text-3xl md:responsive-text-5xl font-black text-white tracking-tighter"
                      >
                        {Math.floor(loadingProgress)}%
                      </motion.span>
                      <span className="text-[9px] md:text-[10px] font-black text-emerald-500/50 uppercase tracking-[0.3em] mt-1">{t("dash_analyzing")}</span>
                    </div>
                  </div>

                  <div className="w-full max-w-md space-y-3 md:space-y-4">
                    <div className="h-1 md:h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                      <motion.div 
                        className="h-full growth-gradient"
                        initial={{ width: 0 }}
                        animate={{ width: `${loadingProgress}%` }}
                      />
                    </div>
                    <p className="text-gray-500 font-bold tracking-[0.4em] responsive-text-xs uppercase opacity-70">Analyzing Market Data...</p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 md:gap-6 mt-12 md:mt-16">
                    <div className="flex items-center gap-2 md:gap-3 px-4 md:px-6 py-2 md:py-2.5 bg-blue-500/10 rounded-xl md:rounded-2xl responsive-text-xs font-black text-blue-400 animate-pulse border border-blue-500/20 tracking-widest uppercase">
                      <Search className="md:w-[14px] md:h-[14px]" size={12} /> MARKET SCAN
                    </div>
                    <div className="flex items-center gap-2 md:gap-3 px-4 md:px-6 py-2 md:py-2.5 bg-indigo-500/10 rounded-xl md:rounded-2xl responsive-text-xs font-black text-indigo-400 animate-pulse delay-75 border border-indigo-500/20 tracking-widest uppercase">
                      <BarChart3 className="md:w-[14px] md:h-[14px]" size={12} /> DATA ANALYSIS
                    </div>
                  </div>
                </motion.div>
              ) : result ? (
                <motion.div 
                  key="results"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-8 md:space-y-12"
                >
                  <div className="glass-card responsive-p-lg md:responsive-p-xl bg-gradient-to-br from-emerald-600/15 via-transparent to-amber-600/10 border-emerald-500/20 relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-emerald-500/5 rounded-full blur-[100px] -mr-32 md:-mr-64 -mt-32 md:-mt-64 animate-pulse" />
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6 mb-6 md:mb-10 relative z-10">
                      <div>
                        <div className="responsive-text-xs font-black text-emerald-500 uppercase tracking-[0.4em] mb-2 md:mb-3">{t("dash_results_header")} {language}</div>
                        <h2 className="responsive-text-3xl md:responsive-text-5xl font-black text-white tracking-tighter capitalize selection:bg-emerald-600">
                          {result.area.split(',')[0]}
                        </h2>
                      </div>
                      <div className="flex items-center gap-2 md:gap-3 px-3 md:px-5 py-2 md:py-2.5 bg-white/5 rounded-xl md:rounded-2xl border border-white/10 responsive-text-xs font-black text-gray-400 tracking-widest uppercase">
                      <Globe2 className="md:w-4 md:h-4 text-emerald-500" size={14} /> {language} Protocol
                      </div>
                    </div>
                    <p className="text-gray-400 leading-relaxed responsive-text-lg md:responsive-text-xl font-medium selection:bg-blue-500/40 relative z-10">
                      {result.analysis}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-4 md:gap-6 px-2 md:px-4">
                    <h3 className="responsive-text-xl md:responsive-text-2xl font-black text-white tracking-tighter whitespace-nowrap">
                      {t("dash_strategic_opps")}
                    </h3>
                    <div className="h-px w-full bg-gradient-to-r from-white/10 to-transparent" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
                    {result.recommendations.map((rec: any, index: number) => (
                      <motion.div 
                        key={index} 
                        whileHover={{ y: -15, scale: 1.02 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => router.push(`/roadmap?area=${encodeURIComponent(result.area)}&title=${encodeURIComponent(rec.title)}&desc=${encodeURIComponent(rec.description)}&lang=${language}`)}
                        className="glass-card responsive-p-md md:responsive-p-lg cursor-pointer border-white/5 hover:border-emerald-500/30 hover:bg-white/[0.05] transition-all duration-700 group relative flex flex-col h-full shadow-2xl overflow-hidden"
                      >
                        <div className="absolute top-0 left-0 w-full h-1 md:h-1.5 bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        
                        <div className="flex justify-between items-start mb-6 md:mb-10 relative z-10 w-full">
                          <div className="w-12 h-12 md:w-16 md:h-16 bg-emerald-500/10 rounded-2xl md:rounded-[2rem] flex items-center justify-center group-hover:bg-emerald-600 transition-all duration-500 shadow-xl border border-emerald-500/10 shrink-0">
                            <span className="text-emerald-500 font-black responsive-text-lg md:responsive-text-2xl group-hover:text-white transition-colors">{index + 1}</span>
                          </div>
                          <div className="flex flex-col items-end gap-1.5 min-w-fit">
                             <div className="flex items-center gap-1.5 md:gap-2 bg-amber-500/10 text-amber-500 px-3 md:px-4 py-1.5 md:py-2 rounded-xl md:rounded-2xl responsive-text-xs font-extrabold uppercase tracking-tight border border-amber-500/20 shadow-lg whitespace-nowrap">
                               <TrendingUp className="md:w-[14px] md:h-[14px] animate-bounce" size={12} /> {rec.profitability_score}% MATCH
                             </div>
                          </div>
                        </div>
                        
                        <h4 className="responsive-text-lg md:responsive-text-2xl font-black text-white mb-4 md:mb-6 leading-tight group-hover:text-blue-400 transition-colors tracking-tighter relative z-10">
                          {rec.title}
                        </h4>
                        <p className="text-gray-500 responsive-text-sm leading-relaxed mb-6 md:mb-10 flex-grow font-medium relative z-10 line-clamp-4">
                          {rec.description}
                        </p>
                        
                        <div className="flex items-center justify-between relative z-10 mt-auto">
                          <div className="flex items-center gap-1.5 md:gap-2 responsive-text-xs text-gray-600">
                            <PiggyBank className="md:w-[14px] md:h-[14px]" size={12} />
                            <span>Investment: {rec.investment_range || 'Varies'}</span>
                          </div>
                          <div className="flex items-center gap-1.5 md:gap-2 responsive-text-xs font-bold text-emerald-500 group-hover:text-white transition-colors">
                            <span>Explore</span>
                            <ArrowRight className="md:w-[14px] md:h-[14px] group-hover:translate-x-1 transition-transform" size={12} />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="glass-card responsive-p-lg md:responsive-p-xl text-center min-h-[400px] md:min-h-[550px] flex flex-col items-center justify-center bg-gradient-to-b from-gray-800/10 to-transparent border-gray-500/20"
                >
                  <div className="relative mb-6 md:mb-8">
                    <div className="w-24 h-24 md:w-32 md:h-32 border-2 border-dashed border-gray-500/30 rounded-full flex items-center justify-center">
                      <Target className="text-gray-500 md:w-12 md:h-12" size={32} />
                    </div>
                  </div>
                  <h3 className="responsive-text-xl md:responsive-text-2xl font-bold text-white mb-3 md:mb-4">Ready to Analyze</h3>
                  <p className="text-gray-400 responsive-text-lg mb-6 md:mb-8 max-w-md">
                    Enter a location to discover market opportunities and business insights powered by AI.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 md:gap-4 responsive-text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <Globe2 className="md:w-4 md:h-4 text-blue-500" size={14} />
                      <span>Global Market Data</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BarChart3 className="md:w-4 md:h-4 text-indigo-500" size={14} />
                      <span>AI-Powered Analysis</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="md:w-4 md:h-4 text-emerald-500" size={14} />
                      <span>Real-time Insights</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      
      <PaymentSuccessModal 
        isOpen={showSuccessModal} 
        onClose={() => {
          setShowSuccessModal(false);
          // Remove query params from URL without refreshing
          router.replace('/dashboard');
        }} 
      />
    </ProtectedRoute>
  );
}

export default Dashboard;