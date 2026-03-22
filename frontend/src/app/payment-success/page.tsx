"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import PaymentSuccessModal from "@/components/PaymentSuccessModal";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  
  const paymentData = {
    payment_id: searchParams.get('payment_id') || `pay_${Date.now()}`,
    order_id: searchParams.get('order_id') || `order_${Date.now()}`,
    plan: searchParams.get('plan') || 'Enterprise Dominance',
    amount: searchParams.get('amount') || '0',
    currency: searchParams.get('currency') || 'INR',
    billing: searchParams.get('billing') || 'yearly'
  };

  return (
    <PaymentSuccessModal 
      isOpen={true} 
      onClose={() => {}} 
      paymentData={paymentData} 
      isPage={true} 
    />
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center text-white font-black italic tracking-tighter">INITIALIZING NEURAL CONFIRMATION...</div>}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
