"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { getApiUrl } from "@/config/api";

export type SubscriptionPlan = 'free' | 'starter' | 'professional' | 'growth' | 'enterprise';

export interface SubscriptionTheme {
  primary: string;
  secondary: string;
  accent: string;
  gradient: string;
  badge: string;
  glow: string;
}

interface SubscriptionContextType {
  plan: SubscriptionPlan;
  theme: SubscriptionTheme;
  setPlan: (plan: SubscriptionPlan) => void;
  isSubscribed: boolean;
  planFeatures: {
    maxAnalyses: number;
    advancedFeatures: boolean;
    prioritySupport: boolean;
    customReports: boolean;
    apiAccess: boolean;
    competitorInsights: boolean;
    realTimeAlerts: boolean;
    exportToPdf: boolean;
    customBranding: boolean;
    dedicatedManager: boolean;
    whiteLabel: boolean;
    phoneSupport: boolean;
    advancedDashboard: boolean;
    customDataSources: boolean;
    planName: string;
    planDescription: string;
  };
  canAccessFeature: (feature: keyof typeof planFeatures.free) => boolean;
  getRemainingAnalyses: (currentCount: number) => number;
  hasReachedAnalysisLimit: (currentCount: number) => boolean;
  isLoading: boolean;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

const themes: Record<SubscriptionPlan, SubscriptionTheme> = {
  free: {
    primary: '#64748b', // Slate
    secondary: '#94a3b8',
    accent: '#475569',
    gradient: 'from-slate-600 to-slate-500',
    badge: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20',
    glow: 'shadow-[0_0_30px_-5px_rgba(100,116,139,0.3)]'
  },
  starter: {
    primary: '#0ea5e9', // Sky Blue
    secondary: '#38bdf8',
    accent: '#0284c7',
    gradient: 'from-sky-600 to-sky-500',
    badge: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20',
    glow: 'shadow-[0_0_30px_-5px_rgba(14,165,233,0.4)]'
  },
  professional: {
    primary: '#10b981', // Emerald
    secondary: '#34d399',
    accent: '#059669',
    gradient: 'from-emerald-600 to-emerald-500',
    badge: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    glow: 'shadow-[0_0_30px_-5px_rgba(16,185,129,0.4)]'
  },
  growth: {
    primary: '#f59e0b', // Amber
    secondary: '#fbbf24',
    accent: '#d97706',
    gradient: 'from-amber-600 to-amber-500',
    badge: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    glow: 'shadow-[0_0_30px_-5px_rgba(245,158,11,0.4)]'
  },
  enterprise: {
    primary: '#8b5cf6', // Violet/Purple
    secondary: '#a78bfa',
    accent: '#7c3aed',
    gradient: 'from-violet-600 to-violet-500',
    badge: 'bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20',
    glow: 'shadow-[0_0_30px_-5px_rgba(139,92,246,0.5)]'
  }
};

const planFeatures = {
  free: {
    maxAnalyses: 10,
    advancedFeatures: false,
    prioritySupport: false,
    customReports: false,
    apiAccess: false,
    competitorInsights: false,
    realTimeAlerts: false,
    exportToPdf: false,
    customBranding: false,
    dedicatedManager: false,
    whiteLabel: false,
    phoneSupport: false,
    advancedDashboard: false,
    customDataSources: false,
    planName: 'Explorer',
    planDescription: 'Essential AI tools to help you find and explore new business ideas.'
  },
  starter: {
    maxAnalyses: 100,
    advancedFeatures: true,
    prioritySupport: false,
    customReports: false,
    apiAccess: false,
    competitorInsights: false,
    realTimeAlerts: true,
    exportToPdf: false,
    customBranding: false,
    dedicatedManager: false,
    whiteLabel: false,
    phoneSupport: false,
    advancedDashboard: false,
    customDataSources: false,
    planName: 'Starter',
    planDescription: 'Enhanced tools for serious beginners and project validation.'
  },
  professional: {
    maxAnalyses: -1, // Unlimited
    advancedFeatures: true,
    prioritySupport: true,
    customReports: true,
    apiAccess: false,
    competitorInsights: true,
    realTimeAlerts: true,
    exportToPdf: true,
    customBranding: true,
    dedicatedManager: false,
    whiteLabel: false,
    phoneSupport: false,
    advancedDashboard: true,
    customDataSources: false,
    planName: 'Professional',
    planDescription: 'Unlimited business scans and advanced insights for growing entrepreneurs.'
  },
  growth: {
    maxAnalyses: -1, // Unlimited
    advancedFeatures: true,
    prioritySupport: true,
    customReports: true,
    apiAccess: true,
    competitorInsights: true,
    realTimeAlerts: true,
    exportToPdf: true,
    customBranding: true,
    dedicatedManager: false,
    whiteLabel: false,
    phoneSupport: true,
    advancedDashboard: true,
    customDataSources: true,
    planName: 'Growth Business',
    planDescription: 'Multi-location analysis and revenue forecasting for established businesses.'
  },
  enterprise: {
    maxAnalyses: -1, // Unlimited
    advancedFeatures: true,
    prioritySupport: true,
    customReports: true,
    apiAccess: true,
    competitorInsights: true,
    realTimeAlerts: true,
    exportToPdf: true,
    customBranding: true,
    dedicatedManager: true,
    whiteLabel: true,
    phoneSupport: true,
    advancedDashboard: true,
    customDataSources: true,
    planName: 'Enterprise Dominance',
    planDescription: 'Complete business solutions with API access and dedicated support for large organizations.'
  }
};

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const [plan, setPlanState] = useState<SubscriptionPlan>('free');
  const [isLoading, setIsLoading] = useState(true);

  // Ensure plan is always valid
  const validPlan = plan && ['free', 'starter', 'professional', 'growth', 'enterprise'].includes(plan) ? plan : 'free';

  // Fetch subscription plan from the authoritative profile endpoint
  const fetchSubscriptionPlan = async (): Promise<SubscriptionPlan | null> => {
    if (!session?.user?.email) return null;
    
    const email = session.user.email.toLowerCase().trim();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    
    try {
      // Use the profile endpoint which reconciles payment history (source of truth)
      const response = await fetch(`${apiUrl}/api/subscriptions/${email}`);
      
      if (response.ok) {
        const data = await response.json();
        
        // Enhanced mapping for plan names with fuzzy matching
        const rawPlanName = (data.plan_name || '').toLowerCase();
        const rawDisplayName = (data.plan_display_name || '').toLowerCase();
        
        let planToSet: SubscriptionPlan = 'free';
        
        if (rawPlanName.includes('enterprise') || 
            rawDisplayName.includes('enterprise') ||
            rawDisplayName.includes('territorial') ||
            rawDisplayName.includes('dominance') ||
            rawDisplayName.includes('dominator')) {
          planToSet = 'enterprise';
        } else if (rawPlanName.includes('growth') || 
                   rawDisplayName.includes('growth') ||
                   rawDisplayName.includes('accelerator')) {
          planToSet = 'growth';
        } else if (rawPlanName.includes('professional') || 
                   rawPlanName.includes('pro') || 
                   rawDisplayName.includes('professional') ||
                   rawDisplayName.includes('architect') ||
                   rawDisplayName.includes('pro')) {
          planToSet = 'professional';
        } else if (rawPlanName.includes('starter') || 
                   rawDisplayName.includes('starter') ||
                   rawDisplayName.includes('venture') ||
                   rawDisplayName.includes('strategist')) {
          planToSet = 'starter';
        } else {
          planToSet = 'free';
        }

        setPlanState(planToSet);
        localStorage.setItem(`subscription_${email}`, planToSet);
        return planToSet;
      }
    } catch (error) {
      console.error('❌ Subscription fetch error:', error);
    }
    
    return null;
  };

  // Load subscription plan from API (payment history is source of truth)
  useEffect(() => {
    const loadUserPlan = async () => {
      if (session?.user?.email) {
        const email = session.user.email.toLowerCase().trim();
        
        // Show cached plan immediately (instant UI, no flicker)
        const cachedPlan = localStorage.getItem(`subscription_${email}`);
        if (cachedPlan && ['free', 'starter', 'professional', 'growth', 'enterprise'].includes(cachedPlan)) {
          setPlanState(cachedPlan as SubscriptionPlan);
        }
        // Always re-fetch from backend (always overrides with truth)
        try {
          await fetchSubscriptionPlan();
        } catch (err) {
          console.error('❌ AI Terminal: Subscription fetch error:', err);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    loadUserPlan();
  }, [session?.user?.email]);

  const setPlan = (newPlan: SubscriptionPlan) => {
    // Validate the new plan before proceeding
    if (!newPlan || !['free', 'starter', 'professional', 'growth', 'enterprise'].includes(newPlan)) {
      console.warn('Invalid plan provided to setPlan:', newPlan);
      return;
    }

    // Additional safety check for browser environment
    if (typeof window === 'undefined') {
      console.warn('setPlan called in non-browser environment');
      return;
    }

    setPlanState(newPlan);
    if (session?.user?.email) {
      localStorage.setItem(`subscription_${session.user.email}`, newPlan);
    }
    
    // Update CSS custom properties for theme with extra safety
    const theme = themes[newPlan];
    if (theme && theme.primary && theme.secondary && theme.accent) {
      try {
        if (document?.documentElement?.style) {
          document.documentElement.style.setProperty('--subscription-primary', theme.primary);
          document.documentElement.style.setProperty('--subscription-secondary', theme.secondary);
          document.documentElement.style.setProperty('--subscription-accent', theme.accent);
        }
      } catch (error) {
        console.error('Error setting CSS properties:', error);
      }
    } else {
      console.warn('Theme not found or incomplete for plan:', newPlan, theme);
    }
    
    // Add plan-specific body class for global styling
    try {
      if (document?.body) {
        document.body.className = document.body.className.replace(/plan-\w+/g, '');
        document.body.classList.add(`plan-${newPlan}`);
      }
    } catch (error) {
      console.error('Error updating body class:', error);
    }
  };

  // Apply theme on mount and plan change
  useEffect(() => {
    // Browser environment check
    if (typeof window === 'undefined') return;
    
    const theme = themes[validPlan];
    if (theme && theme.primary && theme.secondary && theme.accent) {
      try {
        if (document?.documentElement?.style) {
          document.documentElement.style.setProperty('--subscription-primary', theme.primary);
          document.documentElement.style.setProperty('--subscription-secondary', theme.secondary);
          document.documentElement.style.setProperty('--subscription-accent', theme.accent);
        }
        
        // Add plan-specific body class
        if (document?.body) {
          document.body.className = document.body.className.replace(/plan-\w+/g, '');
          document.body.classList.add(`plan-${validPlan}`);
        }
      } catch (error) {
        console.error('Error applying theme:', error);
      }
    }
  }, [validPlan]);

  const isSubscribed = plan !== 'free';

  // Plan enforcement functions
  const canAccessFeature = (feature: keyof typeof planFeatures.free): boolean => {
    const currentPlanFeatures = planFeatures[validPlan as SubscriptionPlan];
    return !!currentPlanFeatures[feature as keyof typeof currentPlanFeatures];
  };

  const getRemainingAnalyses = (currentCount: number): number => {
    const currentPlanFeatures = planFeatures[validPlan as SubscriptionPlan];
    const maxAnalyses = currentPlanFeatures.maxAnalyses;
    if (maxAnalyses === -1) return -1; // Unlimited
    return Math.max(0, maxAnalyses - currentCount);
  };

  const hasReachedAnalysisLimit = (currentCount: number): boolean => {
    const currentPlanFeatures = planFeatures[validPlan as SubscriptionPlan];
    const maxAnalyses = currentPlanFeatures.maxAnalyses;
    if (maxAnalyses === -1) return false; // Unlimited
    return currentCount >= maxAnalyses;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <SubscriptionContext.Provider value={{
      plan: validPlan,
      theme: themes[validPlan] || themes.free, // Double fallback safety
      setPlan,
      isSubscribed: validPlan !== 'free',
      planFeatures: planFeatures[validPlan] || planFeatures.free, // Double fallback safety
      canAccessFeature,
      getRemainingAnalyses,
      hasReachedAnalysisLimit,
      isLoading
    }}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
}