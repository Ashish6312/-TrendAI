"use client";

import { signIn, getSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Zap, TrendingUp, Users, Shield, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const router = useRouter();

  // Check if user is already logged in
  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession();
      if (session) {
        // Check for callback URL in query params
        const urlParams = new URLSearchParams(window.location.search);
        const callbackUrl = urlParams.get('callbackUrl') || '/dashboard';
        router.push(callbackUrl);
      }
    };
    checkSession();
  }, [router]);

  const handleGoogleAuth = async () => {
    setLoading(true);
    setError("");
    try {
      // Get callback URL from query params
      const urlParams = new URLSearchParams(window.location.search);
      const callbackUrl = urlParams.get('callbackUrl') || '/dashboard';
      
      const result = await signIn('google', { 
        callbackUrl,
        redirect: false 
      });
      
      if (result?.error) {
        setError('Authentication failed. Please try again.');
      }
    } catch (error) {
      console.error('Authentication error:', error);
      setError('Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    console.log('Form submission started', { isLogin, email: formData.email });
    
    // Validation
    if (!formData.email || !formData.password) {
      setError("Email and password are required!");
      return;
    }
    
    if (!isLogin && formData.password !== formData.confirmPassword) {
      setError("Passwords don't match!");
      return;
    }
    
    if (!isLogin && formData.password.length < 6) {
      setError("Password must be at least 6 characters long!");
      return;
    }
    
    if (!isLogin && !formData.name.trim()) {
      setError("Name is required for sign up!");
      return;
    }
    
    setLoading(true);
    
    try {
      // Get callback URL from query params
      const urlParams = new URLSearchParams(window.location.search);
      const callbackUrl = urlParams.get('callbackUrl') || '/dashboard';
      
      console.log('Attempting NextAuth signIn with credentials');
      console.log('Credentials:', { 
        email: formData.email, 
        isSignUp: (!isLogin).toString(),
        name: formData.name || undefined
      });
      
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        name: formData.name || undefined,
        isSignUp: (!isLogin).toString(),
        callbackUrl,
        redirect: false
      });
      
      console.log('NextAuth signIn result:', result);
      
      if (result?.error) {
        console.error('NextAuth error:', result.error);
        setError(`Authentication failed: ${result.error}`);
      } else if (result?.ok) {
        console.log('Authentication successful, redirecting to:', callbackUrl);
        // Force a page refresh to ensure session is properly loaded
        window.location.href = callbackUrl;
      } else {
        console.error('Unexpected NextAuth result:', result);
        setError('Authentication failed. Please try again.');
      }
    } catch (error: any) {
      console.error('Authentication error:', error);
      setError(`Authentication failed: ${error.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { icon: <TrendingUp size={20} />, text: "Smart Market Analysis" },
    { icon: <Users size={20} />, text: "Check Competitors" },
    { icon: <Shield size={20} />, text: "Instant Market Alerts" },
    { icon: <Star size={20} />, text: "Personal Business Reports" }
  ];

  const stats = [
    { value: "$2.3M+", label: "Earnings Made" },
    { value: "94%", label: "Success Rate" },
    { value: "48hrs", label: "Quick Returns" }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-white flex transition-colors duration-500 overflow-hidden">
      {/* Left Side: Login Portal */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8 lg:p-12 relative overflow-hidden">
        {/* Cinematic Background Elements */}
        <div className="absolute inset-0 z-0">
           <div className="absolute top-1/4 -left-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] animate-pulse" />
           <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] animate-pulse delay-1000" />
        </div>

        <div className="w-full max-w-sm sm:max-w-md relative z-10">
          {/* Logo Area */}
          <div className="text-center mb-8 sm:mb-12">
            <motion.div 
               initial={{ scale: 0.9, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               className="inline-flex items-center gap-4 mb-6 sm:mb-8"
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-[1.25rem] bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-xl sm:shadow-2xl shadow-emerald-500/20 border border-emerald-400/30">
                <Zap className="text-white" size={24} fill="currentColor" />
              </div>
              <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-widest uppercase">
                Trend<span className="text-emerald-500">AI</span>
              </span>
            </motion.div>
            <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white mb-3 sm:mb-4 tracking-tighter leading-none">
              {isLogin ? "Welcome Back" : "Join TrendAI"}
            </h1>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 italic">
              {isLogin 
                ? "Sign in to access your business insights" 
                : "Create an account to start finding opportunities"
              }
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex bg-slate-200/50 dark:bg-[#0a0f25] border border-slate-200 dark:border-white/5 rounded-2xl p-1.5 mb-8 sm:mb-10 shadow-lg dark:shadow-3xl transition-colors">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2.5 sm:py-3 px-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                isLogin 
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xl scale-100' 
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2.5 sm:py-3 px-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                !isLogin 
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xl scale-100' 
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Sign Up
            </button>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
               key={isLogin ? 'login' : 'signup'}
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: -20 }}
               className="space-y-4 sm:space-y-6"
            >
               {error && (
                 <motion.div 
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-500 text-xs font-bold text-center"
                 >
                   {error}
                 </motion.div>
               )}

               <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                 {!isLogin && (
                   <div className="relative group">
                     <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-600 group-focus-within:text-emerald-500 transition-colors" size={18} />
                     <input
                       type="text"
                       placeholder="Full Name"
                       value={formData.name}
                       onChange={(e) => setFormData({...formData, name: e.target.value})}
                       className="w-full pl-12 pr-4 py-4 sm:py-5 bg-white dark:bg-[#050818] border border-slate-200 dark:border-white/5 rounded-2xl text-sm font-bold text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-800 transition-all focus:border-emerald-500/50"
                       required={!isLogin}
                     />
                   </div>
                 )}

                 <div className="relative group">
                   <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-600 group-focus-within:text-emerald-500 transition-colors" size={18} />
                   <input
                     type="email"
                     placeholder="Email Address"
                     value={formData.email}
                     onChange={(e) => setFormData({...formData, email: e.target.value})}
                     className="w-full pl-12 pr-4 py-4 sm:py-5 bg-white dark:bg-[#050818] border border-slate-200 dark:border-white/5 rounded-2xl text-sm font-bold text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-800 transition-all focus:border-emerald-500/50"
                     required
                   />
                 </div>

                 <div className="relative group">
                   <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-600 group-focus-within:text-emerald-500 transition-colors" size={18} />
                   <input
                     type={showPassword ? "text" : "password"}
                     placeholder="Password"
                     value={formData.password}
                     onChange={(e) => setFormData({...formData, password: e.target.value})}
                     className="w-full pl-12 pr-14 py-4 sm:py-5 bg-white dark:bg-[#050818] border border-slate-200 dark:border-white/5 rounded-2xl text-sm font-bold text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-800 transition-all focus:border-emerald-500/50"
                     required
                   />
                   <button
                     type="button"
                     onClick={() => setShowPassword(!showPassword)}
                     className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900 dark:text-slate-600 dark:hover:text-white transition-colors"
                   >
                     {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                   </button>
                 </div>

                 {!isLogin && (
                   <div className="relative group">
                     <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-600 group-focus-within:text-emerald-500 transition-colors" size={18} />
                     <input
                       type={showPassword ? "text" : "password"}
                       placeholder="Confirm Password"
                       value={formData.confirmPassword}
                       onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                       className="w-full pl-12 pr-4 py-4 sm:py-5 bg-white dark:bg-[#050818] border border-slate-200 dark:border-white/5 rounded-2xl text-sm font-bold text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-800 transition-all focus:border-emerald-500/50"
                       required={!isLogin}
                     />
                   </div>
                 )}

                 <button
                   type="submit"
                   disabled={loading}
                   className="w-full py-4 sm:py-5 bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-emerald-50 transition-all rounded-2xl shadow-xl dark:shadow-3xl transform active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-4 group"
                 >
                   {loading ? (
                     <div className="flex items-center gap-3">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span className="text-xs font-black text-white dark:text-black uppercase tracking-widest italic">{isLogin ? "Signing in..." : "Creating Account..."}</span>
                     </div>
                   ) : (
                     <div className="flex items-center gap-4">
                       <span className="text-xs font-black text-white dark:text-black uppercase tracking-widest">
                         {isLogin ? "Sign In Now" : "Create Account Now"}
                       </span>
                       <ArrowRight className="text-white dark:text-black group-hover:translate-x-1.5 transition-transform" size={18} />
                     </div>
                   )}
                 </button>
               </form>

               <div className="relative py-4">
                 <div className="absolute inset-0 flex items-center">
                   <div className="w-full border-t border-slate-200 dark:border-white/5"></div>
                 </div>
                 <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-700">
                    <span className="px-6 bg-slate-50 dark:bg-[#020617] transition-colors">Or continue with</span>
                 </div>
               </div>

               {/* Google Auth */}
               <button
                 onClick={handleGoogleAuth}
                 disabled={loading}
                 className="w-full py-4 sm:py-5 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-emerald-500/30 dark:hover:bg-white/[0.08] transition-all rounded-2xl flex items-center justify-center gap-4 group"
               >
                 <svg className="w-5 h-5" viewBox="0 0 24 24">
                   <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" className="text-slate-900 dark:text-white opacity-80" />
                   <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" className="text-slate-900 dark:text-white opacity-70" />
                   <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" className="text-slate-900 dark:text-white opacity-60" />
                   <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" className="text-slate-900 dark:text-white opacity-80" />
                 </svg>
                 <span className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white">Continue with Google</span>
               </button>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Right Side: Marketing Intelligence Display */}
      <div className="hidden lg:flex flex-1 relative bg-white dark:bg-[#050818] border-l border-slate-200 dark:border-white/5 items-center justify-center p-20 transition-colors">
        <div className="absolute inset-0 bg-grid-slate-900/[0.02] dark:bg-grid-white/[0.02] pointer-events-none" />
        <div className="max-w-xl relative z-10 space-y-12">
          
          <div className="grid grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="space-y-2">
                <div className="text-4xl font-black text-emerald-600 dark:text-emerald-500 tracking-tighter italic">{stat.value}</div>
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-600">{stat.label}</div>
                <div className="h-0.5 w-8 bg-emerald-500/30" />
              </div>
            ))}
          </div>

          <div className="space-y-6">
            <h2 className="text-6xl sm:text-7xl font-black text-slate-900 dark:text-white leading-none tracking-tighter uppercase">
              Start Your <span className="text-emerald-600 dark:text-emerald-500">Business</span> <br /> Faster.
            </h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-md italic">
              Our AI helps you find business ideas that people actually want in your city. Stop guessing and start building.
            </p>
          </div>

          <div className="space-y-5">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-5 group">
                <div className="w-12 h-12 rounded-[1rem] bg-slate-100 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 flex items-center justify-center text-emerald-600 dark:text-emerald-500 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-500 shadow-lg dark:shadow-2xl">
                  {feature.icon}
                </div>
                <span className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{feature.text}</span>
              </div>
            ))}
          </div>

          <div className="glass-card p-10 bg-slate-50 dark:bg-[#0a0f25] border border-slate-200 dark:border-white/5 shadow-2xl dark:shadow-3xl relative overflow-hidden group transition-all">
            <div className="absolute top-0 right-0 p-8 text-slate-200 dark:text-white opacity-10 dark:opacity-5 group-hover:scale-125 transition-transform duration-1000">
               <Shield size={100} />
            </div>
            <p className="text-slate-500 dark:text-slate-400 italic font-medium leading-relaxed relative z-10">
              "We provide high-quality market gaps that help entrepreneurs succeed. Join thousands of founders using TrendAI today."
            </p>
            <div className="flex items-center gap-4 mt-8 relative z-10">
               <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
               <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-600">Secure & Verified Business Data</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
