"use client";

import React, { useEffect, useState } from "react";
import { CheckCircle, ArrowRight, Star, Sparkles, Crown, Zap, Download, Mail, Calendar, CreditCard, Shield, Gift, X, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams, useRouter } from "next/navigation";
import { useNotifications } from "@/context/NotificationContext";
import { useSubscription, SubscriptionPlan } from "@/context/SubscriptionContext";
import { useSession } from "next-auth/react";

interface PaymentSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PaymentSuccessModal({ isOpen, onClose }: PaymentSuccessModalProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session } = useSession();
  const { addNotification } = useNotifications();
  const { setPlan, theme } = useSubscription();
  const [showConfetti, setShowConfetti] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  
  const paymentId = searchParams.get('payment_id') || `pay_${Date.now()}`;
  const planParam = searchParams.get('plan') || 'Market Dominator';
  const amount = searchParams.get('amount') || '5999';
  const billingCycle = searchParams.get('billing') || 'monthly';
  const currency = searchParams.get('currency') || 'INR';

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      
      // Auto-advance steps
      const stepTimers = [
        setTimeout(() => setCurrentStep(1), 2000),
        setTimeout(() => setCurrentStep(2), 4000),
        setTimeout(() => setCurrentStep(3), 6000),
      ];

      // Hide confetti after 5 seconds
      const confettiTimer = setTimeout(() => setShowConfetti(false), 5000);

      const planMapping: Record<string, SubscriptionPlan> = {
        'Starter': 'free',
        'Professional': 'professional', 
        'Enterprise': 'enterprise'
      };
      const currentPlan = planMapping[planParam] || 'enterprise';

      const planFeaturesMap = {
        'free': { max_analyses: 5, features: { advancedFeatures: false, prioritySupport: false, exportToPdf: false, apiAccess: false } },
        'professional': { max_analyses: 50, features: { advancedFeatures: true, prioritySupport: true, exportToPdf: true, apiAccess: true } },
        'enterprise': { max_analyses: -1, features: { advancedFeatures: true, prioritySupport: true, exportToPdf: true, apiAccess: true, dedicatedManager: true } }
      };

      const syncPlanWithBackend = async () => {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        const userEmail = session?.user?.email?.toLowerCase().trim();
        
        if (!userEmail) return;

        const payload = {
          user_email: userEmail,
          plan_name: currentPlan,
          plan_display_name: planParam,
          billing_cycle: billingCycle,
          price: parseFloat(amount),
          currency: currency,
          max_analyses: planFeaturesMap[currentPlan].max_analyses,
          features: planFeaturesMap[currentPlan].features
        };

        try {
          await fetch(`${apiUrl}/api/subscriptions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          
          // Also create a payment record
          await fetch(`${apiUrl}/api/payments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              user_email: userEmail,
              razorpay_payment_id: paymentId,
              razorpay_order_id: `ord_${Date.now()}`,
              amount: parseFloat(amount),
              currency: currency,
              status: 'success',
              plan_name: planParam,
              billing_cycle: billingCycle
            })
          });
        } catch (err) {
          console.error('Failed to sync plan with backend:', err);
        }
      };

      setPlan(currentPlan);
      if (session?.user?.email) {
        syncPlanWithBackend();
      }
      
      return () => {
        document.body.style.overflow = 'unset';
        stepTimers.forEach(clearTimeout);
        clearTimeout(confettiTimer);
      };
    }
  }, [isOpen, planParam, setPlan, session?.user?.email, amount, billingCycle, currency, paymentId]);

  const handleCheckEmail = () => {
    addNotification({
      type: 'payment',
      title: 'Receipt Delivery',
      message: 'Initiating receipt delivery sequence... Please check your inbox.',
      priority: 'medium',
      actionUrl: '/profile?tab=billing'
    });
    if (session?.user?.email) {
      window.open(`mailto:${session.user.email}?subject=TrendAI Payment Receipt - ${planParam}&body=Thank you for your payment! Your receipt and setup guide are attached.`, '_blank');
    } else {
      window.open('mailto:', '_blank');
    }
  };

  const handleDownloadResources = () => {
    addNotification({
      type: 'trending',
      title: 'Resources',
      message: 'Opening resources... Just a moment.',
      priority: 'low',
      actionUrl: '/resources'
    });
    setTimeout(() => {
      router.push('/resources');
      onClose();
    }, 800);
  };

  const handleManageBilling = () => {
    addNotification({
      type: 'system',
      title: 'Billing Portal',
      message: 'Redirecting to secure billing portal...',
      priority: 'high',
      actionUrl: '/profile?tab=billing'
    });
    setTimeout(() => {
      router.push('/profile?tab=billing');
      onClose();
    }, 800);
  };

  const handleViewRoadmap = () => {
    addNotification({
      type: 'market',
      title: 'Roadmap Protocol',
      message: 'Loading your personalized strategic roadmap...',
      priority: 'medium',
      actionUrl: '/roadmap'
    });
    setTimeout(() => {
      router.push('/roadmap');
      onClose();
    }, 800);
  };

  const handleUpdateProfile = () => {
    addNotification({
      type: 'system',
      title: 'Profile Access',
      message: 'Opening profile configuration...',
      priority: 'medium',
      actionUrl: '/profile'
    });
    setTimeout(() => {
      router.push('/profile');
      onClose();
    }, 800);
  };

  const planFeatures = {
    'Starter': {
      analyses: 5,
      features: ['Basic Search', 'Email Support', 'Standard Reports'],
      color: '#10b981'
    },
    'Professional': {
      analyses: 50,
      features: ['Advanced AI Tools', 'Priority Support', 'Custom Reports', 'API Access'],
      color: '#3b82f6'
    },
    'Enterprise': {
      analyses: -1,
      features: ['Unlimited Searches', '24/7 Premium Support', 'Custom Reports', 'Full API Access', 'Custom Integrations', 'Account Manager'],
      color: '#8b5cf6'
    }
  };

  const currentPlanFeatures = planFeatures[planParam as keyof typeof planFeatures] || planFeatures['Enterprise'];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl shadow-2xl custom-scrollbar"
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all z-50"
        >
          <X size={20} />
        </button>

        {/* Content - Similar to page.tsx but adapted for modal */}
        <div className="p-6 sm:p-12 text-center relative overflow-hidden">
          {/* Confetti (simplified for modal) */}
          <AnimatePresence>
            {showConfetti && (
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(40)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute"
                    style={{ left: `${Math.random() * 100}%`, top: '-20px' }}
                    initial={{ y: -20, rotate: 0, opacity: 1 }}
                    animate={{ y: 800, rotate: 360, x: Math.random() * 200 - 100 }}
                    transition={{ duration: 3 + Math.random() * 2, ease: "easeOut" }}
                  >
                    <Star size={10} style={{ color: i % 2 === 0 ? currentPlanFeatures.color : '#fbbf24' }} />
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>

          <div className="space-y-8">
            {/* Success Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", bounce: 0.6 }}
              className="relative inline-flex items-center justify-center"
            >
              <div
                className="w-24 h-24 rounded-full border-4 flex items-center justify-center relative shadow-lg"
                style={{ 
                  backgroundColor: `${currentPlanFeatures.color}20`,
                  borderColor: currentPlanFeatures.color,
                }}
              >
                <CheckCircle size={48} style={{ color: currentPlanFeatures.color }} />
              </div>
            </motion.div>

            {/* Title */}
            <div className="space-y-4">
              <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic">
                Your Plan is Active
              </h1>
              
              <div
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border backdrop-blur-sm"
                style={{ 
                  backgroundColor: `${currentPlanFeatures.color}20`,
                  borderColor: `${currentPlanFeatures.color}40`
                }}
              >
                <Crown size={20} style={{ color: currentPlanFeatures.color }} />
                <span className="font-bold text-lg" style={{ color: currentPlanFeatures.color }}>
                  {planParam} Tier
                </span>
              </div>
            </div>

            {/* Details Card */}
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 max-w-2xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1">Receipt ID</p>
                <p className="font-mono text-[10px] font-bold text-slate-600 dark:text-white truncate">{paymentId}</p>
              </div>
              <div className="text-center">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1">Total Paid</p>
                <p className="font-black text-xl text-emerald-600 dark:text-emerald-400">
                  {currency === 'INR' ? '₹' : '$'}{parseInt(amount).toLocaleString()}
                </p>
              </div>
              <div className="text-center">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1">Billing Cycle</p>
                <p className="font-black text-slate-900 dark:text-white uppercase italic text-sm">{billingCycle}</p>
              </div>
            </div>

            {/* Features */}
            <div className="bg-slate-50/50 dark:bg-slate-800/30 rounded-2xl p-6 border border-slate-100 dark:border-slate-700/50 max-w-2xl mx-auto">
              <h3 className="text-[10px] font-black text-slate-900 dark:text-white mb-4 uppercase tracking-[0.2em] italic">Included Features</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentPlanFeatures.features.map((feature: string, index: number) => (
                   <div
                    key={feature}
                    className="flex items-center gap-2 p-2.5 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm"
                  >
                    <CheckCircle size={14} className="text-emerald-500 dark:text-emerald-400 shrink-0" />
                    <span className="text-slate-700 dark:text-white text-[10px] font-black uppercase tracking-tight text-left">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-3xl mx-auto">
              <button
                onClick={onClose}
                className="w-full px-8 py-4 font-bold rounded-xl text-white transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center justify-center gap-2"
                style={{ background: currentPlanFeatures.color }}
              >
                <Zap size={18} />
                Access Dashboard
              </button>
              <button
                onClick={handleManageBilling}
                className="w-full px-8 py-4 font-black uppercase tracking-widest rounded-xl bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-white hover:bg-slate-200 dark:hover:bg-white/10 transition-all border border-slate-200 dark:border-white/10 flex items-center justify-center gap-2 italic"
              >
                <CreditCard size={18} />
                Manage Account
              </button>
              <button
                onClick={handleCheckEmail}
                className="w-full px-8 py-4 font-bold rounded-xl bg-slate-700 text-white hover:bg-slate-600 transition-all border border-slate-600 flex items-center justify-center gap-2"
              >
                <Mail size={18} />
                Check Receipt
              </button>
            </div>

            {/* Bottom Links Section - Made more professional */}
            <div className="pt-8 border-t border-white/5 max-w-2xl mx-auto">
              <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-4">
                <button 
                  onClick={handleViewRoadmap}
                  className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors group"
                >
                  <Calendar size={12} className="text-slate-700 group-hover:text-blue-400" />
                  View Roadmap
                </button>
                <button 
                  onClick={handleUpdateProfile}
                  className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors group"
                >
                  <User size={12} className="text-slate-700 group-hover:text-emerald-400" />
                  Update Profile
                </button>
                <button 
                  onClick={handleDownloadResources}
                  className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors group"
                >
                  <Download size={12} className="text-slate-700 group-hover:text-amber-400" />
                  Get Resources
                </button>
              </div>

              <div className="mt-8 flex flex-col items-center gap-2">
                <p className="text-[10px] text-slate-600 font-bold uppercase tracking-wider">
                  Need strategic assistance?
                </p>
                <a 
                  href="mailto:support@trendai.com" 
                  className="text-xs font-black hover:underline flex items-center gap-2"
                  style={{ color: currentPlanFeatures.color }}
                >
                  <Mail size={14} />
                  support@trendai.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
