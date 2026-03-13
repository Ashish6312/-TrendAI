"use client";

import { useSession, signOut, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Languages, LogOut, Zap } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import Image from "next/image";

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
  const [showLangs, setShowLangs] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] backdrop-blur-xl border-b border-white/5 bg-black/40">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center">
        {/* LEFT: LOGO */}
        <div className="flex-1 flex justify-start">
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => router.push('/dashboard')}>
            <div className="w-11 h-11 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-[0_0_30px_-5px_rgba(59,130,246,0.4)] group-hover:scale-105 transition-all duration-300">
              <Zap className="text-white" size={22} fill="currentColor" />
            </div>
            <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-gray-500 tracking-tight">
              Trend<span className="text-blue-500 uppercase tracking-widest text-lg ml-1">AI</span>
            </span>
          </div>
        </div>

        {/* CENTER: NAV LINKS */}
        <div className="hidden md:flex flex-1 justify-center items-center gap-10">
          <button onClick={() => router.push('/dashboard')} className="text-xs font-black uppercase tracking-[0.2em] text-gray-500 hover:text-white transition-all hover:scale-110">
            {t("nav_dashboard")}
          </button>
          <button onClick={() => router.push('/pricing')} className="text-xs font-black uppercase tracking-[0.2em] text-gray-500 hover:text-white transition-all hover:scale-110">
            {t("price_title")}
          </button>
        </div>

        {/* RIGHT: ACTIONS */}
        <div className="flex-1 flex justify-end items-center gap-6">
          <div className="relative">
            <button 
              onClick={() => setShowLangs(!showLangs)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest border border-white/5 active:scale-95"
            >
              <Languages size={16} className="text-blue-400" />
              {languages.find(l => l.code === language)?.name}
            </button>

            {showLangs && (
              <div className="absolute right-0 mt-3 w-64 glass-card bg-gray-950/95 p-3 border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] animate-in fade-in zoom-in-95 duration-200">
                <div className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] px-3 py-2 border-b border-white/5 mb-2">{t("nav_select_lang")}</div>
                <div className="space-y-1">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code);
                        setShowLangs(false);
                      }}
                      className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-between ${
                        language === lang.code ? 'bg-blue-600/20 text-blue-400 border border-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.2)]' : 'text-gray-400 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      {lang.name}
                      {language === lang.code && <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {!session?.user && (
            <button 
              onClick={() => signIn('google')}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-600/20 active:scale-95"
            >
              {t("nav_login")}
            </button>
          )}

          {session?.user && (
            <div className="flex items-center gap-5 pl-6 border-l border-white/10">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-xs font-black text-white tracking-tight leading-none mb-1.5">{session.user.name}</span>
                <div className="flex items-center gap-1.5 group/link cursor-pointer" onClick={() => router.push('/profile')}>
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_#22c55e]" />
                  <span className="text-[9px] text-gray-500 font-black uppercase tracking-[0.2em] leading-none group-hover/link:text-blue-400 transition-colors uppercase">{t("nav_profile")}</span>
                </div>
              </div>
              <div className="relative group cursor-pointer" onClick={() => router.push('/profile')}>
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl blur opacity-25 group-hover:opacity-60 transition duration-1000 group-hover:duration-200" />
                <Image 
                  src={session.user.image || `https://ui-avatars.com/api/?name=${session.user.name}`} 
                  className="relative w-10 h-10 rounded-2xl border-2 border-white/10 shadow-2xl transition-all object-cover hover:scale-105"
                  alt="Profile"
                  width={40}
                  height={40}
                  unoptimized
                />
              </div>
              <button 
                onClick={() => signOut({ callbackUrl: '/' })}
                className="p-2.5 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all border border-transparent hover:border-red-500/20 active:scale-90"
                title={t("nav_logout")}
              >
                <LogOut size={18} />
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}