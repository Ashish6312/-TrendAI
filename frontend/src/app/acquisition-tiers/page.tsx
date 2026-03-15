"use client";

import { Check, X, Crown, Zap, Building2, ArrowRight, Star, TrendingUp, Shield, Users, Target, Rocket, MapPin, Globe, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { useNotifications } from "@/context/NotificationContext";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useRazorpay } from "@/hooks/useRazorpay";
import { useSession } from "next-auth/react";
import { getPricingForCountry, formatPrice, getSavingsPercentage, CountryPricing } from "@/utils/locationPricing";

export default function AcquisitionTiers() {
  const { t } = useLanguage();
  const { data: session } = useSession();
  const { initiatePayment } = useRazorpay();
  const { userLocation } = useNotifications();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("yearly");
  const [loading, setLoading] = useState<string | null>(null);
  const [currentPricing, setCurrentPricing] = useState<CountryPricing | null>(null);

  // Update pricing based on user location
  useEffect(() => {
    if (userLocation?.country) {
      const pricing = getPricingForCountry(userLocation.country);
      setCurrentPricing(pricing);
    }
  }, [userLocation]);

  // Use default pricing if location not available
  const pricing = currentPricing || getPricingForCountry('Global');

  const handlePayment = async (tier: any) => {
    if (tier.price === 0) {
      // Free tier - redirect to dashboard
      window.location.href = '/dashboard';
      return;
    }

    if (!session?.user) {
      // Redirect to login
      window.location.href = '/api/auth/signin';
      return;
    }

    setLoading(tier.id);

    try {
      await initiatePayment({
        amount: tier.price,
        currency: pricing.currency,
        planName: tier.name,
        billingCycle,
        customerName: session.user.name || '',
        customerEmail: session.user.email || '',
      });
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  const tiers = [
    {
      id: "starter",
      name: "Starter",
      tagline: "Basic Market Research",
      price: pricing.free.price,
      originalPrice: null,
      icon: <Target size={32} />,
      color: "gray",
      popular: false,
      features: [
        { text: "5 Market Analyses", available: true },
        { text: "Basic Business Insights", available: true },
        { text: "Market Trend Tracking", available: true },
        { text: "Free Forever Access", available: true },
        { text: "Standard PDF Reports", available: true },
        { text: "AI Profit Predictions", available: false },
        { text: "Full API Access", available: false },
        { text: "Custom Branding", available: false }
      ],
      cta: "Get Started Free",
      href: "/dashboard",
      description: "Perfect for exploring basic market data and validating your first business ideas."
    },
    {
      id: "professional",
      name: "Professional",
      tagline: "Advanced Growth Tools",
      price: billingCycle === "monthly" ? pricing.professional.monthly : pricing.professional.yearly,
      originalPrice: billingCycle === "monthly" ? pricing.professional.originalMonthly : pricing.professional.originalYearly,
      icon: <Rocket size={32} />,
      color: "emerald",
      popular: true,
      features: [
        { text: "Unlimited Market Analyses", available: true },
        { text: "AI Profit Predictions", available: true },
        { text: "Competitor Analysis", available: true },
        { text: "Real-time Market Alerts", available: true },
        { text: "Professional PDF Reports", available: true },
        { text: "Priority Support (24/7)", available: true },
        { text: "Team Collaboration Hub", available: true },
        { text: "Account Manager", available: false }
      ],
      cta: "Upgrade to Pro",
      href: "/dashboard",
      description: "Designed for serious business owners ready to dominate their local market with advanced AI."
    },
    {
      id: "enterprise",
      name: "Enterprise",
      tagline: "Total Business Control",
      price: billingCycle === "monthly" ? pricing.enterprise.monthly : pricing.enterprise.yearly,
      originalPrice: billingCycle === "monthly" ? pricing.enterprise.originalMonthly : pricing.enterprise.originalYearly,
      icon: <Crown size={32} />,
      color: "purple",
      popular: false,
      features: [
        { text: "Everything in Professional", available: true },
        { text: "Custom Data Integration", available: true },
        { text: "Full API Access", available: true },
        { text: "White-label Reports", available: true },
        { text: "Dedicated Success Manager", available: true },
        { text: "Specialized Market Nodes", available: true },
        { text: "Multi-user Management", available: true },
        { text: "Urgent Priority Support", available: true }
      ],
      cta: "Contact Sales",
      href: "/dashboard",
      description: "The complete solution for large companies requiring deep data and custom integrations."
    }
  ];

  const savingsAmount = billingCycle === "yearly" && pricing.professional.monthly && pricing.professional.yearly 
    ? getSavingsPercentage(pricing.professional.monthly, pricing.professional.yearly)
    : 0;

  const savings = savingsAmount > 0 ? `${savingsAmount}%` : "";

  return (
    <div className="min-h-screen bg-white dark:bg-[#020617] relative selection:bg-emerald-500/30 overflow-x-hidden transition-colors duration-500">
      {/* Immersive Background Architecture */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/10 dark:bg-emerald-500/5 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-0 w-[600px] h-[600px] bg-purple-600/10 dark:bg-purple-600/5 rounded-full blur-[150px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] dark:opacity-[0.02] mix-blend-overlay" />
        
        {/* Animated Grid Path */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000005_1px,transparent_1px),linear-gradient(to_bottom,#00000005_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      <div className="relative z-10">
        {/* Hero Section - High Conversion Focus */}
        <div className="responsive-container pt-20 md:pt-32 pb-40">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-16 md:space-y-24"
          >
            <div className="flex flex-col items-center gap-8">
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="inline-flex items-center gap-4 px-6 py-3 rounded-full bg-slate-900/5 dark:bg-white/5 border border-slate-900/10 dark:border-white/10 backdrop-blur-xl shadow-2xl"
              >
                <div className="flex -space-x-3">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-[var(--background)] bg-slate-800 flex items-center justify-center overflow-hidden shadow-lg">
                      <img src={`https://i.pravatar.cc/100?u=${i}`} alt="User" />
                    </div>
                  ))}
                </div>
                <div className="flex flex-col items-start leading-none">
                  <span className="text-[11px] font-black uppercase tracking-[0.2em] text-emerald-400">Trusted Authority</span>
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">10k+ Strategic Partnerships</span>
                </div>
              </motion.div>
 
              <h1 className="responsive-text-5xl md:responsive-text-6xl lg:text-7xl font-black text-slate-900 dark:text-white tracking-tighter leading-tight italic">
                Master the <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-500 animate-gradient-x py-2 inline-block leading-normal">Pricing Plans.</span>
              </h1>
 
              <p className="responsive-text-base md:responsive-text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed tracking-tight px-4 opacity-80 dark:opacity-60">
                Deploy Elite Intelligence engineered for high-stakes capital allocation. 
                Dismantle competition with clinical precision.
              </p>
            </div>
            
            {/* Precision Stats - Strategic Layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-0 max-w-5xl mx-auto w-full items-center divide-y md:divide-y-0 md:divide-x divide-slate-200 dark:divide-white/5">
              {[
                { label: "Capital Deployed", value: "$2.3B+", color: "text-emerald-600 dark:text-emerald-400", sub: "Global Institutional Flow" },
                { label: "Market Advantage", value: "94%", color: "text-blue-600 dark:text-blue-400", sub: "Alpha Detection Accuracy" },
                { label: "Precision Rate", value: "99.9%", color: "text-purple-600 dark:text-purple-400", sub: "Operational Reliability" }
              ].map((stat, i) => (
                <div key={i} className="px-12 py-8 md:py-0 text-center group cursor-default transition-all">
                  <div className={`responsive-text-4xl md:responsive-text-5xl font-black ${stat.color} tracking-tighter group-hover:scale-110 transition-transform duration-700 mb-2`}>{stat.value}</div>
                  <div className="text-[10px] text-slate-900 dark:text-slate-200 font-black uppercase tracking-[0.3em] italic">{stat.label}</div>
                  <div className="text-[8px] text-slate-400 dark:text-slate-600 font-bold uppercase tracking-[0.2em] mt-2">{stat.sub}</div>
                </div>
              ))}
            </div>
 
            {/* Billing Switcher - Professional Integration */}
            <div className="relative flex flex-col items-center gap-24 pt-10">
              <div className="relative group">
                {savings && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className="absolute left-[72%] -top-16 -translate-x-1/2 z-20 pointer-events-none flex flex-col items-center"
                  >
                    <div className="bg-emerald-500 text-white text-[10px] font-black px-6 py-2.5 rounded-full shadow-[0_25px_50px_-10px_rgba(16,185,129,0.5)] border border-white/20 whitespace-nowrap flex items-center gap-2">
                      <Zap size={12} fill="currentColor" /> SAVE {savings}
                    </div>
                    <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[10px] border-t-emerald-500 -mt-0.5" />
                  </motion.div>
                )}
 
                <div className="inline-flex items-center p-1.5 rounded-[2.5rem] bg-white/[0.03] border border-white/10 backdrop-blur-3xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] relative">
                  <button 
                    onClick={() => setBillingCycle('monthly')}
                    className={`relative z-10 px-14 py-5 rounded-[2.2rem] text-[11px] font-black uppercase tracking-[0.3em] transition-all duration-700 ${billingCycle === 'monthly' ? 'text-slate-900' : 'text-slate-400 hover:text-white'}`}
                  >
                    {billingCycle === 'monthly' && (
                      <motion.div layoutId="activeTab" className="absolute inset-0 bg-white rounded-[2.2rem] shadow-2xl" />
                    )}
                    <span className="relative z-20">Monthly</span>
                  </button>
                  <button 
                    onClick={() => setBillingCycle('yearly')}
                    className={`relative z-10 px-14 py-5 rounded-[2.2rem] text-[11px] font-black uppercase tracking-[0.3em] transition-all duration-700 ${billingCycle === 'yearly' ? 'text-white' : 'text-slate-400 hover:text-white'}`}
                  >
                    {billingCycle === 'yearly' && (
                      <motion.div layoutId="activeTab" className="absolute inset-0 bg-emerald-500 rounded-[2.2rem] shadow-[0_20px_40px_rgba(16,185,129,0.4)]" />
                    )}
                    <span className="relative z-20">Strategic</span>
                  </button>
                </div>
              </div>
 
              {userLocation?.country && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-5 text-[11px] font-black uppercase tracking-[0.5em] text-slate-500 dark:text-slate-400 bg-slate-900/5 dark:bg-white/[0.02] px-12 py-6 rounded-3xl border border-slate-900/10 dark:border-white/5 italic mt-16 mb-16 shadow-4xl backdrop-blur-3xl"
                >
                  <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-500">
                    <Globe size={18} className="animate-pulse" /> 
                  </div>
                  <span className="flex items-center gap-3">
                    Market Region: <span className="text-slate-900 dark:text-slate-200">{userLocation.country}</span> Pricing Selected
                  </span>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
 
        {/* Pricing Matrix - Strategic Spacing Isolation */}
        <div className="responsive-container pb-40 pt-40 border-t border-slate-200 dark:border-white/5 mt-40 relative overflow-visible">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-[#020617] px-12 text-[11px] font-black uppercase tracking-[0.6em] text-slate-400 dark:text-slate-800 italic border-x border-slate-200 dark:border-white/5">
            Deployment Matrix
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 md:gap-16 lg:gap-10 items-stretch">
            {tiers.map((tier, index) => (
              <motion.div
                key={tier.id}
                initial={{ opacity: 0, y: 50, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                whileHover={{ y: -15, transition: { duration: 0.4, ease: "easeOut" } }}
                transition={{ delay: index * 0.1 }}
                className={`group relative flex flex-col rounded-[2.5rem] p-10 md:p-12 h-full backdrop-blur-3xl border transition-all duration-700 ${
                  tier.popular 
                    ? 'bg-gradient-to-b from-emerald-500/10 via-white/80 to-white/95 dark:from-emerald-500/10 dark:via-slate-900/90 dark:to-slate-900/95 border-emerald-500/30 shadow-[0_40px_100px_-20px_rgba(16,185,129,0.2)] scale-105 z-20' 
                    : tier.id === 'enterprise' 
                    ? 'bg-gradient-to-b from-purple-500/10 via-white/80 to-white/95 dark:from-purple-500/10 dark:via-slate-900/90 dark:to-slate-900/95 border-purple-500/20 hover:border-purple-500/40' 
                    : 'bg-slate-50/60 dark:bg-slate-900/60 border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10'
                }`}
              >
                {/* Visual Accent - Dynamic Glow */}
                <div className={`absolute -inset-px rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity duration-1000 blur-2xl -z-10 ${
                  tier.id === 'professional' ? 'bg-emerald-500/10' :
                  tier.id === 'enterprise' ? 'bg-purple-500/10' :
                  'bg-white/5'
                }`} />

                {tier.popular && (
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-40">
                    <motion.div 
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                      className="bg-gradient-to-r from-emerald-600 to-emerald-400 text-white px-10 py-3.5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] shadow-[0_25px_50px_-10px_rgba(16,185,129,0.5)] border border-white/20 whitespace-nowrap"
                    >
                      Most Popular Plan
                    </motion.div>
                  </div>
                )}

                <div className="flex-1 space-y-10 flex flex-col relative z-20">
                  {/* Branding & Visuals */}
                  <div className="text-center space-y-8">
                    <motion.div 
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className={`inline-flex items-center justify-center w-24 h-24 rounded-[2rem] transition-all duration-500 ${
                        tier.id === 'professional' ? 'bg-emerald-500/20 text-emerald-400 shadow-2xl' :
                        tier.id === 'enterprise' ? 'bg-purple-500/20 text-purple-400 shadow-2xl' :
                        'bg-slate-800/80 text-slate-500'
                      }`}
                    >
                      {tier.icon}
                    </motion.div>

                    <div className="space-y-3">
                      <h3 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tighter leading-none italic">{tier.name}</h3>
                      <p className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] h-4">{tier.tagline}</p>
                    </div>
                  </div>

                  {/* Pricing Display - Animated */}
                  <div className="flex flex-col items-center justify-center min-h-[140px] bg-slate-900/5 dark:bg-white/[0.02] rounded-3xl p-8 border border-slate-900/10 dark:border-white/5 relative group/price overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.01] to-transparent opacity-0 group-hover/price:opacity-100 transition-opacity" />
                    
                    {tier.originalPrice && (
                      <div className="text-slate-400 dark:text-slate-600 text-xs font-bold line-through mb-2 opacity-60 dark:opacity-40">
                        {formatPrice(tier.originalPrice, pricing)}
                      </div>
                    )}
                    <div className="flex flex-col items-center gap-1">
                      <div className="flex items-baseline gap-2">
                        <span className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tighter">
                          {typeof tier.price === 'number' ? formatPrice(tier.price, pricing).split('.')[0] : tier.price}
                        </span>
                        {typeof tier.price === 'number' && tier.price > 0 && (
                          <span className="text-slate-500 dark:text-slate-400 font-extrabold text-[10px] uppercase tracking-widest">/mo</span>
                        )}
                      </div>
                      {billingCycle === 'yearly' && typeof tier.price === 'number' && tier.price > 0 && (
                        <div className="text-[9px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest">Billed Annually</div>
                      )}
                    </div>
                    <div className="text-emerald-600 dark:text-emerald-500 text-[9px] font-black uppercase tracking-widest mt-4 flex items-center gap-2">
                       <Zap size={10} fill="currentColor" /> {typeof tier.price === 'number' && tier.price > 0 ? `Strategic ${billingCycle} Commitment` : "Unlimited Free Utility"}
                    </div>
                  </div>

                  {/* CTA - High Gloss Impact */}
                  <button
                    onClick={() => handlePayment(tier)}
                    disabled={loading === tier.id}
                    className={`w-full group relative overflow-hidden px-10 py-6 rounded-3xl font-black text-[10px] uppercase tracking-[0.3em] transition-all duration-700 active:scale-95 shimmer-btn shadow-3xl ${
                      tier.popular
                        ? 'bg-emerald-600 dark:bg-emerald-500 text-white shadow-emerald-500/20'
                        : tier.id === 'enterprise'
                        ? 'bg-purple-700 dark:bg-purple-600 text-white shadow-purple-600/20'
                        : 'bg-slate-900/5 dark:bg-white/5 text-slate-900 dark:text-white border border-slate-900/10 dark:border-white/10 hover:bg-slate-900/10 dark:hover:bg-white/10'
                    }`}
                  >
                    <span className="relative z-20 flex items-center justify-center gap-4 group-hover:gap-6 transition-all">
                      {loading === tier.id ? (
                        <RefreshCw size={18} className="animate-spin" />
                      ) : (
                        <>
                          {tier.cta}
                          <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                        </>
                      )}
                    </span>
                  </button>

                  {/* Feature Checklist - Clean & Modern */}
                  <div className="space-y-5 pt-8 mt-auto px-2">
                    {tier.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-4 group/item">
                        <div className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-lg flex items-center justify-center transition-all duration-300 ${
                          feature.available 
                            ? tier.id === 'professional' ? 'bg-emerald-500/10 text-emerald-400 group-hover/item:bg-emerald-500 group-hover/item:text-white' :
                              tier.id === 'enterprise' ? 'bg-purple-500/10 text-purple-400 group-hover/item:bg-purple-500 group-hover/item:text-white' :
                              'bg-white/10 text-white'
                            : 'bg-slate-800/50 text-slate-700'
                        }`}>
                          {feature.available ? <Check size={10} strokeWidth={4} /> : <X size={10} strokeWidth={4} />}
                        </div>
                        <span className={`text-[11px] font-bold tracking-tight transition-all ${feature.available ? 'text-slate-600 dark:text-slate-300 group-hover/item:text-slate-900 dark:group-hover/item:text-white' : 'text-slate-300 dark:text-slate-700 line-through opacity-40'}`}>
                          {feature.text}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Trust Footer */}
                  <div className="pt-10 flex items-center justify-center gap-2 opacity-30 dark:opacity-30 group-hover:opacity-100 transition-opacity">
                     <Shield size={12} className="text-emerald-600 dark:text-emerald-500" />
                     <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Secured via Enterprise SSL</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Strategic Advantage Section - High Engagement Utility */}
      <div className="bg-slate-900/40 border-y border-white/5 py-32 backdrop-blur-3xl relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(16,185,129,0.05),transparent_50%)]" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-24 space-y-4">
            <div className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-600 dark:text-emerald-500 italic">Competitive Edge</div>
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white italic tracking-tighter">Why Settle for Average?</h2>
            <p className="text-slate-500 dark:text-slate-500 font-medium max-w-xl mx-auto">Deploy the most advanced market acquisition tools in the industry.</p>
          </div>
 
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                icon: <TrendingUp size={40} />,
                title: "Capital Capture Engine",
                description: "Our neural algorithms identified $23.4B in high-conviction market opportunities last fiscal quarter alone.",
                color: "emerald"
              },
              {
                icon: <Shield size={40} />,
                title: "Risk Mitigation Shield",
                description: "Sovereign performance guarantee. If our tactical insights don't clarify your path, we reset your capital flow.",
                color: "blue"
              },
              {
                icon: <Users size={40} />,
                title: "Global Node Network",
                description: "Distributed neural processing across 50+ regional sub-sectors with real-time institutional synchronization.",
                color: "purple"
              }
            ].map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                  className="group p-10 rounded-[2.5rem] bg-slate-900/5 dark:bg-white/[0.02] border border-slate-900/10 dark:border-white/5 hover:bg-slate-900/10 dark:hover:bg-white/[0.04] hover:border-slate-900/20 dark:hover:border-white/10 transition-all duration-500"
                >
                  <div className={`mb-8 inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-${benefit.color}-500/10 text-${benefit.color}-600 dark:text-${benefit.color}-400 group-hover:scale-110 group-hover:rotate-6 transition-all`}>
                    {benefit.icon}
                  </div>
                  <h3 className="text-2xl font-black text-white italic tracking-tighter mb-4">{benefit.title}</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-medium opacity-90 dark:opacity-80">{benefit.description}</p>
                </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Intelligence FAQ - Professional Interaction */}
      <div className="py-32 relative">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-24 space-y-4">
            <div className="text-[10px] font-black uppercase tracking-[0.4em] text-purple-600 dark:text-purple-500 italic">Common Questions</div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white italic tracking-tighter">Clarify Your Path</h2>
          </div>
 
          <div className="space-y-4">
            {[
              {
                question: "Can I change my plan later?",
                answer: "Yes. You can upgrade, downgrade, or cancel your subscription at any time from your account settings."
              },
              {
                question: "Is there a free plan?",
                answer: "The Starter plan is completely free forever. It's the perfect way to explore basic features."
              },
              {
                question: "Which institutional payment gateways are active?",
                answer: "We support Tier-1 sovereign credit networks, encrypted PayPal tunnels, and direct institutional wire transfers for absolute dominance."
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group bg-slate-900/5 dark:bg-white/[0.01] hover:bg-slate-900/10 dark:hover:bg-white/[0.03] rounded-3xl p-8 border border-slate-900/10 dark:border-white/5 hover:border-slate-900/20 dark:hover:border-white/10 transition-all duration-300"
              >
                <h3 className="text-lg font-black text-slate-900 dark:text-white italic tracking-tighter mb-3 group-hover:text-emerald-600 dark:group-hover:text-emerald-500 transition-colors flex items-center justify-between">
                  {faq.question}
                  <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0" />
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed opacity-90 dark:opacity-70">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Final Launch Sequence - Dramatic Engagement */}
      <div className="relative py-40 border-t border-slate-200 dark:border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 via-transparent to-purple-500/5" />
        <div className="absolute -bottom-1/2 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-500/20 blur-[120px] rounded-full" />
        
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="space-y-12"
          >
            <div className="space-y-6">
              <h2 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white italic tracking-tighter leading-none">Execute Your <br /> Vision Now.</h2>
              <p className="text-slate-500 dark:text-slate-400 font-medium max-w-lg mx-auto leading-relaxed">
                Terminal ready for launch. Join 10k+ founders already dominating their regional sectors.
              </p>
            </div>

            <button
              onClick={() => window.location.href = '/dashboard'}
              className="group relative inline-flex items-center gap-6 px-12 py-6 bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-black text-xs uppercase tracking-[0.4em] rounded-[2rem] hover:scale-110 active:scale-95 transition-all shadow-[0_20px_60px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_60px_rgba(255,255,255,0.2)]"
            >
              <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-r from-emerald-400 to-blue-500 opacity-0 group-hover:opacity-10 transition-opacity" />
              Start Your Journey
              <ArrowRight size={20} className="group-hover:translate-x-3 transition-transform" />
            </button>
            
            <div className="pt-8 flex items-center justify-center gap-3 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-600 italic">
               <Shield size={12} fill="currentColor" /> Encrypted Deployment Tunnel: Active
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}