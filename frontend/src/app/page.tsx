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
      
      {/* 1. WELCOME SECTION */}
      <section className="w-full relative min-h-screen flex flex-col items-center justify-center pt-20 sm:pt-24 lg:pt-32 pb-12 sm:pb-16 lg:pb-20 px-4 sm:px-6 text-center">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/hero_light.png" 
            alt="Welcome Background Light" 
            className="block dark:hidden w-full h-full object-cover opacity-40 scale-110 blur-[2px] animate-pulse-slow"
          />
          <img 
            src="/hero_dark.png" 
            alt="Welcome Background Dark" 
            className="hidden dark:block w-full h-full object-cover opacity-20 scale-110 blur-[2px] animate-pulse-slow"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-50/80 via-white/40 to-white dark:from-[#020617]/50 dark:via-[#020617] dark:to-[#020617]" />
          <div className="absolute inset-0 noise-bg opacity-30 dark:opacity-10" />
        </div>

        <div className="relative z-10 responsive-container space-y-8 sm:space-y-10 lg:space-y-12">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 sm:gap-3 px-3 sm:px-4 lg:px-6 py-2 rounded-full bg-slate-900/5 dark:bg-white/5 border border-slate-900/10 dark:border-white/10 backdrop-blur-xl shadow-sm dark:shadow-2xl"
          >
            <div className="flex -space-x-1 sm:-space-x-2">
              {[1,2,3].map(i => (
                <div key={i} className="w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 border-white dark:border-slate-900 shadow-lg overflow-hidden translate-y-[-2px]">
                  <img src={`https://i.pravatar.cc/100?img=${i+45}`} alt="User" />
                </div>
              ))}
            </div>
            <span className="responsive-text-xs font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 pl-1 sm:pl-2">
              <span className="hidden sm:inline">SMART BUSINESS FINDER</span>
              <span className="sm:hidden">BUSINESS FINDER</span>
            </span>
          </motion.div>
          
          <div className="space-y-4 sm:space-y-6">
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="responsive-text-4xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-black tracking-tighter text-slate-900 dark:text-white leading-none"
            >
              Find Your Next <br className="hidden sm:block" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-700 dark:from-emerald-400 dark:via-teal-500 dark:to-blue-600 italic">Business Idea.</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 1 }}
              className="responsive-text-lg sm:text-xl lg:text-2xl xl:text-3xl text-slate-500 dark:text-gray-400 max-w-3xl mx-auto font-medium leading-tight px-4"
            >
              Use AI to find high-profit business opportunities by analyzing what's missing in your local market.
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
              START NOW
              <ArrowRight className="inline-block ml-2 sm:ml-4 group-hover:translate-x-2 transition-transform" size={16} />
            </button>
            <Link href="/acquisition-tiers" className="w-full sm:w-auto h-16 sm:h-18 lg:h-20 px-8 sm:px-12 lg:px-16 rounded-2xl sm:rounded-[2.5rem] bg-slate-900/5 dark:bg-white/5 border border-slate-900/10 dark:border-white/10 text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white responsive-text-xs font-black uppercase tracking-widest transition-all duration-700 backdrop-blur-xl flex items-center justify-center">
              VIEW PLANS
            </Link>
          </motion.div>
        </div>

        {/* Floating Metrics */}
        <div className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 flex gap-8 md:gap-12 text-center opacity-70">
           <div className="space-y-1">
              <div className="responsive-text-lg md:responsive-text-2xl font-black text-slate-900 dark:text-white">$1.2B</div>
              <div className="text-[7px] md:text-[8px] font-black text-slate-500 dark:text-gray-600 tracking-[0.3em] uppercase">Money Made</div>
           </div>
           <div className="h-8 md:h-10 w-px bg-slate-900/10 dark:bg-white/10" />
           <div className="space-y-1">
              <div className="responsive-text-lg md:responsive-text-2xl font-black text-slate-900 dark:text-white">0.4s</div>
              <div className="text-[7px] md:text-[8px] font-black text-slate-500 dark:text-gray-600 tracking-[0.3em] uppercase">Search Speed</div>
           </div>
           <div className="h-8 md:h-10 w-px bg-slate-900/10 dark:bg-white/10" />
           <div className="space-y-1">
              <div className="responsive-text-lg md:responsive-text-2xl font-black text-slate-900 dark:text-white">99.8%</div>
              <div className="text-[7px] md:text-[8px] font-black text-slate-500 dark:text-gray-600 tracking-[0.3em] uppercase">AI Accuracy</div>
           </div>
        </div>
      </section>

      {/* 2. THE MARKET TOOLS */}
      <section className="w-full responsive-container py-20 md:py-32 lg:py-40">
        <div className="grid lg:grid-cols-2 gap-16 md:gap-24 lg:gap-32 items-center">
           <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className="space-y-6 md:space-y-8 lg:space-y-10"
           >
              <div className="inline-flex items-center gap-2 md:gap-3 px-3 md:px-5 py-1.5 md:py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 responsive-text-xs font-black text-emerald-500 tracking-[0.5em] uppercase">
                 <Globe2 size={14} className="md:w-4 md:h-4" /> LIVE DATA
              </div>
              <h2 className="responsive-text-3xl md:responsive-text-5xl lg:text-8xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">
                Smarter <span className="text-emerald-600 underline decoration-emerald-500/20 underline-offset-8 italic">Data.</span> <br /> 
                <span className="text-slate-400 dark:text-gray-700">Faster Launch.</span>
              </h2>
              <p className="text-slate-500 dark:text-gray-500 responsive-text-lg md:responsive-text-xl lg:text-2xl font-medium leading-relaxed">Most people guess. We give you a plan. TrendAI looks at what people are searching for in your city to find what's missing.</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 pt-6 md:pt-8">
                  <div className="p-6 md:p-8 rounded-2xl md:rounded-[3rem] bg-slate-900/[0.03] dark:bg-white/[0.02] border border-slate-900/5 dark:border-white/5 space-y-3 md:space-y-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-emerald-600/10 flex items-center justify-center text-emerald-600 dark:text-emerald-500"><Network size={20} className="md:w-6 md:h-6" /></div>
                    <h4 className="responsive-text-lg font-black text-slate-900 dark:text-white">Global Reach</h4>
                    <p className="responsive-text-xs text-slate-500 dark:text-gray-600 font-bold uppercase tracking-wider">Search across different cities and regions easily.</p>
                 </div>
                 <div className="p-6 md:p-8 rounded-2xl md:rounded-[3rem] bg-slate-900/[0.03] dark:bg-white/[0.02] border border-slate-900/5 dark:border-white/5 space-y-3 md:space-y-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-amber-600/10 flex items-center justify-center text-amber-600 dark:text-amber-500"><Layers size={20} className="md:w-6 md:h-6" /></div>
                    <h4 className="responsive-text-lg font-black text-slate-900 dark:text-white">Profit Focus</h4>
                    <p className="responsive-text-xs text-slate-500 dark:text-gray-600 font-bold uppercase tracking-wider">Our AI predicts profits to help you lower risk.</p>
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
                alt="Market Results" 
                className="relative rounded-2xl md:rounded-[4rem] border border-white/10 shadow-3xl transform -rotate-3 hover:rotate-0 transition-transform duration-700 w-full"
              />
              {/* Overlay Stat Card */}
               <div className="absolute -bottom-6 -left-6 md:-bottom-10 md:-left-10 glass-card p-6 md:p-10 space-y-2 md:space-y-3 border-emerald-500/30">
                  <div className="responsive-text-xs font-black text-emerald-600 dark:text-emerald-500 tracking-[0.5em] uppercase">Scanned Area: NY</div>
                  <div className="responsive-text-2xl md:responsive-text-4xl font-black text-slate-900 dark:text-white tracking-tighter">Strong Profit Signal</div>
                  <div className="h-1 md:h-1.5 w-full bg-slate-900/10 dark:bg-white/10 rounded-full overflow-hidden">
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

      {/* 3. YOUR BUSINESS PLAN */}
      <section className="w-full bg-slate-50/50 dark:bg-[#050a1f] py-20 md:py-32 lg:py-40 border-y border-slate-200 dark:border-white/5 transition-colors duration-500">
        <div className="responsive-container grid md:grid-cols-2 gap-16 md:gap-24 lg:gap-40 items-center">
           <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="order-2 md:order-1"
           >
              <img 
                src="/roadmap.png" 
                alt="Business Plan" 
                className="rounded-2xl md:rounded-[4rem] border border-white/5 shadow-2xl w-full"
              />
           </motion.div>
           
           <div className="order-1 md:order-2 space-y-8 md:space-y-10 lg:space-y-12">
              <div className="inline-flex items-center gap-2 md:gap-3 px-3 md:px-5 py-1.5 md:py-2 rounded-full bg-amber-500/10 border border-amber-500/20 responsive-text-xs font-black text-amber-500 tracking-[0.5em] uppercase">
                 <Cpu size={14} className="md:w-4 md:h-4" /> YOUR BUSINESS PLAN
              </div>
               <h2 className="responsive-text-3xl md:responsive-text-5xl lg:text-8xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">
                From <span className="gold-text italic">Idea</span> <br /> 
                <span className="text-slate-400 dark:text-gray-700">To Success.</span>
              </h2>
              <p className="text-slate-500 dark:text-gray-500 responsive-text-lg md:responsive-text-xl font-medium leading-relaxed">Once you find a good idea, we help you create a 6-month step-by-step plan. We guide you from the starting point to growing your business.</p>
              
              <ul className="space-y-4 md:space-y-6">
                 {[
                    { title: "Local Insights", desc: "Understand local search demand and market needs." },
                    { title: "Profit Guide", desc: "Clear profit projections and requirements." },
                    { title: "Next Steps", desc: "Simple, actionable business instructions." }
                  ].map((item, idx) => (
                    <li key={idx} className="flex gap-4 md:gap-6 group">
                       <div className="w-10 h-10 md:w-12 md:h-12 bg-slate-900/5 dark:bg-white/5 group-hover:bg-amber-600/20 rounded-full flex items-center justify-center shrink-0 border border-slate-900/5 dark:border-white/5 transition-all">
                          <Zap size={16} className="md:w-[18px] md:h-[18px] text-amber-600" />
                       </div>
                       <div>
                          <h4 className="responsive-text-lg md:responsive-text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{item.title}</h4>
                          <p className="responsive-text-sm text-slate-500 dark:text-gray-500 font-medium">{item.desc}</p>
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

          <h2 className="responsive-text-3xl md:responsive-text-5xl lg:text-9xl font-black text-slate-900 dark:text-white tracking-tighter leading-none relative z-10">
            Start Your <br /> <span className="text-emerald-600 dark:text-emerald-500">Business Now.</span>
          </h2>
          <p className="text-slate-500 dark:text-gray-500 responsive-text-lg md:responsive-text-xl lg:text-2xl font-medium max-w-3xl mx-auto relative z-10 leading-relaxed px-4">Join thousands of founders. Start your free market search today and find your next big opportunity.</p>
          
          <button 
            onClick={handleStartScan}
            className="relative z-10 h-16 md:h-20 lg:h-24 px-12 md:px-16 lg:px-20 rounded-2xl md:rounded-[2.5rem] lg:rounded-[3rem] growth-gradient text-white responsive-text-xs md:text-[14px] font-black uppercase tracking-[0.5em] shadow-[0_40px_80px_-20px_rgba(16,185,129,0.5)] hover:-translate-y-3 hover:scale-105 transition-all duration-700 active:scale-95 group"
          >
             <Rocket size={20} className="md:w-6 md:h-6 inline-block mr-3 md:mr-5 group-hover:rotate-12 transition-transform" />
             GET STARTED
          </button>
        </motion.div>
      </section>

    </div>
  );
}
