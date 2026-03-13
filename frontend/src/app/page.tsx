"use client";

import Link from "next/link";
import Image from "next/image";
import { 
  ArrowRight, Search, MapPin, Zap, Rocket, 
  BarChart3, ShieldCheck, Cpu, 
  Network, LineChart, Globe, Layers, 
  Github, Twitter, Linkedin,
  Target
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
    <div className="flex flex-col items-center bg-[#020617] selection:bg-blue-500/30">
      
      {/* 1. HERO SECTION */}
      <section className="w-full relative flex flex-col items-center justify-center min-h-screen px-6 pt-20 pb-12 text-center overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse delay-1000" />
          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150" />
          <div className="absolute inset-0 bg-grid-white/[0.02] [mask-image:radial-gradient(ellipse_at_center,black,transparent)]" />
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 inline-flex items-center gap-3 px-6 py-2 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl mb-12 shadow-[0_0_30px_rgba(59,130,246,0.1)]"
        >
          <div className="flex -space-x-2">
            {[1,2,3].map(i => (
              <div key={i} className="w-6 h-6 rounded-full border-2 border-[#020617] bg-gray-800 flex items-center justify-center overflow-hidden">
                <Image src={`https://i.pravatar.cc/100?img=${i+10}`} alt="User" width={24} height={24} unoptimized />
              </div>
            ))}
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.25em] text-blue-400">
            {t("hero_badge")}
          </span>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 text-5xl md:text-8xl font-black tracking-tighter mb-10 max-w-6xl text-white leading-[0.9] md:leading-[0.85]"
        >
          {t("hero_title_1")} <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600 drop-shadow-[0_0_30px_rgba(59,130,246,0.2)]">
            {t("hero_title_2")}
          </span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="relative z-10 text-xl md:text-2xl text-gray-400 max-w-3xl mb-14 font-medium leading-relaxed px-4"
        >
          {t("hero_subtitle")}
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="relative z-10 flex flex-col sm:flex-row gap-6 w-full sm:w-auto px-6"
        >
          <button 
            onClick={handleStartScan}
            className="h-16 inline-flex justify-center items-center px-12 text-xs font-black uppercase tracking-[0.25em] text-white rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 transition-all duration-500 shadow-[0_20px_40px_-10px_rgba(59,130,246,0.5)] hover:-translate-y-1 active:translate-y-0 active:scale-95 group"
          >
            {t("btn_start_scan")}
            <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <Link href="/pricing" className="h-16 inline-flex justify-center items-center px-12 text-xs font-black uppercase tracking-[0.25em] text-gray-300 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/10 hover:text-white transition-all duration-500 active:scale-95">
            {t("btn_pricing")}
          </Link>
        </motion.div>

        {/* Floating Intelligence Cards */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden hidden xl:block">
           <motion.div 
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[25%] left-[8%] glass-card p-6 border-blue-500/20 shadow-2xl"
           >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500"><LineChart size={20} /></div>
                <div>
                   <div className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Growth Vector</div>
                   <div className="text-sm font-black text-white">+84.2% AI Signal</div>
                </div>
              </div>
           </motion.div>

           <motion.div 
            animate={{ y: [0, 20, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-[20%] right-[10%] glass-card p-6 border-indigo-500/20 shadow-2xl"
           >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500"><Network size={20} /></div>
                <div>
                   <div className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Global Nodes</div>
                   <div className="text-sm font-black text-white">1.2M Scanned</div>
                </div>
              </div>
           </motion.div>
        </div>
      </section>

      {/* 2. LOGO CLOUD (TRUST SIGNALS) */}
      <section className="w-full py-20 border-y border-white/5 bg-black/20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-[10px] font-black text-gray-600 uppercase tracking-[0.5em] mb-12">Empowering Digital Entrepreneurs Globally</p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
             <div className="flex items-center gap-2 text-2xl font-black text-white tracking-tighter"><Globe size={24} /> NEXUS</div>
             <div className="flex items-center gap-2 text-2xl font-black text-white tracking-tighter"><Cpu size={24} /> CORE</div>
             <div className="flex items-center gap-2 text-2xl font-black text-white tracking-tighter"><Zap size={24} fill="white" /> VELOCITY</div>
             <div className="flex items-center gap-2 text-2xl font-black text-white tracking-tighter"><ShieldCheck size={24} /> SECURE</div>
             <div className="flex items-center gap-2 text-2xl font-black text-white tracking-tighter"><Layers size={24} /> STACK</div>
          </div>
        </div>
      </section>

      {/* 3. FEATURE PIPELINE */}
      <section className="w-full max-w-7xl px-6 py-40 mx-auto relative">
        <div className="text-center mb-32 space-y-6">
          <div className="text-blue-500 text-[10px] font-black uppercase tracking-[0.5em]">{t("feat_title")}</div>
          <h2 className="text-5xl md:text-7xl font-black mb-8 text-white tracking-tighter leading-none">
            {t("feat_1_title").split(' ')[0]} <span className="text-blue-600">Protocol</span>
          </h2>
          <p className="text-gray-500 max-w-3xl mx-auto text-xl font-medium leading-relaxed">{t("feat_subtitle")}</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-10 relative">
          {/* Connecting Line */}
          <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-y-1/2 z-0 hidden md:block" />
          
          <motion.div 
            whileHover={{ y: -15 }}
            className="glass-card p-12 group bg-gradient-to-br from-white/[0.04] to-transparent border-white/5 card-hover z-10"
          >
            <div className="w-16 h-16 bg-blue-500/10 rounded-[2rem] flex items-center justify-center mb-10 text-blue-500 group-hover:scale-110 transition-all duration-500 group-hover:bg-blue-600 group-hover:text-white group-hover:shadow-[0_0_30px_rgba(37,99,235,0.4)]">
              <MapPin size={32} />
            </div>
            <h3 className="text-3xl font-black mb-6 text-white tracking-tight">{t("feat_1_title")}</h3>
            <p className="text-gray-500 text-lg leading-relaxed font-medium mb-8">{t("feat_1_desc")}</p>
            <div className="pt-8 border-t border-white/5 flex items-center gap-2 text-[10px] font-black text-blue-500 tracking-widest uppercase">
              PHASE 01 <ArrowRight size={14} />
            </div>
          </motion.div>
          
          <motion.div 
            whileHover={{ y: -15 }}
            className="glass-card p-12 group bg-gradient-to-br from-white/[0.04] to-transparent border-white/5 card-hover z-10"
          >
            <div className="w-16 h-16 bg-indigo-500/10 rounded-[2rem] flex items-center justify-center mb-10 text-indigo-500 group-hover:scale-110 transition-all duration-500 group-hover:bg-indigo-600 group-hover:text-white group-hover:shadow-[0_0_30px_rgba(79,70,229,0.4)]">
              <Search size={32} />
            </div>
            <h3 className="text-3xl font-black mb-6 text-white tracking-tight">{t("feat_2_title")}</h3>
            <p className="text-gray-500 text-lg leading-relaxed font-medium mb-8">{t("feat_2_desc")}</p>
            <div className="pt-8 border-t border-white/5 flex items-center gap-2 text-[10px] font-black text-indigo-500 tracking-widest uppercase">
              PHASE 02 <ArrowRight size={14} />
            </div>
          </motion.div>
          
          <motion.div 
            whileHover={{ y: -15 }}
            className="glass-card p-12 group bg-gradient-to-br from-white/[0.04] to-transparent border-white/5 card-hover z-10"
          >
            <div className="w-16 h-16 bg-purple-500/10 rounded-[2rem] flex items-center justify-center mb-10 text-purple-500 group-hover:scale-110 transition-all duration-500 group-hover:bg-purple-600 group-hover:text-white group-hover:shadow-[0_0_30px_rgba(147,51,234,0.4)]">
              <Zap size={32} fill="currentColor" />
            </div>
            <h3 className="text-3xl font-black mb-6 text-white tracking-tight">{t("feat_3_title")}</h3>
            <p className="text-gray-500 text-lg leading-relaxed font-medium mb-8">{t("feat_3_desc")}</p>
            <div className="pt-8 border-t border-white/5 flex items-center gap-2 text-[10px] font-black text-purple-500 tracking-widest uppercase">
              PHASE 03 <ArrowRight size={14} />
            </div>
          </motion.div>
        </div>
      </section>

      {/* 4. STATISTICS SECTION */}
      <section className="w-full py-40 relative overflow-hidden bg-white/[0.01]">
         <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 text-center">
            <div className="space-y-2">
               <div className="text-5xl font-black text-white tracking-tighter">12.8M</div>
               <div className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em]">Data Points Scanned</div>
            </div>
            <div className="space-y-2">
               <div className="text-5xl font-black text-white tracking-tighter">150+</div>
               <div className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em]">Cities Analyzed</div>
            </div>
            <div className="space-y-2">
               <div className="text-5xl font-black text-white tracking-tighter">94%</div>
               <div className="text-[10px] font-black text-purple-500 uppercase tracking-[0.3em]">Prediction Accuracy</div>
            </div>
            <div className="space-y-2">
               <div className="text-5xl font-black text-white tracking-tighter">5.2K</div>
               <div className="text-[10px] font-black text-green-500 uppercase tracking-[0.3em]">Successful Launches</div>
            </div>
         </div>
         <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
         <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      </section>

      {/* 5.5 INTELLIGENCE VISUALIZATION - HIGHER FIDELITY */}
      <section className="w-full relative py-32 overflow-hidden bg-[#020617]">
        {/* Section Background Neural Mesh */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/5 rounded-full blur-[150px]" />
          <div className="absolute inset-0 bg-grid-white/[0.015] [mask-image:radial-gradient(ellipse_at_center,black,transparent)]" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-24 space-y-6"
          >
            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20">
               <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
               <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.4em]">{t("dash_ai_insights")}</span>
            </div>
            <h2 className="text-5xl md:text-8xl font-black text-white tracking-tighter leading-none">
              Neural <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-600">Reconnaissance</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            {/* Visual 1: Intelligence Scan */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, rotateY: -10 }}
              whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="relative group perspective-1000"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-[3rem] blur-xl opacity-20 group-hover:opacity-50 transition-all duration-700" />
              
              <div className="relative glass-card p-2 bg-white/5 border-white/20 backdrop-blur-3xl overflow-hidden rounded-[2.8rem] shadow-2xl">
                {/* Scanline Effect */}
                <motion.div 
                  animate={{ top: ["-10%", "110%"] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-400 to-transparent z-20 opacity-50 shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                />
                
                <motion.div
                  animate={{ 
                    scale: [1, 1.02, 1],
                    filter: ["brightness(1)", "brightness(1.1)", "brightness(1)"]
                  }}
                  transition={{ duration: 8, repeat: Infinity }}
                >
                  <Image 
                    src="/intel-visualization-1.jpg" 
                    alt="Neural Scan Visualization" 
                    width={800}
                    height={500}
                    className="w-full h-auto rounded-[2.4rem] brightness-75 group-hover:brightness-100 transition-all duration-1000 transform-gpu"
                  />
                </motion.div>

                {/* Floating HUD Elements */}
                <div className="absolute top-8 left-8 flex flex-col gap-2">
                   <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-black/60 border border-white/10 text-[8px] font-black text-blue-400 backdrop-blur-md uppercase tracking-widest">
                      <Search size={10} /> Scoping_Perimeter: 98.4%
                   </div>
                   <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-black/60 border border-white/10 text-[8px] font-black text-indigo-400 backdrop-blur-md uppercase tracking-widest">
                      <Target size={10} /> Neural_Lock: ACTIVE
                   </div>
                </div>
              </div>

              {/* Orbital Element */}
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -top-10 -right-10 w-40 h-40 border border-blue-500/20 rounded-full border-dashed z-0"
              />
            </motion.div>

            {/* Visual 2: Data Topology */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, rotateY: 10 }}
              whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
              className="relative group lg:mt-32 perspective-1000"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-[3rem] blur-xl opacity-20 group-hover:opacity-50 transition-all duration-700" />
              
              <div className="relative glass-card p-2 bg-white/5 border-white/20 backdrop-blur-3xl overflow-hidden rounded-[2.8rem] shadow-2xl">
                <motion.div
                  animate={{ 
                    y: [0, -10, 0],
                    rotateZ: [0, 1, 0]
                  }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Image 
                    src="/intel-visualization-2.jpg" 
                    alt="Network Topology Visualization" 
                    width={800}
                    height={500}
                    className="w-full h-auto rounded-2xl shadow-2xl brightness-90 group-hover:brightness-110 transition-all duration-700"
                  />
                </motion.div>

                {/* Data Stream Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-600/5 to-transparent pointer-events-none" />
              </div>

              {/* Tech Stats Card Overlay */}
              <motion.div 
                initial={{ x: 50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                className="absolute -bottom-10 -left-10 glass-card p-8 bg-[#020617]/90 border-indigo-500/30 backdrop-blur-xl z-20 border-l-[4px] border-l-indigo-600"
              >
                 <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600/20 flex items-center justify-center text-indigo-400">
                       <BarChart3 size={20} />
                    </div>
                    <div>
                       <div className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Processing Data</div>
                       <div className="text-sm font-black text-white italic">1.2B Intelligence Nodes</div>
                    </div>
                 </div>
                 <div className="space-y-2">
                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                       <motion.div 
                        animate={{ width: ["0%", "85%", "40%", "95%"] }}
                        transition={{ duration: 5, repeat: Infinity }}
                        className="h-full bg-indigo-500" 
                       />
                    </div>
                    <div className="flex justify-between text-[8px] font-black text-gray-600 uppercase tracking-tighter">
                       <span>Synthesis</span>
                       <span>95% Optimal</span>
                    </div>
                 </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 6. BOTTOM CTA BANNER */}
      <section className="w-full max-w-7xl px-6 pb-40 mx-auto">        {/* Bottom Banner */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-32 glass-card p-16 md:p-24 bg-gradient-to-br from-blue-600/10 via-transparent to-indigo-600/10 border-white/10 text-center relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-12 opacity-5 rotate-12"><Zap size={240} fill="white" /></div>
          <h3 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tighter leading-none">{t("banner_title")}</h3>
          <p className="text-gray-400 text-xl md:text-2xl mb-14 max-w-2xl mx-auto font-medium leading-relaxed">{t("banner_desc")}</p>
          <button 
            onClick={handleStartScan}
            className="h-20 inline-flex justify-center items-center px-16 text-xs font-black uppercase tracking-[0.4em] text-white rounded-3xl bg-[#2563eb] hover:bg-[#3b82f6] transition-all duration-500 shadow-[0_20px_50px_-10px_rgba(37,99,235,0.5)] hover:-translate-y-1 active:translate-y-0 active:scale-95 group"
          >
             <Rocket size={24} className="mr-4 group-hover:rotate-12 transition-transform" />
             {t("banner_btn")}
          </button>
        </motion.div>
      </section>

      {/* 7. DETAILED FOOTER */}
      <footer className="w-full bg-black/40 border-t border-white/5 pt-24 pb-12 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-16 mb-24">
            <div className="col-span-2 space-y-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Zap className="text-white" size={20} fill="currentColor" />
                </div>
                <span className="text-2xl font-black text-white tracking-tighter">Trend<span className="text-blue-500">AI</span></span>
              </div>
              <p className="text-gray-400 text-sm font-medium leading-relaxed max-w-xs">
                Architecting the future of territorial entrepreneurship through advanced neural market extraction.
              </p>
              <div className="flex items-center gap-4 text-gray-500">
                <Github size={20} className="hover:text-white transition-colors cursor-pointer" />
                <Twitter size={20} className="hover:text-white transition-colors cursor-pointer" />
                <Linkedin size={20} className="hover:text-white transition-colors cursor-pointer" />
              </div>
            </div>

            <div className="space-y-6">
              <h4 className="text-[10px] font-black text-white uppercase tracking-[0.5em]">Terminal</h4>
              <ul className="space-y-4 text-xs font-bold text-gray-500 uppercase tracking-widest">
                <li onClick={() => router.push('/dashboard')} className="hover:text-blue-500 transition-colors cursor-pointer">Live Scanners</li>
                <li onClick={() => router.push('/dashboard')} className="hover:text-blue-500 transition-colors cursor-pointer">Neural Engine</li>
                <li onClick={() => router.push('/dashboard')} className="hover:text-blue-500 transition-colors cursor-pointer">Territories</li>
                <li onClick={() => router.push('/pricing')} className="hover:text-blue-500 transition-colors cursor-pointer">Pricing</li>
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="text-[10px] font-black text-white uppercase tracking-[0.5em]">Company</h4>
              <ul className="space-y-4 text-xs font-bold text-gray-500 uppercase tracking-widest">
                <li onClick={() => router.push('/dashboard')} className="hover:text-blue-500 transition-colors cursor-pointer">Protocol</li>
                <li onClick={() => router.push('/dashboard')} className="hover:text-blue-500 transition-colors cursor-pointer">Security</li>
                <li onClick={() => router.push('/dashboard')} className="hover:text-blue-500 transition-colors cursor-pointer">Network</li>
                <li onClick={() => router.push('/dashboard')} className="hover:text-blue-500 transition-colors cursor-pointer">About</li>
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="text-[10px] font-black text-white uppercase tracking-[0.5em]">Legal</h4>
              <ul className="space-y-4 text-xs font-bold text-gray-500 uppercase tracking-widest">
                <li onClick={() => router.push('/dashboard')} className="hover:text-blue-500 transition-colors cursor-pointer">Terms</li>
                <li onClick={() => router.push('/dashboard')} className="hover:text-blue-500 transition-colors cursor-pointer">Privacy</li>
                <li onClick={() => router.push('/dashboard')} className="hover:text-blue-500 transition-colors cursor-pointer">License</li>
                <li onClick={() => router.push('/dashboard')} className="hover:text-blue-500 transition-colors cursor-pointer">Settings</li>
              </ul>
            </div>
          </div>

          <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-[10px] font-black text-gray-700 uppercase tracking-[0.3em]">© 2026 TrendAI Neural Intelligence Protocol. All Rights Reserved.</p>
            <div className="flex items-center gap-6 text-[10px] font-black text-gray-700 uppercase tracking-[0.3em]">
               <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> GRID STATUS: OPTIMAL</div>
               <div className="flex items-center gap-2">REGION: 0x84f_INTL</div>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
