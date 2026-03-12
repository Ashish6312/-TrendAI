"use client";

import { Check, X, ShieldCheck, Zap, Globe2, Rocket, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { motion } from "framer-motion";

export default function Pricing() {
  const { t } = useLanguage();

  return (
    <div className="max-w-7xl mx-auto px-6 py-24 text-center relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] -z-10" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-20 space-y-4"
      >
        <div className="text-blue-500 text-[10px] font-black uppercase tracking-[0.4em] mb-4">Neural Acquisition Protocol</div>
        <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter selection:bg-blue-600">
          {t("price_title")}
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto font-medium leading-relaxed">
          {t("price_subtitle")}
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto text-left relative z-10">
        
        {/* Free Plan */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-12 flex flex-col justify-between border-white/5 bg-gradient-to-br from-white/[0.02] to-transparent hover:border-white/10 transition-all duration-500 group shadow-2xl"
        >
          <div>
            <div className="flex justify-between items-start mb-10">
               <div>
                  <h2 className="text-2xl font-black text-white mb-2 tracking-tight uppercase tracking-widest">{t("price_starter")}</h2>
                  <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">{t("price_starter_desc")}</p>
               </div>
               <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-gray-500 group-hover:text-white transition-colors">
                  <Globe2 size={24} />
               </div>
            </div>
            
            <div className="text-6xl font-black text-white mb-12 tracking-tighter">$0<span className="text-xl text-gray-700 font-black uppercase tracking-widest ml-2">/cycle</span></div>
            
            <ul className="space-y-6 mb-12 text-gray-400 text-xs font-bold uppercase tracking-widest">
              <li className="flex items-center gap-4">
                <div className="w-6 h-6 rounded-lg bg-green-500/10 flex items-center justify-center text-green-500"><Check size={14} /></div>
                <span>5 {t("price_searches")}</span>
              </li>
              <li className="flex items-center gap-4">
                <div className="w-6 h-6 rounded-lg bg-green-500/10 flex items-center justify-center text-green-500"><Check size={14} /></div>
                <span>{t("price_google")}</span>
              </li>
              <li className="flex items-center gap-4">
                <div className="w-6 h-6 rounded-lg bg-green-500/10 flex items-center justify-center text-green-500"><Check size={14} /></div>
                <span>3 {t("price_recs")}</span>
              </li>
              <li className="flex items-center gap-4 opacity-20">
                <div className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center"><X size={14} /></div>
                <span>{t("price_sent")}</span>
              </li>
              <li className="flex items-center gap-4 opacity-20">
                <div className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center"><X size={14} /></div>
                <span>{t("price_comp")}</span>
              </li>
            </ul>
          </div>
          <Link href="/dashboard" className="w-full py-5 px-4 text-center text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 border border-white/10 rounded-2xl hover:bg-white/5 hover:text-white transition-all duration-300">
            {t("price_free")}
          </Link>
        </motion.div>

        {/* Pro Plan */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-12 flex flex-col justify-between border-blue-500/30 bg-gradient-to-br from-blue-600/10 via-transparent to-indigo-600/5 relative overflow-hidden group shadow-[0_40px_100px_-20px_rgba(59,130,246,0.3)]"
        >
          <div className="absolute top-0 right-0 bg-blue-600 text-white text-[9px] font-black px-6 py-2 rounded-bl-3xl tracking-[0.3em] uppercase shadow-lg">
            {t("price_popular")}
          </div>
          
          <div>
            <div className="flex justify-between items-start mb-10">
               <div>
                  <h2 className="text-2xl font-black text-white mb-2 tracking-tight uppercase tracking-widest">{t("price_pro")}</h2>
                  <p className="text-blue-400/60 text-xs font-bold uppercase tracking-widest">{t("price_pro_desc")}</p>
               </div>
               <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center text-blue-500 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <Zap size={24} fill="currentColor" />
               </div>
            </div>

            <div className="text-6xl font-black text-white mb-12 tracking-tighter">$29<span className="text-xl text-blue-500/50 font-black uppercase tracking-widest ml-2">/cycle</span></div>
            
            <ul className="space-y-6 mb-12 text-gray-200 text-xs font-bold uppercase tracking-widest">
              <li className="flex items-center gap-4">
                <div className="w-6 h-6 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400"><Check size={14} /></div>
                <span>{t("price_unlimited")}</span>
              </li>
              <li className="flex items-center gap-4">
                <div className="w-6 h-6 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400"><Check size={14} /></div>
                <span>{t("price_adv_data")}</span>
              </li>
              <li className="flex items-center gap-4">
                <div className="w-6 h-6 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400"><Check size={14} /></div>
                <span>10 {t("price_recs")}</span>
              </li>
              <li className="flex items-center gap-4">
                <div className="w-6 h-6 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400"><Check size={14} /></div>
                <span>{t("price_sent")}</span>
              </li>
              <li className="flex items-center gap-4">
                <div className="w-6 h-6 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400"><Check size={14} /></div>
                <span>{t("price_comp")}</span>
              </li>
              <li className="flex items-center gap-4">
                <div className="w-6 h-6 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400"><Check size={14} /></div>
                <span>{t("price_export")}</span>
              </li>
            </ul>
          </div>
          
          <button className="w-full py-5 px-4 text-center text-[10px] font-black uppercase tracking-[0.3em] text-white bg-blue-600 hover:bg-blue-500 rounded-2xl shadow-2xl shadow-blue-600/40 transition-all duration-300 hover:-translate-y-1 active:translate-y-0 flex items-center justify-center gap-4 group">
            <Rocket size={18} className="group-hover:rotate-12 transition-transform" />
            {t("price_upgrade")}
          </button>
        </motion.div>
      </div>

      <div className="mt-20 flex items-center justify-center gap-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
         <div className="flex items-center gap-2 text-xs font-black text-white tracking-widest"><ShieldCheck size={14} /> SECURE GATEWAY</div>
         <div className="flex items-center gap-2 text-xs font-black text-white tracking-widest"><Zap size={14} /> INSTANCE NODE</div>
         <div className="flex items-center gap-2 text-xs font-black text-white tracking-widest"><ArrowRight size={14} /> P2P ENCRYPTION</div>
      </div>
    </div>
  );
}
