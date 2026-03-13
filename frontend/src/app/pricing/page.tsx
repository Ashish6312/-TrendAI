"use client";

import { Check, X, ShieldCheck, Zap, Globe2, Rocket, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { motion } from "framer-motion";

export default function Pricing() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#020617]">
      {/* Immersive Background */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/pricing_bg.png" 
          alt="Pricing Background" 
          className="w-full h-full object-cover opacity-20 scale-105 blur-[3px] animate-pulse-slow"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/40 via-[#020617] to-[#020617]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-32 text-center relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-24 space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em] mb-4">
             Neural Acquisition Protocol
          </div>
          <h1 className="text-6xl md:text-9xl font-black text-white mb-8 tracking-tighter leading-none italic">
            Scale Your <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-600">Empire.</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-500 max-w-3xl mx-auto font-medium leading-relaxed">
            {t("price_subtitle")}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto text-left relative z-10">
          
          {/* Free Plan */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            whileHover={{ y: -10 }}
            className="glass-card p-14 flex flex-col justify-between border-white/5 bg-gradient-to-br from-white/[0.02] to-transparent hover:border-emerald-500/20 transition-all duration-700 group shadow-2xl overflow-hidden relative"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gray-500/20 to-transparent" />
            
            <div>
              <div className="flex justify-between items-start mb-12">
                 <div>
                    <h2 className="text-3xl font-black text-white mb-3 tracking-tight uppercase tracking-widest">{t("price_starter")}</h2>
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-[0.2em]">{t("price_starter_desc")}</p>
                 </div>
                 <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center text-gray-500 group-hover:bg-emerald-600/10 group-hover:text-emerald-500 transition-all duration-500 border border-white/5">
                    <Globe2 size={28} />
                 </div>
              </div>
              
              <div className="text-7xl font-black text-white mb-14 tracking-tighter">$0<span className="text-xl text-gray-700 font-black uppercase tracking-widest ml-3">/cycle</span></div>
              
              <ul className="space-y-7 mb-16 text-gray-400 text-xs font-bold uppercase tracking-[0.25em]">
                {[
                  { text: `5 ${t("price_searches")}`, icon: <Check size={16} /> },
                  { text: t("price_google"), icon: <Check size={16} /> },
                  { text: `3 ${t("price_recs")}`, icon: <Check size={16} /> },
                  { text: t("price_sent"), icon: <X size={16} />, disabled: true },
                  { text: t("price_comp"), icon: <X size={16} />, disabled: true },
                ].map((item, i) => (
                  <li key={i} className={`flex items-center gap-5 ${item.disabled ? 'opacity-20' : ''}`}>
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${item.disabled ? 'bg-white/5' : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shadow-lg'}`}>
                      {item.icon}
                    </div>
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Link href="/dashboard" className="w-full py-6 px-4 text-center text-[11px] font-black uppercase tracking-[0.4em] text-gray-400 border border-white/10 rounded-[2rem] hover:bg-emerald-500/10 hover:text-emerald-400 hover:border-emerald-500/30 transition-all duration-500 shadow-inner">
              {t("price_free")}
            </Link>
          </motion.div>

          {/* Pro Plan */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            whileHover={{ y: -15, scale: 1.02 }}
            className="glass-card p-14 flex flex-col justify-between border-emerald-500/20 bg-gradient-to-br from-emerald-600/10 via-transparent to-amber-600/5 relative overflow-hidden group shadow-[0_40px_120px_-20px_rgba(16,185,129,0.3)]"
          >
            <div className="absolute top-0 right-0 bg-emerald-600 text-white text-[10px] font-black px-8 py-3 rounded-bl-[2.5rem] tracking-[0.4em] uppercase shadow-2xl z-20">
              {t("price_popular")}
            </div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div>
              <div className="flex justify-between items-start mb-12 relative z-10">
                 <div>
                    <h2 className="text-3xl font-black text-white mb-3 tracking-tight uppercase tracking-widest">{t("price_pro")}</h2>
                    <p className="text-emerald-400/60 text-xs font-bold uppercase tracking-[0.2em]">{t("price_pro_desc")}</p>
                 </div>
                 <div className="w-16 h-16 bg-emerald-500/20 rounded-[2rem] flex items-center justify-center text-emerald-500 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-700 shadow-xl border border-emerald-500/20">
                    <Zap size={28} fill="currentColor" />
                 </div>
              </div>

              <div className="text-7xl font-black text-white mb-14 tracking-tighter relative z-10">$29<span className="text-xl text-emerald-500/50 font-black uppercase tracking-widest ml-3">/cycle</span></div>
              
              <ul className="space-y-7 mb-16 text-gray-200 text-xs font-bold uppercase tracking-[0.25em] relative z-10">
                {[
                  { text: t("price_unlimited"), icon: <Check size={16} /> },
                  { text: t("price_adv_data"), icon: <Check size={16} /> },
                  { text: `10 ${t("price_recs")}`, icon: <Check size={16} /> },
                  { text: t("price_sent"), icon: <Check size={16} /> },
                  { text: t("price_comp"), icon: <Check size={16} /> },
                  { text: t("price_export"), icon: <Check size={16} /> },
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-5">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 border border-emerald-500/30 shadow-lg">
                      {item.icon}
                    </div>
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <button className="relative z-10 w-full py-6 px-4 text-center text-[11px] font-black uppercase tracking-[0.4em] text-white growth-gradient rounded-[2rem] shadow-[0_30px_60px_-10px_rgba(16,185,129,0.5)] transition-all duration-700 hover:-translate-y-2 active:scale-95 flex items-center justify-center gap-5 group">
              <Rocket size={22} className="group-hover:rotate-12 transition-transform" />
              {t("price_upgrade")}
            </button>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="mt-32 flex flex-wrap items-center justify-center gap-16 opacity-40 grayscale hover:grayscale-0 transition-all duration-1000"
        >
           <div className="flex items-center gap-3 text-xs font-black text-white tracking-[0.3em] uppercase"><ShieldCheck size={18} className="text-emerald-500" /> SECURE GATEWAY</div>
           <div className="flex items-center gap-3 text-xs font-black text-white tracking-[0.3em] uppercase"><Zap size={18} className="text-amber-500" /> INSTANCE NODE</div>
           <div className="flex items-center gap-3 text-xs font-black text-white tracking-[0.3em] uppercase"><ArrowRight size={18} className="text-emerald-500" /> P2P ENCRYPTION</div>
        </motion.div>
      </div>
    </div>
  );
}
