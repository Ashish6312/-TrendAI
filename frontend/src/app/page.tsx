"use client";

import Link from "next/link";
import { 
  ArrowRight, Search, MapPin, Zap, Rocket, 
  BarChart3, Globe2, ShieldCheck, Cpu, 
  Network, LineChart, Globe, Layers, 
  ArrowUpRight, Github, Twitter, Linkedin
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useSession, signIn } from "next-auth/react";

export default function Home() {
  const { t } = useLanguage();
  const router = useRouter();
  const { data: session } = useSession();

  const handleStartScan = () => {
    if (session) {
      router.push("/dashboard");
    } else {
      signIn("google", { callbackUrl: "/dashboard" });
    }
  };

  return (
    <div className="flex flex-col items-center bg-[#020617] selection:bg-blue-500/30 overflow-x-hidden">
      
      {/* 1. CINEMATIC HERO SECTION */}
      <section className="w-full relative min-h-screen flex flex-col items-center justify-center pt-32 pb-20 px-6 text-center">
        {/* Immersive Background */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/hero.png" 
            alt="Hero Background" 
            className="w-full h-full object-cover opacity-20 scale-110 blur-[2px] animate-pulse-slow"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/50 via-[#020617] to-[#020617]" />
          <div className="absolute inset-0 noise-bg" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto space-y-12">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-3 px-4 sm:px-6 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl"
          >
            <div className="flex -space-x-2">
              {[1,2,3].map(i => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-[#020617] shadow-lg overflow-hidden translate-y-[-2px]">
                  <img src={`https://i.pravatar.cc/100?img=${i+45}`} alt="User" />
                </div>
              ))}
            </div>
            <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-emerald-400 pl-2">
              UNCOVER PROFITABLE TERRITORIES
            </span>
          </motion.div>
          
          <div className="space-y-6">
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="text-5xl sm:text-7xl md:text-9xl font-black tracking-tighter text-white leading-none md:leading-[0.85]"
            >
              Architect Your <br className="hidden sm:block" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-500 to-blue-600 italic">Success.</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 1 }}
              className="text-xl md:text-3xl text-gray-500 max-w-3xl mx-auto font-medium leading-tight"
            >
              The advanced AI engine that predicts profitable business opportunities in any city across the globe.
            </motion.p>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-8 justify-center items-center"
          >
            <button 
              onClick={handleStartScan}
              className="h-20 px-16 rounded-[2.5rem] growth-gradient hover:scale-105 transition-all duration-700 shadow-[0_30px_60px_-15px_rgba(16,185,129,0.5)] hover:-translate-y-2 group active:scale-95 text-white text-[12px] font-black uppercase tracking-widest"
            >
              INVESTIGATE MARKET
              <ArrowRight className="inline-block ml-4 group-hover:translate-x-2 transition-transform" size={20} />
            </button>
            <Link href="/pricing" className="h-20 px-16 rounded-[2.5rem] bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 text-[12px] font-black uppercase tracking-widest transition-all duration-700 backdrop-blur-xl">
              ACCESS TIERS
            </Link>
          </motion.div>
        </div>

        {/* Floating Metrics */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-12 text-center opacity-40">
           <div className="space-y-1">
              <div className="text-2xl font-black text-white">$1.2B</div>
              <div className="text-[8px] font-black text-gray-600 tracking-[0.3em] uppercase">Value Generated</div>
           </div>
           <div className="h-10 w-px bg-white/10" />
           <div className="space-y-1">
              <div className="text-2xl font-black text-white">0.4s</div>
              <div className="text-[8px] font-black text-gray-600 tracking-[0.3em] uppercase">Scan Velocity</div>
           </div>
           <div className="h-10 w-px bg-white/10" />
           <div className="space-y-1">
              <div className="text-2xl font-black text-white">99.8%</div>
              <div className="text-[8px] font-black text-gray-600 tracking-[0.3em] uppercase">Neural Precision</div>
           </div>
        </div>
      </section>

      {/* 2. THE MARKET VISUALIZER */}
      <section className="w-full max-w-7xl mx-auto px-6 py-40">
        <div className="grid lg:grid-cols-2 gap-32 items-center">
           <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className="space-y-10"
           >
              <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-black text-emerald-500 tracking-[0.5em] uppercase">
                 <Globe2 size={16} /> DATA SYNCHRONIZATION
              </div>
              <h2 className="text-5xl md:text-8xl font-black text-white tracking-tighter leading-none">
                Smarter <span className="text-emerald-500 underline decoration-emerald-500/20 underline-offset-8 italic">Intelligence.</span> <br /> 
                <span className="text-gray-700">Faster Launch.</span>
              </h2>
              <p className="text-gray-500 text-xl md:text-2xl font-medium leading-relaxed">Most entrepreneurs guess. We provide the blueprint. TrendAI monitors live sentiment from social hubs and search trends to reveal what's actually missing in your city.</p>
              
              <div className="grid grid-cols-2 gap-8 pt-8">
                 <div className="p-8 rounded-[3rem] bg-white/[0.02] border border-white/5 space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-600/10 flex items-center justify-center text-emerald-500"><Network size={24} /></div>
                    <h4 className="text-lg font-black text-white">Global Nodes</h4>
                    <p className="text-xs text-gray-600 font-bold uppercase tracking-wider">Multilingual processing across 50+ regions.</p>
                 </div>
                 <div className="p-8 rounded-[3rem] bg-white/[0.02] border border-white/5 space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-amber-600/10 flex items-center justify-center text-amber-500"><Layers size={24} /></div>
                    <h4 className="text-lg font-black text-white">ROI Context</h4>
                    <p className="text-xs text-gray-600 font-bold uppercase tracking-wider">Sentiment-aware profit prediction and risk hedging.</p>
                 </div>
              </div>
           </motion.div>

           <motion.div 
            initial={{ opacity: 0, scale: 0.9, rotate: 5 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1.2 }}
            className="relative"
           >
              <div className="absolute -inset-10 bg-emerald-600/20 rounded-full blur-[120px] animate-pulse" />
              <img 
                src="/analysis.png" 
                alt="Market Visualization" 
                className="relative rounded-[4rem] border border-white/10 shadow-3xl transform -rotate-3 hover:rotate-0 transition-transform duration-700"
              />
              {/* Overlay Stat Card */}
              <div className="absolute -bottom-10 -left-10 glass-card p-10 space-y-3 border-emerald-500/30">
                 <div className="text-[10px] font-black text-emerald-500 tracking-[0.5em] uppercase">Scanned Area: NY_CTY</div>
                 <div className="text-4xl font-black text-white tracking-tighter">High Profit Signal</div>
                 <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: '85%' }}
                      transition={{ duration: 2, delay: 0.5 }}
                      className="h-full bg-emerald-600"
                    />
                 </div>
              </div>
           </motion.div>
        </div>
      </section>

      {/* 3. THE BLUEPRINT PROTOCOL */}
      <section className="w-full bg-[#050a1f] py-40">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-40 items-center">
           <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="order-2 md:order-1"
           >
              <img 
                src="/roadmap.png" 
                alt="Business Roadmap" 
                className="rounded-[4rem] border border-white/5 shadow-2xl"
              />
           </motion.div>
           
           <div className="order-1 md:order-2 space-y-12">
              <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-[10px] font-black text-amber-500 tracking-[0.5em] uppercase">
                 <Cpu size={16} /> THE ROADMAP PROTOCOL
              </div>
              <h2 className="text-5xl md:text-8xl font-black text-white tracking-tighter leading-none">
                From <span className="gold-text italic">Vision</span> <br /> 
                <span className="text-gray-700">To Execution.</span>
              </h2>
              <p className="text-gray-500 text-xl font-medium leading-relaxed">Once the AI identifies your niche, we generate a 6-month tactical roadmap. Every step from funding to market dominance is mapped out specifically for your coordinates.</p>
              
              <ul className="space-y-6">
                 {[
                    { title: "Territorial Insight", desc: "Hyper-local search demand & sentiment analysis." },
                    { title: "Capital Architecture", desc: "Funding requirements & ROI projections." },
                    { title: "Growth Milestones", desc: "Step-by-step actionable business directives." }
                 ].map((item, idx) => (
                    <li key={idx} className="flex gap-6 group">
                       <div className="w-12 h-12 bg-white/5 group-hover:bg-amber-600/20 rounded-full flex items-center justify-center shrink-0 border border-white/5 transition-all">
                          <Zap size={18} className="text-amber-600" />
                       </div>
                       <div>
                          <h4 className="text-xl font-black text-white uppercase tracking-tight">{item.title}</h4>
                          <p className="text-sm text-gray-500 font-medium">{item.desc}</p>
                       </div>
                    </li>
                 ))}
              </ul>
           </div>
        </div>
      </section>

      {/* 4. FINAL CTA */}
      <section className="w-full max-w-7xl mx-auto px-6 py-40">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="relative glass-card p-20 md:p-32 bg-gradient-to-br from-emerald-600/10 via-transparent to-amber-600/10 border-white/10 text-center space-y-12 overflow-hidden"
        >
          {/* Background Decorative Rings */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] border border-white/5 rounded-full pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] border border-white/5 rounded-full pointer-events-none" />

          <h2 className="text-5xl md:text-9xl font-black text-white tracking-tighter leading-none relative z-10">
            Secure Your <br /> <span className="text-emerald-500">Market Edge.</span>
          </h2>
          <p className="text-gray-500 text-2xl font-medium max-w-3xl mx-auto relative z-10 leading-relaxed">Join the next generation of data-driven founders. Start your free market scan today and see what the world is hiding from you.</p>
          
          <button 
            onClick={handleStartScan}
            className="relative z-10 h-24 px-20 rounded-[3rem] growth-gradient text-white text-[14px] font-black uppercase tracking-[0.5em] shadow-[0_40px_80px_-20px_rgba(16,185,129,0.5)] hover:-translate-y-3 hover:scale-105 transition-all duration-700 active:scale-95 group"
          >
             <Rocket size={24} className="inline-block mr-5 group-hover:rotate-12 transition-transform" />
             INITIATE PROTOCOL
          </button>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="w-full py-20 bg-black/40 border-t border-white/5">
         <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-12 text-center md:text-left">
            <div className="space-y-6">
               <div className="flex items-center gap-3 justify-center md:justify-start">
                  <div className="w-10 h-10 bg-gradient-to-tr from-emerald-600 to-teal-600 rounded-xl flex items-center justify-center">
                    <Zap className="text-white" size={20} fill="currentColor" />
                  </div>
                  <span className="text-2xl font-black text-white tracking-tighter italic">Trend<span className="text-emerald-500">AI</span></span>
               </div>
               <p className="text-gray-600 text-xs font-black uppercase tracking-widest max-w-xs leading-relaxed opacity-50">
                  Global Strategic Business Intelligence. <br /> Powered by Neural Regional Extraction.
               </p>
            </div>
            
            <div className="flex gap-16 text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">
               <div className="space-y-4">
                  <div className="text-white mb-6 underline underline-offset-8 decoration-white/20">NETWORK</div>
                  <div className="hover:text-emerald-500 cursor-pointer">Live Scanners</div>
                  <div className="hover:text-emerald-500 cursor-pointer">API Access</div>
               </div>
               <div className="space-y-4">
                  <div className="text-white mb-6 underline underline-offset-8 decoration-white/20">LEGAL</div>
                  <div className="hover:text-emerald-500 cursor-pointer">Security</div>
                  <div className="hover:text-emerald-500 cursor-pointer">Terms</div>
               </div>
            </div>
         </div>
      </footer>
    </div>
  );
}
