"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Languages, LogOut, Zap, Home, User, Settings, Moon, Sun, ChevronDown, X, Menu } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { useClickOutside } from "@/hooks/useClickOutside";
import { useSubscription } from "@/context/SubscriptionContext";
import { useTheme } from "next-themes";

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
  const { plan, theme: subscriptionTheme, planFeatures } = useSubscription();
  const { theme, setTheme } = useTheme();
  const [showLangs, setShowLangs] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [marketData, setMarketData] = useState({
    ai: 12.42,
    energy: 78.2,
    sentiment: "SYNCED"
  });

  // Ensure component is mounted before rendering theme-dependent content
  useEffect(() => {
    setMounted(true);
  }, []);

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
  const mobileMenuRef = useClickOutside<HTMLDivElement>(useCallback(() => setShowMobileMenu(false), []));

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const isActivePage = (path: string) => {
    return pathname === path;
  };

  const navLinks = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/dashboard', label: t("nav_dashboard"), icon: Zap },
    { path: '/acquisition-tiers', label: t("btn_pricing"), icon: Zap },
  ];



  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b border-slate-200 dark:border-white/5 bg-white/70 dark:bg-[#020617]/70 transition-all duration-500">
      {/* Primary Nav Content - Elevated Layer */}
      <div className="relative z-30 responsive-container h-16 sm:h-20 lg:h-24 flex items-center justify-between gap-2 sm:gap-4">
        {/* LEFT: LOGO */}
        <div className="flex shrink-0">
          <div className="flex items-center gap-2 sm:gap-3 group cursor-pointer" onClick={() => router.push('/')}>
            <div 
              className="w-8 h-8 sm:w-10 sm:h-10 lg:w-11 lg:h-11 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-all duration-300"
              style={{ 
                background: `linear-gradient(135deg, ${subscriptionTheme.primary}, ${subscriptionTheme.secondary})`,
                boxShadow: `0 0 30px -5px ${subscriptionTheme.primary}40`
              }}
            >
              <Zap className="text-white" size={16} fill="currentColor" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl lg:text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-slate-700 to-slate-500 dark:from-white dark:via-white dark:to-gray-500 tracking-tight">
                Trend<span style={{ color: subscriptionTheme.primary }} className="uppercase tracking-widest text-sm sm:text-base lg:text-lg ml-1">AI</span>
              </span>
              {plan !== 'free' && (
                <span 
                  className="text-[7px] sm:text-[8px] font-black uppercase tracking-widest opacity-80"
                  style={{ color: subscriptionTheme.primary }}
                >
                  {planFeatures.planName}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* CENTER: NAV LINKS (Desktop) */}
        <div className="hidden lg:flex flex-1 justify-center items-center gap-6 xl:gap-10">
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
        <div className="flex items-center gap-1 sm:gap-2 lg:gap-4">
          {/* Mobile Menu Button */}
          <div className="lg:hidden relative" ref={mobileMenuRef}>
            <button 
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="p-2 text-gray-500 hover:text-blue-500 rounded-xl transition-all"
            >
              <Menu size={20} />
            </button>

            {/* Mobile Menu Dropdown */}
            <AnimatePresence>
              {showMobileMenu && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="absolute right-0 mt-3 w-64 bg-white/95 dark:bg-gray-950/95 backdrop-blur-xl rounded-2xl p-4 border border-slate-200/50 dark:border-slate-600/50 shadow-2xl navbar-dropdown overflow-hidden"
                >
                  <div className="space-y-2">
                    {navLinks.map((link) => {
                      const isActive = isActivePage(link.path);
                      return (
                        <Link
                          key={link.path}
                          href={link.path}
                          onClick={() => setShowMobileMenu(false)}
                          className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 ${
                            isActive 
                              ? 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 text-blue-700 dark:text-blue-300 border border-blue-200/50 dark:border-blue-800/50' 
                              : 'text-slate-600 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
                          }`}
                        >
                          {link.icon && <link.icon size={16} />}
                          <span>{link.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Dark/Light Mode Toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleTheme}
            className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-white dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white transition-all border border-slate-200 dark:border-white/10 shadow-sm relative group overflow-hidden"
            title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/0 via-blue-500/0 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            {mounted && theme === 'dark' ? (
              <Sun size={16} className="relative z-10 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]" />
            ) : (
              <Moon size={16} className="relative z-10 text-slate-400" />
            )}
          </motion.button>

          {/* Language Selector */}
          <div className="relative" ref={langRef}>
            <button 
              onClick={() => setShowLangs(!showLangs)}
              className="flex items-center gap-1.5 sm:gap-2.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full sm:rounded-full bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white transition-all border border-slate-200 dark:border-white/10 shadow-sm"
            >
              <Languages size={14} className="text-blue-500" />
              <span className="hidden sm:inline">
                {languages.find(l => l.code === language)?.name}
              </span>
              <ChevronDown 
                size={10} 
                className={`text-slate-400 dark:text-gray-500 transition-transform duration-300 ${showLangs ? 'rotate-180' : ''}`} 
              />
            </button>

            <AnimatePresence>
              {showLangs && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="absolute right-0 mt-3 w-56 sm:w-64 bg-white dark:bg-slate-950 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.3)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-[100] overflow-hidden"
                  style={{
                    backdropFilter: 'blur(16px)',
                  }}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-white/5">
                    <div className="flex items-center gap-2">
                      <Languages size={16} className="text-blue-600 dark:text-blue-400" />
                      <span className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                        {t("nav_select_lang")}
                      </span>
                    </div>
                    <button
                      onClick={() => setShowLangs(false)}
                      className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
                    >
                      <X size={14} className="text-slate-400 dark:text-gray-500" />
                    </button>
                  </div>

                  {/* Language Options */}
                  <div className="space-y-1.5">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code);
                          setShowLangs(false);
                        }}
                        className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all duration-300 flex items-center justify-between group relative overflow-hidden ${
                          language === lang.code 
                            ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20' 
                            : 'text-slate-600 dark:text-gray-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white border border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-3 relative z-10">
                          <span className={`font-bold tracking-tight transition-colors ${language === lang.code ? 'text-blue-600 dark:text-blue-400' : 'group-hover:text-slate-900 dark:group-hover:text-white'}`}>
                            {lang.name}
                          </span>
                        </div>
                        {language === lang.code && (
                          <motion.div 
                            layoutId="lang-active-dot"
                            className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.8)] relative z-10"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                          />
                        )}
                      </button>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="mt-5 pt-4 border-t border-slate-100 dark:border-white/5">
                    <p className="text-[10px] text-slate-400 dark:text-gray-500 text-center font-black uppercase tracking-widest italic opacity-70">
                      Settings Sync Active
                    </p>
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
                className="px-3 sm:px-4 lg:px-8 py-2 sm:py-2.5 lg:py-3.5 rounded-lg sm:rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-[9px] sm:text-[11px] font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 transform hover:-translate-y-0.5 active:scale-95 whitespace-nowrap italic"
              >
                <span className="hidden sm:inline">Get Started</span>
                <span className="sm:hidden">Start</span>
              </button>
            </div>
          )}

          {/* Profile Dropdown */}
          {session?.user && (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setShowProfile(!showProfile)}
                className="flex items-center gap-1 sm:gap-2 p-1 sm:p-1.5 rounded-lg sm:rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-all duration-200 border border-transparent hover:border-slate-200 dark:hover:border-white/10"
              >
                <div className="relative">
                  <img 
                    src={session.user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(session.user.name || 'User')}&background=${subscriptionTheme.primary.slice(1)}&color=ffffff&size=200&bold=true`} 
                    className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl border-2 border-white/20 dark:border-white/10 shadow-lg object-cover"
                    alt="Profile"
                  />
                  <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-950 shadow-sm" />
                </div>
                <ChevronDown 
                  size={12} 
                  className={`text-gray-400 dark:text-gray-500 transition-transform duration-200 hidden sm:block ${showProfile ? 'rotate-180' : ''}`} 
                />
              </button>

              <AnimatePresence>
                {showProfile && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute right-0 mt-3 w-64 sm:w-80 bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.3)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-[100] overflow-hidden"
                    style={{
                      backdropFilter: 'blur(16px)',
                    }}
                  >
                    {/* User Info Header */}
                    <div className="flex items-center gap-3 sm:gap-4 pb-4 border-b border-slate-100 dark:border-white/10">
                      <div className="relative">
                        <img 
                          src={session.user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(session.user.name || 'User')}&background=${subscriptionTheme.primary.slice(1)}&color=ffffff&size=200&bold=true`} 
                          className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl border-2 border-white/20 dark:border-white/10 object-cover shadow-lg"
                          alt="Profile"
                        />
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-green-500 rounded-full border-2 border-white dark:border-gray-950 shadow-sm" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white truncate tracking-tight">
                          {session.user.name}
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-500 dark:text-gray-400 truncate font-medium">
                          {session.user.email}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                          <span className="text-xs text-green-500 font-bold uppercase tracking-wider">Online</span>
                        </div>
                      </div>
                    </div>

                    {/* Plan Status - Premium Design */}
                    <div className="py-4">
                      <div 
                        className="group relative overflow-hidden p-4 rounded-2xl border transition-all duration-500"
                        style={{ 
                          background: theme === 'dark' 
                            ? `linear-gradient(135deg, ${subscriptionTheme.primary}15, ${subscriptionTheme.secondary}05)` 
                            : `linear-gradient(135deg, ${subscriptionTheme.primary}08, ${subscriptionTheme.secondary}03)`,
                          borderColor: `${subscriptionTheme.primary}30`
                        }}
                      >
                        <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:rotate-12 transition-transform duration-700">
                          <Zap size={40} style={{ color: subscriptionTheme.primary }} />
                        </div>
                        
                        <div className="flex items-center gap-3 relative z-10">
                          <div 
                            className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-500"
                            style={{ 
                              background: `linear-gradient(135deg, ${subscriptionTheme.primary}, ${subscriptionTheme.secondary})`,
                              boxShadow: `0 8px 16px -4px ${subscriptionTheme.primary}40`
                            }}
                          >
                            <Zap size={18} className="text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-tight">
                              {planFeatures.planName}
                            </p>
                            <p className="text-[10px] text-slate-500 dark:text-gray-400 font-bold uppercase tracking-widest opacity-70">
                              Current Plan
                            </p>
                          </div>
                          {plan === 'free' ? (
                            <button
                              onClick={() => {
                                router.push('/acquisition-tiers');
                                setShowProfile(false);
                              }}
                              className="px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-lg hover:shadow-xl active:scale-95 italic"
                            >
                              Upgrade
                            </button>
                          ) : (
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2 space-y-1">
                      <button
                        onClick={() => {
                          router.push('/profile');
                          setShowProfile(false);
                        }}
                        className="w-full flex items-center gap-4 px-3 py-2.5 rounded-xl text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5 transition-all duration-300 group relative border border-transparent hover:border-slate-200/50 dark:hover:border-white/10"
                      >
                        <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-white/5 flex items-center justify-center group-hover:bg-white dark:group-hover:bg-slate-800 transition-all duration-300 border border-transparent group-hover:border-slate-200 dark:group-hover:border-slate-700">
                          <User size={16} className="text-slate-500 dark:text-slate-400 group-hover:text-blue-500 transition-colors" />
                        </div>
                        <div className="flex-1 text-left">
                          <p className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-tight">{t("nav_profile")}</p>
                          <p className="text-[9px] text-slate-400 dark:text-gray-500 font-bold uppercase tracking-widest opacity-70">Manage Account</p>
                        </div>
                        <ChevronDown size={12} className="rotate-[-90deg] text-slate-300 dark:text-slate-600" />
                      </button>

                      <button
                        onClick={() => {
                          router.push('/dashboard');
                          setShowProfile(false);
                        }}
                        className="w-full flex items-center gap-4 px-3 py-2.5 rounded-xl text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5 transition-all duration-300 group relative border border-transparent hover:border-slate-200/50 dark:hover:border-white/10"
                      >
                        <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-white/5 flex items-center justify-center group-hover:bg-white dark:group-hover:bg-slate-800 transition-all duration-300 border border-transparent group-hover:border-slate-200 dark:group-hover:border-slate-700">
                          <Zap size={16} className="text-slate-500 dark:text-slate-400 group-hover:text-amber-500 transition-colors" />
                        </div>
                        <div className="flex-1 text-left">
                          <p className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-tight">Dashboard</p>
                          <p className="text-[9px] text-slate-400 dark:text-gray-500 font-bold uppercase tracking-widest opacity-70">Analytics View</p>
                        </div>
                        <ChevronDown size={12} className="rotate-[-90deg] text-slate-300 dark:text-slate-600" />
                      </button>

                      <button
                        onClick={() => {
                          router.push('/acquisition-tiers');
                          setShowProfile(false);
                        }}
                        className="w-full flex items-center gap-4 px-3 py-2.5 rounded-xl text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5 transition-all duration-300 group relative border border-transparent hover:border-slate-200/50 dark:hover:border-white/10"
                      >
                        <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-white/5 flex items-center justify-center group-hover:bg-white dark:group-hover:bg-slate-800 transition-all duration-300 border border-transparent group-hover:border-slate-200 dark:group-hover:border-slate-700">
                          <Settings size={16} className="text-slate-500 dark:text-slate-400 group-hover:text-emerald-500 transition-colors" />
                        </div>
                        <div className="flex-1 text-left">
                          <p className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-tight">Upgrade Plan</p>
                          <p className="text-[9px] text-slate-400 dark:text-gray-500 font-bold uppercase tracking-widest opacity-70">View Tiers</p>
                        </div>
                        <ChevronDown size={12} className="rotate-[-90deg] text-slate-300 dark:text-slate-600" />
                      </button>
                    </div>

                    {/* Logout */}
                    <div className="pt-2 border-t border-slate-100 dark:border-white/10">
                      <button
                        onClick={() => signOut({ callbackUrl: '/' })}
                        className="w-full flex items-center gap-4 px-3 py-2.5 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all duration-300 group relative border border-transparent hover:border-red-200/50 dark:hover:border-red-900/30"
                      >
                        <div className="w-9 h-9 rounded-lg bg-red-50 dark:bg-red-950/20 flex items-center justify-center group-hover:bg-white dark:group-hover:bg-red-900 transition-all duration-300 border border-transparent group-hover:border-red-200 dark:group-hover:border-red-800">
                          <LogOut size={16} className="text-red-500 group-hover:scale-110 transition-transform" />
                        </div>
                        <div className="flex-1 text-left">
                          <p className="text-sm font-bold text-red-600 dark:text-red-400 uppercase tracking-tight">{t("nav_logout")}</p>
                          <p className="text-[9px] text-red-400 dark:text-red-500 font-bold uppercase tracking-widest opacity-70">Secure Sign Out</p>
                        </div>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
            {/* Strategic Intelligence Pulse - Modular High-Fidelity Feed */}
      <div className="relative z-10 bg-white/80 dark:bg-[#020617]/90 border-y border-slate-200 dark:border-white/5 py-2.5 hidden sm:block backdrop-blur-xl">
        <div className="responsive-container relative overflow-hidden">
          {/* Refined Edge Fades for Visual Depth */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white dark:from-[#020617] to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white dark:from-[#020617] to-transparent z-10" />
          
          <motion.div 
            animate={{ x: [0, -2000] }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            className="flex gap-12 items-center whitespace-nowrap"
          >
            {[1, 2, 3, 4].map((group) => (
              <div key={group} className="flex gap-12 items-center">
                {/* Neural Core Status Pill */}
                <div className="flex items-center gap-3 px-4 py-1.5 rounded-full bg-blue-500/5 dark:bg-blue-500/10 border border-blue-200/50 dark:border-blue-500/20 shadow-sm">
                  <div className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]"></span>
                  </div>
                  <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest italic">Neural Sync</span>
                  <div className="h-3 w-[1px] bg-blue-200 dark:bg-blue-800/50" />
                  <span className="text-[10px] font-mono font-black text-blue-700 dark:text-blue-300">ACTIVE</span>
                </div>

                {/* AI Performance Metric */}
                <div className="flex items-center gap-3 px-4 py-1.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-tighter">AI AGENT LOAD</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-black text-emerald-600 dark:text-emerald-400">+{marketData.ai.toFixed(2)}%</span>
                      {/* Animated Activity Spark */}
                      <div className="flex gap-0.5 items-end h-2.5">
                        {[40, 70, 50, 90, 60].map((h, i) => (
                          <motion.div 
                            key={i}
                            animate={{ height: [`${h}%`, `${h+20}%`, `${h}%`] }}
                            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
                            className="w-0.5 bg-emerald-500/40 rounded-full"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Energy Pulse Pill */}
                <div className="flex items-center gap-3 px-4 py-1.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-tighter">CORE ENERGY</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-black text-blue-600 dark:text-blue-400">{marketData.energy.toFixed(1)}GW</span>
                      {/* Scanning Pulse Bar */}
                      <div className="w-12 h-1 bg-blue-100 dark:bg-blue-900/30 rounded-full overflow-hidden relative">
                        <motion.div 
                          animate={{ left: ['-100%', '100%'] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                          className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-blue-500 to-transparent"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Alpha Strategy Status */}
                <div className="flex items-center gap-4">
                  <div className="w-[1px] h-6 bg-slate-200 dark:bg-white/10" />
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-tighter">MARKET ALPHA</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-black text-amber-600 dark:text-amber-500 italic">OPTIMIZED</span>
                      <div className="w-2 h-2 rounded-sm bg-amber-500/20 flex items-center justify-center">
                        <div className="w-1 h-1 rounded-full bg-amber-500 animate-pulse" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* FinTech Sync Monitor */}
                <div className="flex items-center gap-3">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-tighter">FINTECH SYNC</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-black text-slate-700 dark:text-slate-200 tracking-tight">STABLE</span>
                      <div className="flex gap-1 items-center">
                        <div className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
                        <div className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </nav>
  );
}