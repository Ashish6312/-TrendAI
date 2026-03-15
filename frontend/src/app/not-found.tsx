"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AlertTriangle, Home, LogIn, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function NotFound() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (status === "loading") return;

    // If user is not authenticated, redirect to login after countdown
    if (!session) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            router.push('/api/auth/signin');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [session, status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* 404 Icon */}
          <div className="relative">
            <div className="w-24 h-24 mx-auto rounded-full bg-red-500/20 flex items-center justify-center border border-red-500/30">
              <AlertTriangle size={48} className="text-red-400" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">404</span>
            </div>
          </div>

          {/* Title */}
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-white">Page Not Found</h1>
            <p className="text-gray-400 text-lg">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </div>

          {/* Authentication-based content */}
          {!session ? (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                <p className="text-blue-300 text-sm mb-2">
                  You need to be logged in to access this page.
                </p>
                <p className="text-blue-400 font-semibold">
                  Redirecting to login in {countdown} seconds...
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/api/auth/signin"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-all hover:scale-105"
                >
                  <LogIn size={18} />
                  Login Now
                </Link>
                <Link
                  href="/"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-xl transition-all"
                >
                  <Home size={18} />
                  Go Home
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-600/30">
                <p className="text-slate-300 text-sm">
                  Welcome back, {session.user?.name}! The page you're looking for might have been moved or doesn't exist.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl transition-all hover:scale-105"
                >
                  <Home size={18} />
                  Go to Dashboard
                </Link>
                <button
                  onClick={() => router.back()}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-xl transition-all"
                >
                  <ArrowLeft size={18} />
                  Go Back
                </button>
              </div>
            </div>
          )}

          {/* Help text */}
          <div className="text-center">
            <p className="text-gray-500 text-sm">
              Need help? Contact our support team at{" "}
              <a 
                href="mailto:support@trendai.com" 
                className="text-blue-400 hover:text-blue-300 underline"
              >
                support@trendai.com
              </a>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}