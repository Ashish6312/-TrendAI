export default function Footer() {
  return (
    <footer className="bg-slate-50 dark:bg-gray-950/80 border-t border-slate-200 dark:border-white/5 backdrop-blur-md transition-colors duration-300">
      <div className="responsive-container py-12 md:py-16">
        <div className="lg:flex lg:justify-between gap-12">
          <div className="mb-10 lg:mb-0 space-y-6">
            <a href="/" className="flex items-center gap-3">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-tr from-emerald-600 to-teal-600 rounded-lg flex items-center justify-center">
                 <span className="text-white font-black">T</span>
              </div>
              <span className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tighter italic">Trend<span className="text-emerald-600 dark:text-emerald-500">AI</span></span>
            </a>
            <p className="text-slate-500 dark:text-gray-400 max-w-sm responsive-text-sm font-medium leading-relaxed">
              Global Strategic Business Intelligence. Powered by advanced AI technology to identify market gaps and consumer sentiment worldwide.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-12 lg:gap-24">
            <div>
              <h2 className="mb-6 responsive-text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest underline underline-offset-8 decoration-slate-200 dark:decoration-white/10">Strategic</h2>
              <ul className="text-slate-500 dark:text-gray-400 font-bold space-y-4 uppercase tracking-wider text-[10px]">
                <li>
                  <a href="/dashboard" className="hover:text-emerald-600 dark:hover:text-emerald-500 transition-colors">Market Scan</a>
                </li>
                <li>
                  <a href="/acquisition-tiers" className="hover:text-emerald-600 dark:hover:text-emerald-500 transition-colors">Pricing</a>
                </li>
                <li>
                  <a href="#" className="hover:text-emerald-600 dark:hover:text-emerald-500 transition-colors">API Keys</a>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="mb-6 responsive-text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest underline underline-offset-8 decoration-slate-200 dark:decoration-white/10">Legal</h2>
              <ul className="text-slate-500 dark:text-gray-400 font-bold space-y-4 uppercase tracking-wider text-[10px]">
                <li>
                  <a href="/privacy" className="hover:text-emerald-600 dark:hover:text-emerald-500 transition-colors">Privacy</a>
                </li>
                <li>
                  <a href="/terms" className="hover:text-emerald-600 dark:hover:text-emerald-500 transition-colors">Terms</a>
                </li>
                <li>
                  <a href="#" className="hover:text-emerald-600 dark:hover:text-emerald-500 transition-colors">Compliance</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-16 pt-8 border-t border-slate-200 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <span className="text-xs font-black text-slate-400 dark:text-gray-600 uppercase tracking-widest">© 2026 TrendAI PRO. Strategic Intelligence Engine.</span>
          <div className="flex gap-6 text-slate-400 dark:text-gray-600 font-black uppercase tracking-[0.2em] text-[10px]">
             <span>v1.2.4</span>
             <span className="text-emerald-500">Live Status: Stable</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
