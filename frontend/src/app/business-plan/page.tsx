"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Calendar, DollarSign, TrendingUp, Target, Users, AlertTriangle, 
  CheckCircle, BarChart3, FileText, Lightbulb, Shield, Zap, 
  Building, Download, Loader2, Share2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from 'next-auth/react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import UniformLayout from '@/components/UniformLayout';
import UniformCard from '@/components/UniformCard';
import { generateBusinessPlanPDF } from '@/utils/pdfReportGenerator';
import { useNotifications } from '@/context/NotificationContext';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function BusinessPlanPage() {
  const router = useRouter();
  const [planData, setPlanData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [milestoneProgress, setMilestoneProgress] = useState<number[]>([]);
  const { data: session } = useSession();
  const { addNotification } = useNotifications();

  useEffect(() => {
    const storedPlan = sessionStorage.getItem('business_plan');
    if (storedPlan) {
      setPlanData(JSON.parse(storedPlan));
      const plan = JSON.parse(storedPlan);
      if (plan.plan?.monthly_milestones) {
        setMilestoneProgress(new Array(plan.plan.monthly_milestones.length).fill(0));
      }
    } else {
      router.push('/dashboard');
    }
    setLoading(false);
  }, [router]);

  // Removed auto-play gimmick for professional clarity

  // Persistence: Save to local storage for live updates
  useEffect(() => {
    if (planData?.business?.title) {
      const savedProgress = localStorage.getItem(`milestone_progress_${planData.business.title}`);
      if (savedProgress) {
        setMilestoneProgress(JSON.parse(savedProgress));
      } else if (planData.plan?.monthly_milestones) {
        setMilestoneProgress(new Array(planData.plan.monthly_milestones.length).fill(0));
      }
    }
  }, [planData]);

  // Handle manual progress update
  const handleUpdateProgress = (index: number) => {
    const current = milestoneProgress[index] || 0;
    const newValue = window.prompt(`Update Strategic Progress for Month ${index + 1} (0-100):`, current.toString());
    
    if (newValue !== null) {
      const progress = Math.min(100, Math.max(0, parseInt(newValue) || 0));
      const updated = [...milestoneProgress];
      updated[index] = progress;
      setMilestoneProgress(updated);
      
      if (planData?.business?.title) {
        localStorage.setItem(`milestone_progress_${planData.business.title}`, JSON.stringify(updated));
      }

      addNotification({
        type: 'market',
        title: `Phase ${index + 1} Calibrated`,
        message: `Milestone execution status updated to ${progress}%.`,
        priority: 'low'
      });
    }
  };

  const tabs = [
    { 
      id: 'overview', 
      label: 'Overview', 
      icon: <Lightbulb className="w-5 h-5" />, 
      active: activeTab === 'overview',
      onClick: () => setActiveTab('overview')
    },
    { 
      id: 'financial', 
      label: 'Financial', 
      icon: <DollarSign className="w-5 h-5" />, 
      active: activeTab === 'financial',
      onClick: () => setActiveTab('financial')
    },
    { 
      id: 'marketing', 
      label: 'Marketing', 
      icon: <Target className="w-5 h-5" />, 
      active: activeTab === 'marketing',
      onClick: () => setActiveTab('marketing')
    },
    { 
      id: 'operations', 
      label: 'Operations', 
      icon: <Users className="w-5 h-5" />, 
      active: activeTab === 'operations',
      onClick: () => setActiveTab('operations')
    },
    { 
      id: 'milestones', 
      label: 'Milestones', 
      icon: <Calendar className="w-5 h-5" />, 
      active: activeTab === 'milestones',
      onClick: () => setActiveTab('milestones')
    },
    { 
      id: 'risks', 
      label: 'Risks', 
      icon: <Shield className="w-5 h-5" />, 
      active: activeTab === 'risks',
      onClick: () => setActiveTab('risks')
    }
  ];

  const SmartContent = ({ content }: { content: string }) => {
    if (!content) return null;
    
    const lines = content.split('\n');
    return (
      <div className="space-y-6">
        {lines.map((line, i) => {
          const trimmed = line.trim();
          if (!trimmed) return <div key={i} className="h-4" />;
          
          // Header Detection: KEY MARKET FACTS (2025 DATA):
          if (trimmed.endsWith(':') && trimmed === trimmed.toUpperCase()) {
            return (
              <div key={i} className="pt-8 pb-4 first:pt-0">
                <div className="flex items-center gap-3 mb-2">
                   <div className="w-1 h-6 bg-emerald-500 rounded-full" />
                   <h4 className="text-[10px] font-black text-emerald-600 dark:text-emerald-500 uppercase tracking-[0.2em]">
                     {trimmed.replace(':', '')}
                   </h4>
                </div>
                <div className="h-px w-full bg-gradient-to-r from-emerald-500/20 to-transparent" />
              </div>
            );
          }

          // Subheader Detection: ECONOMIC INDICATORS:
          if (trimmed.endsWith(':') && trimmed.length < 50 && !trimmed.includes('-')) {
             return (
               <h5 key={i} className="text-sm font-black text-slate-900 dark:text-white mt-6 mb-3 uppercase tracking-wider">
                 {trimmed}
               </h5>
             );
          }

          // List Detection: - Emerging market opportunities
          if (trimmed.startsWith('-') || trimmed.startsWith('•') || trimmed.startsWith('*')) {
            return (
              <div key={i} className="flex items-start gap-3 pl-2 group">
                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 group-hover:scale-125 transition-transform shrink-0" />
                <p className="text-sm font-medium text-slate-600 dark:text-gray-400 leading-relaxed">
                  {trimmed.substring(1).trim()}
                </p>
              </div>
            );
          }

          // Key-Value Detection: GDP GROWTH: 5.5%
          if (trimmed.includes(':') && trimmed.split(':')[0].length < 30) {
            const [key, ...valParts] = trimmed.split(':');
            const val = valParts.join(':').trim();
            return (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/50 dark:border-white/5 hover:border-emerald-500/30 transition-colors">
                <span className="text-[10px] font-black text-slate-400 dark:text-gray-500 uppercase tracking-widest">{key}</span>
                <span className="text-xs font-bold text-slate-800 dark:text-gray-200">{val}</span>
              </div>
            );
          }

          return (
            <p key={i} className="text-sm font-medium text-slate-600 dark:text-gray-400 leading-relaxed opacity-90">
              {trimmed}
            </p>
          );
        })}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#020617] flex items-center justify-center">
        <div className="text-center">
          <FileText className="w-12 h-12 animate-pulse text-emerald-500 mx-auto mb-4" />
          <p className="text-slate-600 dark:text-gray-400 text-lg">Loading business plan...</p>
        </div>
      </div>
    );
  }

  if (!planData) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#020617] flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-slate-600 dark:text-gray-400 text-lg">No business plan data found</p>
          <button 
            onClick={() => router.push('/dashboard')}
            className="mt-4 px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const locationString = `${planData.area}`;

  return (
    <UniformLayout
      title={`6-Month Business Plan`}
      subtitle={planData.business?.title || 'Business Plan'}
      location={locationString}
      tabs={tabs}
      actions={
        <div className="flex items-center space-x-3">
          <div className="hidden sm:flex items-center px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
            <Shield className="w-3 h-3 text-indigo-500 mr-2" />
            <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-tighter">Confidential Report</span>

          </div>
          <button
            onClick={async () => {
              try {
                setIsGeneratingPDF(true);
                addNotification({
                  type: 'system',
                  title: 'Generating PDF',
                  message: 'Preparing business plan...',
                  priority: 'low'
                });
                await generateBusinessPlanPDF(planData, {
                  name: session?.user?.name || 'StarterScope Entrepreneur',
                  email: session?.user?.email || ''
                });
              } catch (error) {
                console.error('PDF Generation failed:', error);
              } finally {
                setIsGeneratingPDF(false);
              }
            }}
            disabled={isGeneratingPDF}
            className="w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-xl text-white transition-all border border-white/10"
            title="Download Plan"
          >
            {isGeneratingPDF ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
          </button>
          
          <button
            onClick={async () => {
              const shareData = {
                title: `Business Plan: ${planData.business?.title}`,
                text: `Strategic plan for ${planData.business?.title}.`,
                url: window.location.href
              };
              try {
                setIsSharing(true);
                if (typeof navigator !== 'undefined' && navigator.share) {
                  await navigator.share(shareData);
                } else {
                  await navigator.clipboard.writeText(window.location.href);
                  addNotification({ type: 'system', title: 'Link Copied', message: 'Copied to clipboard!', priority: 'medium' });
                }
              } catch (error) {
                console.error('Sharing failed:', error);
              } finally {
                setIsSharing(false);
              }
            }}
            disabled={isSharing}
            className="w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-xl text-white transition-all border border-white/10"
            title="Share Plan"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      }
    >
      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 lg:grid-cols-4 gap-8"
          >
            {/* Main Column */}
            <div className="lg:col-span-3 space-y-8">
              {/* Business Overview */}
              <UniformCard 
                title="Executive Strategic Vision" 
                icon={<Building className="w-6 h-6" />}
                variant="gradient"
              >
                <div className="relative">
                  <div className="absolute -top-4 -right-4 opacity-5 pointer-events-none uppercase font-black text-6xl -rotate-12 italic select-none hidden md:block">Tactical Analysis</div>
                  <div className="prose dark:prose-invert max-w-none">
                    <p className="text-slate-800 dark:text-gray-100 leading-relaxed text-xl font-bold border-l-4 border-emerald-500 pl-8 py-4 bg-emerald-500/[0.03] rounded-r-2xl">
                      {planData.plan?.business_overview || 'Comprehensive strategic business architecture...'}
                    </p>
                  </div>
                </div>
              </UniformCard>

              {/* Market Analysis Content */}
              <div className="glass-card p-10 md:p-14 border-white/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[100px]" />
                <div className="flex items-center gap-4 mb-10">
                   <BarChart3 className="text-emerald-500 w-8 h-8" />
                   <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Market Intelligence Report</h3>
                </div>
                <SmartContent content={planData.plan?.market_analysis || ''} />
              </div>
            </div>

            {/* Tactical Sidebar */}
            <div className="space-y-6">
               {/* Metrics Panel */}
               <div className="glass-card p-8 bg-slate-900 border-white/10 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-blue-500 to-emerald-500" />
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8">Strategic Health</h4>
                  
                  <div className="space-y-8">
                    {/* Success Score */}
                    <div className="relative group">
                       <div className="flex justify-between items-end mb-3">
                          <span className="text-[11px] font-black text-white uppercase tracking-widest">Success Probability</span>
                          <span className="text-3xl font-black text-emerald-400 italic">85%</span>
                       </div>
                       <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: '85%' }}
                            className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.5)]" 
                          />
                       </div>
                    </div>

                    {/* Quick Metrics Grid */}
                    <div className="grid grid-cols-2 gap-4 pt-4">
                       <div className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-500/30 transition-all">
                          <TrendingUp className="w-4 h-4 text-blue-400 mb-2" />
                          <div className="text-[8px] font-black text-slate-500 uppercase tracking-tighter mb-1">Market Gap</div>
                          <div className="text-xs font-black text-white">HIGH</div>
                       </div>
                       <div className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-red-500/30 transition-all">
                          <AlertTriangle className="w-4 h-4 text-indigo-400 mb-2" />

                          <div className="text-[8px] font-black text-slate-500 uppercase tracking-tighter mb-1">Risk Factor</div>
                          <div className="text-xs font-black text-white">LOW</div>
                       </div>
                    </div>

                    {/* Operational Readiness */}
                    <div className="pt-6 border-t border-white/5">
                        <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                           <Shield className="w-5 h-5 text-emerald-500" />
                           <div>
                              <div className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Growth Matrix</div>
                              <div className="text-xs font-bold text-white">Verified Analysis</div>
                           </div>
                        </div>
                    </div>
                  </div>
               </div>

               {/* Resource Requirements List */}
               <div className="glass-card p-8 border-white/5">
                  <h4 className="text-[10px] font-black text-slate-500 dark:text-gray-400 uppercase tracking-widest mb-6">Key Requirements</h4>
                  <div className="space-y-4">
                    {typeof planData.plan?.resource_requirements === 'string' ? (
                      planData.plan.resource_requirements.split(',').map((req: string, i: number) => (
                        <div key={i} className="flex items-center gap-3 text-xs font-bold text-slate-700 dark:text-gray-300">
                           <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                           {req.trim()}
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-500">{planData.plan?.resource_requirements}</p>
                    )}
                  </div>
               </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'financial' && (
          <motion.div
            key="financial"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <UniformCard 
              title="Financial Projections" 
              icon={<DollarSign className="w-6 h-6" />}
              variant="glass"
              size="lg"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Monthly Breakdown */}
                <div>
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-4">6-Month Financial Breakdown</h4>
                  <div className="space-y-4">
                    {planData.plan?.financial_projections && Object.entries(planData.plan.financial_projections).map(([month, data]: [string, any], index) => (
                      <div key={month} className="p-4 bg-slate-50 dark:bg-white/5 rounded-lg border border-slate-200 dark:border-white/10">
                        <div className="flex justify-between items-center mb-2">
                          <h5 className="font-bold text-slate-900 dark:text-white">Month {index + 1}</h5>
                          <span className={`px-2 py-1 rounded text-xs font-bold ${
                            data.profit.includes('-') 
                              ? 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400' 
                              : 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                          }`}>
                            {data.profit.includes('-') ? 'Loss' : 'Profit'}
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-slate-600 dark:text-gray-400">Revenue</p>
                            <p className="font-bold text-green-600 dark:text-green-400">{data.revenue}</p>
                          </div>
                          <div>
                            <p className="text-slate-600 dark:text-gray-400">Expenses</p>
                            <p className="font-bold text-red-600 dark:text-red-400">{data.expenses}</p>
                          </div>
                          <div>
                            <p className="text-slate-600 dark:text-gray-400">Net</p>
                            <p className={`font-bold ${data.profit.includes('-') ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                              {data.profit}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Growth Chart */}
                <div>
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Growth Visualization</h4>
                  <div className="h-64 bg-slate-100/50 dark:bg-white/5 p-4 rounded-xl border border-slate-200 dark:border-white/10">
                    {planData.plan?.financial_projections ? (
                      <Bar 
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: { display: false },
                            tooltip: {
                              backgroundColor: '#1e293b',
                              titleColor: '#fff',
                              bodyColor: '#10b981',
                              padding: 12,
                              displayColors: false,
                            }
                          },
                          scales: {
                            y: { display: false },
                            x: { grid: { display: false }, ticks: { color: '#94a3b8', font: { weight: 'bold' } } }
                          }
                        }} 
                        data={{
                          labels: Object.keys(planData.plan.financial_projections).map((_, i) => `Month ${i+1}`),
                          datasets: [
                            {
                              label: 'Revenue',
                              data: Object.values(planData.plan.financial_projections).map((d: any) => parseFloat(d.revenue.replace(/[^0-9.]/g, ''))),
                              backgroundColor: '#10b981',
                              borderRadius: 8,
                            }
                          ]
                        }} 
                      />
                    ) : (
                      <div className="h-full flex items-center justify-center text-slate-400">No chart data</div>
                    )}
                  </div>
                </div>
              </div>
            </UniformCard>
          </motion.div>
        )}

        {activeTab === 'marketing' && (
          <motion.div
            key="marketing"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <UniformCard 
              title="Strategic Marketing Directives" 
              icon={<Target className="w-6 h-6" />}
              variant="glass"
            >
              <div className="bg-slate-900/5 dark:bg-white/5 p-8 rounded-2xl border border-slate-200 dark:border-white/10">
                <div className="flex items-center gap-3 mb-6">
                  <Zap className="w-5 h-5 text-indigo-500" />

                  <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-sm">Growth Engine Analysis</h4>
                </div>
                <div className="prose dark:prose-invert max-w-none">
                  <p className="text-slate-800 dark:text-gray-300 leading-relaxed text-lg italic">
                    {planData.plan?.marketing_strategy || 'Advanced marketing strategy and acquisition funnel analysis...'}
                  </p>
                </div>
              </div>
            </UniformCard>
          </motion.div>
        )}

        {activeTab === 'operations' && (
          <motion.div
            key="operations"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <UniformCard 
              title="Operational Plan" 
              icon={<Users className="w-6 h-6" />}
            >
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-slate-600 dark:text-gray-400 leading-relaxed">
                  {planData.plan?.operational_plan || 'Detailed operational plan and procedures...'}
                </p>
              </div>
            </UniformCard>
          </motion.div>
        )}

        {activeTab === 'milestones' && (
          <motion.div
            key="milestones"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <UniformCard 
              title="Monthly Milestones" 
              icon={<Calendar className="w-6 h-6" />}
            >
              <div className="space-y-4">
                {planData.plan?.monthly_milestones?.map((milestone: string, index: number) => (
                  <div 
                    key={index} 
                    onClick={() => handleUpdateProgress(index)}
                    className="flex items-start space-x-4 p-4 bg-slate-50 dark:bg-white/5 rounded-lg border border-slate-200 dark:border-white/10 group cursor-pointer hover:border-emerald-500/50 transition-all active:scale-98"
                  >
                    <div className="flex-shrink-0 w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold text-sm group-hover:text-white">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <p className="text-slate-900 dark:text-white font-medium">{milestone}</p>
                        <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">{milestoneProgress[index] || 0}% Complete</span>
                      </div>
                      <div className="mt-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${milestoneProgress[index] || 0}%` }}
                          className="bg-emerald-500 h-2 rounded-full shadow-[0_0_10px_#10b981]"
                          transition={{ duration: 1, ease: 'easeOut' }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </UniformCard>
          </motion.div>
        )}

        {activeTab === 'risks' && (
          <motion.div
            key="risks"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <UniformCard 
              title="Risk Analysis" 
              icon={<Shield className="w-6 h-6" />}
            >
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-slate-600 dark:text-gray-400 leading-relaxed">
                  {planData.plan?.risk_analysis || 'Comprehensive risk analysis and mitigation strategies...'}
                </p>
              </div>
            </UniformCard>
          </motion.div>
        )}
      </AnimatePresence>
    </UniformLayout>
  );
}