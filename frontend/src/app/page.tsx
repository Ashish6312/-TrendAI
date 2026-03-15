"use client";

import Link from "next/link";
import { 
  ArrowRight, Zap, Rocket, 
  Globe2, Cpu, 
  Network, Layers
} from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function Home() {
  const router = useRouter();
  const { data: session } = useSession();

  const handleStartScan = () => {
    if (session) {
      router.push("/dashboard");
    } else {
      router.push("/auth");
    }
  };

  return (
    <div className="flex flex-col items-center bg-[var(--background)] selection:bg-blue-500/30 overflow-x-hidden">
      
      {/* 1. CINEMATIC HERO SECTION */}
      <section className="w-full relative min-h-screen flex flex-col items-center justify-center pt-20 sm:pt-24 lg:pt-32 pb-12 sm:pb-16 lg:pb-20 px-4 sm:px-6 text-center">
        {/* Immersive Background */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/hero.png" 
            alt="Hero Background" 
            className="w-full h-full object-cover opacity-20 scale-110 blur-[2px] animate-pulse-slow"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/50 via-white to-white dark:from-[#020617]/50 dark:via-[#020617] dark:to-[#020617]" />
          <div className="absolute inset-0 noise-bg" />
        </div>

        <div className="relative z-10 responsive-container space-y-8 sm:space-y-10 lg:space-y-12">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 sm:gap-3 px-3 sm:px-4 lg:px-6 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl"
          >
            <div className="flex -space-x-1 sm:-space-x-2">
              {[1,2,3].map(i => (
                <div key={i} className="w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 border-white dark:border-[#020617] shadow-lg overflow-hidden translate-y-[-2px]">
                  <img src={`https://i.pravatar.cc/100?img=${i+45}`} alt="User" />
                </div>
              ))}
            </div>
            <span className="responsive-text-xs font-black uppercase tracking-widest text-emerald-400 pl-1 sm:pl-2">
              <span className="hidden sm:inline">FIND PROFITABLE BUSINESS IDEAS</span>
              <span className="sm:hidden">PROFITABLE IDEAS</span>
            </span>
          </motion.div>
          
          <div className="space-y-4 sm:space-y-6">
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="responsive-text-4xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-black tracking-tighter text-white leading-none"
            >
              Architect Your <br className="hidden sm:block" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-500 to-blue-600 italic">Success.</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 1 }}
              className="responsive-text-lg sm:text-xl lg:text-2xl xl:text-3xl text-gray-500 max-w-3xl mx-auto font-medium leading-tight px-4"
            >
              The advanced AI engine that predicts profitable business opportunities in any city across the globe.
            </motion.p>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 sm:gap-6 lg:gap-8 justify-center items-center px-4"
          >
            <button 
              onClick={handleStartScan}
              className="w-full sm:w-auto h-16 sm:h-18 lg:h-20 px-8 sm:px-12 lg:px-16 rounded-2xl sm:rounded-[2.5rem] growth-gradient hover:scale-105 transition-all duration-700 shadow-[0_30px_60px_-15px_rgba(16,185,129,0.5)] hover:-translate-y-2 group active:scale-95 text-white responsive-text-xs font-black uppercase tracking-widest"
            >
              <span className="hidden sm:inline">START ANALYSIS</span>
              <span className="sm:hidden">START ANALYSIS</span>
              <ArrowRight className="inline-block ml-2 sm:ml-4 group-hover:translate-x-2 transition-transform" size={16} />
            </button>
            <Link href="/acquisition-tiers" className="w-full sm:w-auto h-16 sm:h-18 lg:h-20 px-8 sm:px-12 lg:px-16 rounded-2xl sm:rounded-[2.5rem] bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 responsive-text-xs font-black uppercase tracking-widest transition-all duration-700 backdrop-blur-xl flex items-center justify-center">
              <span className="hidden sm:inline">ACQUISITION TIERS</span>
              <span className="sm:hidden">VIEW PLANS</span>
            </Link>
          </motion.div>
        </div>

        {/* Floating Metrics */}
        <div className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 flex gap-8 md:gap-12 text-center opacity-40">
           <div className="space-y-1">
              <div className="responsive-text-lg md:responsive-text-2xl font-black text-white">$1.2B</div>
              <div className="text-[7px] md:text-[8px] font-black text-gray-600 tracking-[0.3em] uppercase">Value Generated</div>
           </div>
           <div className="h-8 md:h-10 w-px bg-white/10" />
           <div className="space-y-1">
              <div className="responsive-text-lg md:responsive-text-2xl font-black text-white">0.4s</div>
              <div className="text-[7px] md:text-[8px] font-black text-gray-600 tracking-[0.3em] uppercase">Analysis Speed</div>
           </div>
           <div className="h-8 md:h-10 w-px bg-white/10" />
           <div className="space-y-1">
              <div className="responsive-text-lg md:responsive-text-2xl font-black text-white">99.8%</div>
              <div className="text-[7px] md:text-[8px] font-black text-gray-600 tracking-[0.3em] uppercase">AI Accuracy</div>
           </div>
        </div>
      </section>

      {/* 2. THE MARKET VISUALIZER */}
      <section className="w-full responsive-container py-20 md:py-32 lg:py-40">
        <div className="grid lg:grid-cols-2 gap-16 md:gap-24 lg:gap-32 items-center">
           <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className="space-y-6 md:space-y-8 lg:space-y-10"
           >
              <div className="inline-flex items-center gap-2 md:gap-3 px-3 md:px-5 py-1.5 md:py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 responsive-text-xs font-black text-emerald-500 tracking-[0.5em] uppercase">
                 <Globe2 size={14} className="md:w-4 md:h-4" /> DATA SYNCHRONIZATION
              </div>
              <h2 className="responsive-text-3xl md:responsive-text-5xl lg:text-8xl font-black text-white tracking-tighter leading-none">
                Smarter <span className="text-emerald-500 underline decoration-emerald-500/20 underline-offset-8 italic">Intelligence.</span> <br /> 
                <span className="text-gray-700">Faster Launch.</span>
              </h2>
              <p className="text-gray-500 responsive-text-lg md:responsive-text-xl lg:text-2xl font-medium leading-relaxed">Most entrepreneurs guess. We provide the blueprint. TrendAI monitors live sentiment from social hubs and search trends to reveal what's actually missing in your city.</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 pt-6 md:pt-8">
                  <div className="p-6 md:p-8 rounded-2xl md:rounded-[3rem] bg-white/[0.02] border border-white/5 space-y-3 md:space-y-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-emerald-600/10 flex items-center justify-center text-emerald-500"><Network size={20} className="md:w-6 md:h-6" /></div>
                    <h4 className="responsive-text-lg font-black text-white">Global Reach</h4>
                    <p className="responsive-text-xs text-gray-600 font-bold uppercase tracking-wider">Analyze data in multiple languages and regions.</p>
                 </div>
                 <div className="p-6 md:p-8 rounded-2xl md:rounded-[3rem] bg-white/[0.02] border border-white/5 space-y-3 md:space-y-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-amber-600/10 flex items-center justify-center text-amber-500"><Layers size={20} className="md:w-6 md:h-6" /></div>
                    <h4 className="responsive-text-lg font-black text-white">Profit Focus</h4>
                    <p className="responsive-text-xs text-gray-600 font-bold uppercase tracking-wider">AI-driven profit predictions to reduce risk.</p>
                 </div>
              </div>
           </motion.div>

           <motion.div 
            initial={{ opacity: 0, scale: 0.9, rotate: 5 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1.2 }}
            className="relative"
           >
              <div className="absolute -inset-6 md:-inset-10 bg-emerald-600/20 rounded-full blur-[120px] animate-pulse" />
              <img 
                src="/analysis.png" 
                alt="Market Visualization" 
                className="relative rounded-2xl md:rounded-[4rem] border border-white/10 shadow-3xl transform -rotate-3 hover:rotate-0 transition-transform duration-700 w-full"
              />
              {/* Overlay Stat Card */}
              <div className="absolute -bottom-6 -left-6 md:-bottom-10 md:-left-10 glass-card p-6 md:p-10 space-y-2 md:space-y-3 border-emerald-500/30">
                 <div className="responsive-text-xs font-black text-emerald-500 tracking-[0.5em] uppercase">Scanned Area: NY_CTY</div>
                 <div className="responsive-text-2xl md:responsive-text-4xl font-black text-white tracking-tighter">High Profit Signal</div>
                 <div className="h-1 md:h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
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
      <section className="w-full bg-[#050a1f] py-20 md:py-32 lg:py-40">
        <div className="responsive-container grid md:grid-cols-2 gap-16 md:gap-24 lg:gap-40 items-center">
           <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="order-2 md:order-1"
           >
              <img 
                src="/roadmap.png" 
                alt="Business Roadmap" 
                className="rounded-2xl md:rounded-[4rem] border border-white/5 shadow-2xl w-full"
              />
           </motion.div>
           
           <div className="order-1 md:order-2 space-y-8 md:space-y-10 lg:space-y-12">
              <div className="inline-flex items-center gap-2 md:gap-3 px-3 md:px-5 py-1.5 md:py-2 rounded-full bg-amber-500/10 border border-amber-500/20 responsive-text-xs font-black text-amber-500 tracking-[0.5em] uppercase">
                 <Cpu size={14} className="md:w-4 md:h-4" /> YOUR BUSINESS ROADMAP
              </div>
              <h2 className="responsive-text-3xl md:responsive-text-5xl lg:text-8xl font-black text-white tracking-tighter leading-none">
                From <span className="gold-text italic">Idea</span> <br /> 
                <span className="text-gray-700">To Reality.</span>
              </h2>
              <p className="text-gray-500 responsive-text-lg md:responsive-text-xl font-medium leading-relaxed">Once the AI identifies your niche, we generate a 6-month tactical roadmap. Every step from funding to market dominance is mapped out specifically for your coordinates.</p>
              
              <ul className="space-y-4 md:space-y-6">
                 {[
                    { title: "Local Insights", desc: "Understand local search demand and market needs." },
                    { title: "Funding Guide", desc: "Clear funding requirements and profit projections." },
                    { title: "Growth Steps", desc: "Step-by-step actionable business instructions." }
                 ].map((item, idx) => (
                    <li key={idx} className="flex gap-4 md:gap-6 group">
                       <div className="w-10 h-10 md:w-12 md:h-12 bg-white/5 group-hover:bg-amber-600/20 rounded-full flex items-center justify-center shrink-0 border border-white/5 transition-all">
                          <Zap size={16} className="md:w-[18px] md:h-[18px] text-amber-600" />
                       </div>
                       <div>
                          <h4 className="responsive-text-lg md:responsive-text-xl font-black text-white uppercase tracking-tight">{item.title}</h4>
                          <p className="responsive-text-sm text-gray-500 font-medium">{item.desc}</p>
                       </div>
                    </li>
                 ))}
              </ul>
           </div>
        </div>
      </section>

      {/* 4. FINAL CTA */}
      <section className="w-full responsive-container py-20 md:py-32 lg:py-40">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="relative glass-card responsive-p-lg md:responsive-p-xl bg-gradient-to-br from-emerald-600/10 via-transparent to-amber-600/10 border-white/10 text-center space-y-8 md:space-y-10 lg:space-y-12 overflow-hidden"
        >
          {/* Background Decorative Rings */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] md:w-[800px] lg:w-[1000px] h-[600px] md:h-[800px] lg:h-[1000px] border border-white/5 rounded-full pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] md:w-[500px] lg:w-[700px] h-[400px] md:h-[500px] lg:h-[700px] border border-white/5 rounded-full pointer-events-none" />

          <h2 className="responsive-text-3xl md:responsive-text-5xl lg:text-9xl font-black text-white tracking-tighter leading-none relative z-10">
            Secure Your <br /> <span className="text-emerald-500">Market Edge.</span>
          </h2>
          <p className="text-gray-500 responsive-text-lg md:responsive-text-xl lg:text-2xl font-medium max-w-3xl mx-auto relative z-10 leading-relaxed px-4">Join the next generation of data-driven founders. Start your free market scan today and see what the world is hiding from you.</p>
          
          <button 
            onClick={handleStartScan}
            className="relative z-10 h-16 md:h-20 lg:h-24 px-12 md:px-16 lg:px-20 rounded-2xl md:rounded-[2.5rem] lg:rounded-[3rem] growth-gradient text-white responsive-text-xs md:text-[14px] font-black uppercase tracking-[0.5em] shadow-[0_40px_80px_-20px_rgba(16,185,129,0.5)] hover:-translate-y-3 hover:scale-105 transition-all duration-700 active:scale-95 group"
          >
             <Rocket size={20} className="md:w-6 md:h-6 inline-block mr-3 md:mr-5 group-hover:rotate-12 transition-transform" />
             START NOW
          </button>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="w-full py-12 md:py-16 lg:py-20 bg-black/40 border-t border-white/5">
         <div className="responsive-container flex flex-col md:flex-row justify-between items-center gap-8 md:gap-12 text-center md:text-left">
            <div className="space-y-4 md:space-y-6">
               <div className="flex items-center gap-2 md:gap-3 justify-center md:justify-start">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-tr from-emerald-600 to-teal-600 rounded-lg md:rounded-xl flex items-center justify-center">
                    <Zap className="text-white md:w-5 md:h-5" size={16} fill="currentColor" />
                  </div>
                  <span className="responsive-text-xl md:responsive-text-2xl font-black text-white tracking-tighter italic">Trend<span className="text-emerald-500">AI</span></span>
               </div>
               <p className="text-gray-600 responsive-text-xs font-black uppercase tracking-widest max-w-xs leading-relaxed opacity-50">
                  Global Strategic Business Intelligence. <br /> Powered by advanced AI technology.
               </p>
            </div>
            
            <div className="flex gap-12 md:gap-16 responsive-text-xs font-black text-gray-500 uppercase tracking-[0.3em]">
               <div className="space-y-3 md:space-y-4">
                  <div className="text-white mb-4 md:mb-6 underline underline-offset-8 decoration-white/20">NETWORK</div>
                  <div className="hover:text-emerald-500 cursor-pointer">Live Scanners</div>
                  <div className="hover:text-emerald-500 cursor-pointer">API Access</div>
               </div>
               <div className="space-y-3 md:space-y-4">
                  <div className="text-white mb-4 md:mb-6 underline underline-offset-8 decoration-white/20">LEGAL</div>
                  <div className="hover:text-emerald-500 cursor-pointer">Security</div>
                  <div className="hover:text-emerald-500 cursor-pointer">Terms</div>
               </div>
            </div>
         </div>
      </footer>
    </div>
  );
}
