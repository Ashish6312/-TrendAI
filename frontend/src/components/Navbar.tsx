"use client";

import { useSession, signOut, signIn } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Languages, LogOut, Zap, Home, Bell, User, Settings, Moon, Sun, ChevronDown, X, ExternalLink, Clock, AlertTriangle, MapPin } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { useClickOutside } from "@/hooks/useClickOutside";
import { useNotifications } from "@/context/NotificationContext";
import { useSubscription } from "@/context/SubscriptionContext";

const languages = [
  { code: "English", name: "English" },
  { code: "Hindi", name: "हिन्दी" },
  { code: "Spanish", name: "Español" },
  { code: "French", name: "Français" },
  { code: "German", name: "Deutsch" },
];

export default function Navbar() {
  const { language, setLanguage, t } = useLanguage();
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const { userLocation } = useNotifications();
  const { plan, theme, planFeatures } = useSubscription();
  const [showLangs, setShowLangs] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [marketData, setMarketData] = useState({
    ai: 12.42,
    energy: 78.2,
    sentiment: "SYNCED"
  });

  // Simulated live updates for "Real-Time" feel without API calls
  useEffect(() => {
    const interval = setInterval(() => {
      setMarketData(prev => ({
        ai: prev.ai + (Math.random() * 0.04 - 0.02),
        energy: prev.energy + (Math.random() * 0.2 - 0.1),
        sentiment: Math.random() > 0.9 ? "CALIBRATING" : "SYNCED"
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Click outside handlers
  const langRef = useClickOutside<HTMLDivElement>(useCallback(() => setShowLangs(false), []));
  const profileRef = useClickOutside<HTMLDivElement>(useCallback(() => setShowProfile(false), []));

  // Initialize dark mode from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const isDark = savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setDarkMode(isDark);
    document.documentElement.classList.toggle('dark', isDark);
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('theme', newDarkMode ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', newDarkMode);
  };

  const isActivePage = (path: string) => {
    return pathname === path;
  };

  const navLinks = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/dashboard', label: t("nav_dashboard"), icon: Zap },
    { path: '/acquisition-tiers', label: t("btn_pricing"), icon: null },
  ];



  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] backdrop-blur-xl border-b border-slate-200 dark:border-white/5 bg-white/70 dark:bg-black/40 transition-colors duration-300">
      <div className="responsive-container h-16 sm:h-18 lg:h-20 flex items-center justify-between gap-2 sm:gap-4">
        {/* LEFT: LOGO */}
        <div className="flex shrink-0">
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => router.push('/')}>
            <div 
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-all duration-300"
              style={{ 
                background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`,
                boxShadow: `0 0 30px -5px ${theme.primary}40`
              }}
            >
              <Zap className="text-white" size={20} fill="currentColor" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-slate-700 to-slate-500 dark:from-white dark:via-white dark:to-gray-500 tracking-tight">
                Trend<span style={{ color: theme.primary }} className="uppercase tracking-widest text-base sm:text-lg ml-1">AI</span>
              </span>
              {plan !== 'free' && (
                <span 
                  className="text-[8px] font-black uppercase tracking-widest opacity-80"
                  style={{ color: theme.primary }}
                >
                  {planFeatures.planName}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* CENTER: NAV LINKS (Desktop) */}
        <div className="hidden md:flex flex-1 justify-center items-center gap-6 lg:gap-10">
          {navLinks.map((link) => {
            const isActive = isActivePage(link.path);
            return (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 group relative ${
                    isActive 
                      ? 'text-slate-900 dark:text-white' 
                      : 'text-slate-500 dark:text-gray-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {isActive && (
                    <motion.div 
                      layoutId="nav-active"
                      className="absolute inset-0 bg-slate-900/5 dark:bg-white/5 border border-slate-900/10 dark:border-white/10 rounded-xl shadow-sm"
                      initial={false}
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                  {link.icon && <link.icon size={12} className={`relative z-10 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-gray-600 group-hover:text-blue-600 dark:group-hover:text-blue-400'}`} />}
                </Link>
            );
          })}
        </div>

        {/* RIGHT: ACTIONS */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Mobile Dashboard Button */}
          <button 
            onClick={() => router.push('/dashboard')}
            className="md:hidden p-2 text-gray-500 hover:text-blue-500 rounded-xl transition-all"
          >
            <Home size={20} />
          </button>

          {/* Dark/Light Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white transition-all border border-slate-200 dark:border-white/10 shadow-sm"
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Language Selector */}
          <div className="relative" ref={langRef}>
            <button 
              onClick={() => setShowLangs(!showLangs)}
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-600 dark:text-gray-300 transition-all text-[9px] font-black uppercase tracking-widest border border-slate-200 dark:border-white/5"
            >
              <Languages size={14} className="text-blue-600 dark:text-blue-400" />
              <span className="hidden sm:inline">{languages.find(l => l.code === language)?.name}</span>
            </button>

            <AnimatePresence>
              {showLangs && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-3 w-56 glass-card bg-white dark:bg-gray-950 p-3 border-slate-200 dark:border-white/10 shadow-2xl z-50"
                >
                  <div className="text-[10px] font-black text-slate-400 dark:text-gray-500 uppercase tracking-widest px-3 py-2 border-b border-slate-100 dark:border-white/5 mb-2">{t("nav_select_lang")}</div>
                  <div className="space-y-1">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code);
                          setShowLangs(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
                          language === lang.code ? 'bg-blue-600/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 shadow-sm' : 'text-slate-600 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        {lang.name}
                        {language === lang.code && <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Get Started Button */}
          {!session?.user && (
            <div className="flex items-center">
              <button 
                onClick={() => router.push('/auth')}
                className="px-4 sm:px-8 py-2.5 sm:py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-[11px] font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 transform hover:-translate-y-0.5 active:scale-95 whitespace-nowrap italic"
              >
                Get Started
              </button>
            </div>
          )}

          {/* Profile Dropdown */}
          {session?.user && (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setShowProfile(!showProfile)}
                className="flex items-center gap-2 p-1 rounded-xl hover:bg-white/5 transition-all"
              >
                <img 
                  src={session.user.image || `https://ui-avatars.com/api/?name=${session.user.name}`} 
                  className="w-9 h-9 rounded-xl border-2 border-white/10 shadow-lg object-cover"
                  alt="Profile"
                />
                <ChevronDown size={14} className="text-gray-400" />
              </button>

              {showProfile && (
                <div className="absolute right-0 mt-3 w-64 glass-card bg-white/95 dark:bg-gray-950/95 p-4 border-slate-200 dark:border-white/10 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                  {/* User Info */}
                  <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-white/10">
                    <img 
                      src={session.user.image || `https://ui-avatars.com/api/?name=${session.user.name}`} 
                      className="w-12 h-12 rounded-xl border-2 border-white/10 object-cover"
                      alt="Profile"
                    />
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">{session.user.name}</h3>
                      <p className="text-xs text-slate-500 dark:text-gray-400">{session.user.email}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        <span className="text-xs text-green-400">Online</span>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-3 space-y-1">
                    <button
                      onClick={() => {
                        router.push('/profile');
                        setShowProfile(false);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-all font-bold"
                    >
                      <User size={16} />
                      {t("nav_profile")}
                    </button>
                    <button
                      onClick={() => {
                        router.push('/dashboard');
                        setShowProfile(false);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-all font-bold"
                    >
                      <Zap size={16} />
                      Dashboard
                    </button>
                    <button
                      onClick={() => {
                        router.push('/acquisition-tiers');
                        setShowProfile(false);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-all font-bold"
                    >
                      <Settings size={16} />
                      Upgrade Plan
                    </button>
                  </div>

                  {/* Logout */}
                  <div className="pt-3 border-t border-slate-100 dark:border-white/10">
                    <button
                      onClick={() => signOut({ callbackUrl: '/' })}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
                    >
                      <LogOut size={16} />
                      {t("nav_logout")}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Strategic Intelligence Ticker - Professional & Live Feeling */}
      <div className="bg-slate-50/80 dark:bg-gray-950/50 border-y border-slate-200 dark:border-white/5 py-1.5 hidden sm:block backdrop-blur-md">
        <div className="responsive-container overflow-hidden whitespace-nowrap relative">
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-slate-50 dark:from-gray-950 to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-slate-50 dark:from-gray-950 to-transparent z-10" />
          
          <motion.div 
            animate={{ x: [0, -1500] }}
            transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
            className="flex gap-16 items-center"
          >
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-16 items-center">
                <div className="flex items-center gap-3">
                  <div className={`w-1 h-1 rounded-full animate-pulse ${marketData.sentiment === 'SYNCED' ? 'bg-blue-500' : 'bg-orange-500'}`} />
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Neural Sync</span>
                  <span className={`text-[10px] font-mono font-bold ${marketData.sentiment === 'SYNCED' ? 'text-emerald-400' : 'text-orange-400'}`}>
                    {marketData.sentiment}
                  </span>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-black text-slate-600 dark:text-slate-200 uppercase tracking-tighter shrink-0">Artificial Intelligence</span>
                  <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-500">+{marketData.ai.toFixed(2)}%</span>
                  <div className="w-8 h-[1px] bg-emerald-500/20" />
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-black text-slate-600 dark:text-slate-200 uppercase tracking-tighter shrink-0">Renewable Energy</span>
                  <span className="text-[10px] font-mono font-bold text-blue-600 dark:text-blue-400">{marketData.energy.toFixed(1)} INDEX</span>
                  <div className="w-8 h-[1px] bg-blue-500/20" />
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-black text-slate-600 dark:text-slate-200 uppercase tracking-tighter shrink-0">Logistics Automation</span>
                  <span className="text-[10px] font-mono font-bold text-orange-600 dark:text-orange-400">GAP DETECTED</span>
                  <div className="w-8 h-[1px] bg-orange-500/20" />
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-black text-slate-600 dark:text-slate-200 uppercase tracking-tighter shrink-0">Digital Therapeutics</span>
                  <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-500">BULLISH</span>
                  <div className="w-8 h-[1px] bg-emerald-500/20" />
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-black text-slate-600 dark:text-slate-200 uppercase tracking-tighter shrink-0">FinTech 3.0</span>
                  <span className="text-[10px] font-mono font-bold text-blue-600 dark:text-blue-400">ALPHA PHASE</span>
                  <div className="w-8 h-[1px] bg-blue-500/20" />
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </nav>
  );
}