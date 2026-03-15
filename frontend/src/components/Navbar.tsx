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

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'payment': return <Zap size={16} className="text-emerald-400" />;
      case 'analysis': return <Zap size={16} className="text-blue-400" />;
      case 'market': return <Zap size={16} className="text-purple-400" />;
      case 'local': return <MapPin size={16} className="text-orange-400" />;
      case 'trending': return <Zap size={16} className="text-red-400" />;
      case 'alert': return <AlertTriangle size={16} className="text-yellow-400" />;
      case 'system': return <Settings size={16} className="text-slate-400" />;
      case 'location': return <MapPin size={16} className="text-emerald-400" />;
      default: return <Bell size={16} className="text-blue-400" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'border-red-500/30 bg-red-500/10';
      case 'high': return 'border-orange-500/30 bg-orange-500/10';
      case 'medium': return 'border-blue-500/30 bg-blue-500/10';
      default: return 'border-gray-500/30 bg-gray-500/10';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] backdrop-blur-xl border-b border-white/5 bg-black/40 dark:bg-gray-900/40">
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
              <span className="text-xl sm:text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-gray-500 tracking-tight">
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
        <div className="hidden md:flex flex-1 justify-center items-center gap-8">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = isActivePage(link.path);
            return (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 group relative ${
                    isActive 
                      ? 'text-white' 
                      : 'text-gray-500 hover:text-white'
                  }`}
                >
                  {isActive && (
                    <motion.div 
                      layoutId="nav-active"
                      className="absolute inset-0 bg-white/5 border border-white/10 rounded-xl shadow-xl"
                      initial={false}
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                  {link.icon && <link.icon size={12} className={`relative z-10 ${isActive ? 'text-blue-400' : 'text-gray-600 group-hover:text-blue-400'}`} />}
                </Link>
            );
          })}
        </div>

        {/* RIGHT: ACTIONS */}
        <div className="flex items-center gap-3 sm:gap-4">
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
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all border border-white/10 hover:border-white/20"
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Theme Toggle or other useful link could go here */}

          {/* Language Selector */}
          <div className="relative" ref={langRef}>
            <button 
              onClick={() => setShowLangs(!showLangs)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 transition-all text-[9px] font-black uppercase tracking-widest border border-white/5"
            >
              <Languages size={14} className="text-blue-400" />
              <span className="hidden sm:inline">{languages.find(l => l.code === language)?.name}</span>
            </button>

            {showLangs && (
              <div className="absolute right-0 mt-3 w-56 glass-card bg-gray-950/95 p-3 border-white/10 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-3 py-2 border-b border-white/5 mb-2">{t("nav_select_lang")}</div>
                <div className="space-y-1">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code);
                        setShowLangs(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
                        language === lang.code ? 'bg-blue-600/20 text-blue-400 border border-blue-500/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      {lang.name}
                      {language === lang.code && <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Get Started Button */}
          {!session?.user && (
            <div className="flex items-center gap-2">
              <button 
                onClick={() => router.push('/auth')}
                className="px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white text-sm sm:text-base font-bold uppercase tracking-wide transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
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
                <div className="absolute right-0 mt-3 w-64 glass-card bg-gray-950/95 p-4 border-white/10 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                  {/* User Info */}
                  <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                    <img 
                      src={session.user.image || `https://ui-avatars.com/api/?name=${session.user.name}`} 
                      className="w-12 h-12 rounded-xl border-2 border-white/10 object-cover"
                      alt="Profile"
                    />
                    <div>
                      <h3 className="text-sm font-bold text-white">{session.user.name}</h3>
                      <p className="text-xs text-gray-400">{session.user.email}</p>
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
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-all"
                    >
                      <User size={16} />
                      {t("nav_profile")}
                    </button>
                    <button
                      onClick={() => {
                        router.push('/dashboard');
                        setShowProfile(false);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-all"
                    >
                      <Zap size={16} />
                      Dashboard
                    </button>
                    <button
                      onClick={() => {
                        router.push('/acquisition-tiers');
                        setShowProfile(false);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-all"
                    >
                      <Settings size={16} />
                      Upgrade Plan
                    </button>
                  </div>

                  {/* Logout */}
                  <div className="pt-3 border-t border-white/10">
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
      
      {/* Strategic Ticker - Passive Engagement */}
      <div className="bg-blue-600/5 border-y border-white/5 py-1 hidden sm:block">
        <div className="responsive-container overflow-hidden whitespace-nowrap relative">
          <motion.div 
            animate={{ x: [0, -1000] }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="flex gap-12 items-center"
          >
            {[1, 2].map((i) => (
              <div key={i} className="flex gap-12 items-center">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest">Aritificial Intelligence</span>
                  <span className="text-[10px] font-bold text-green-400">+12.4% Neural Growth</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest">Renewable Energy</span>
                  <span className="text-[10px] font-bold text-blue-400">High Territorial Synergy</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest">Logistics Automation</span>
                  <span className="text-[10px] font-bold text-orange-400">Market Gap Identified</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest">Digital Health</span>
                  <span className="text-[10px] font-bold text-green-400">Demand Spike: Global</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest">E-commerce 3.0</span>
                  <span className="text-[10px] font-bold text-blue-400">Niche Opportunity (A)</span>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </nav>
  );
}