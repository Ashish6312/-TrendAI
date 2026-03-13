"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { User, Mail, Phone, FileText, Loader2, Save, CheckCircle2, ArrowLeft, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { t } = useLanguage();
  
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    phone: "",
    image_url: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (session?.user?.email) {
        try {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
          const response = await fetch(`${apiUrl}/api/users/${session.user.email}`);
          if (response.ok) {
            const data = await response.json();
            setFormData({
              name: data.name || "",
              bio: data.bio || "",
              phone: data.phone || "",
              image_url: data.image_url || session.user.image || "",
            });
          }
        } catch (error) {
          console.error("Failed to fetch profile", error);
        } finally {
          setLoading(false);
        }
      }
    };

    if (status === "authenticated") {
      fetchProfile();
    }
  }, [session, status]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/api/users/${session?.user?.email}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessage(t("prof_updated"));
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (error) {
      console.error("Failed to update profile", error);
    } finally {
      setSaving(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex h-screen items-center justify-center flex-col gap-6">
        <Loader2 className="animate-spin text-blue-500 w-12 h-12" />
        <span className="text-xs font-black uppercase tracking-[0.3em] text-gray-500">{t("prof_loading")}</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#020617]">
      {/* Immersive Background */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/profile_bg.png" 
          alt="Profile Background" 
          className="w-full h-full object-cover opacity-20 scale-105 blur-[2px] animate-pulse-slow"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/50 via-[#020617] to-[#020617]" />
      </div>

      <div className="max-w-4xl mx-auto px-6 py-24 relative z-10">
        <motion.button 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => router.back()} 
          className="group flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-emerald-500/20 text-gray-400 hover:text-white transition-all w-fit mb-12 shadow-xl backdrop-blur-xl"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs font-black uppercase tracking-[0.2em]">{t("road_return")}</span>
        </motion.button>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-10 md:p-14 bg-gradient-to-br from-emerald-600/10 via-transparent to-amber-600/5 border-white/10 relative overflow-hidden shadow-2xl"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-600/5 rounded-full blur-[100px] -mr-48 -mt-48 animate-pulse" />
          
          <div className="flex flex-col md:flex-row items-center gap-12 mb-16 relative z-10">
            <div className="relative group">
              <div className="absolute -inset-1.5 bg-gradient-to-r from-emerald-400 to-teal-600 rounded-[3rem] blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
              <img 
                src={formData.image_url || `https://ui-avatars.com/api/?name=${formData.name}`} 
                className="relative w-40 h-40 rounded-[2.5rem] border-2 border-white/20 shadow-2xl group-hover:border-emerald-400/50 transition-all duration-700 object-cover"
                alt="Profile"
              />
              <div className="absolute -bottom-2 -right-2 bg-emerald-600 rounded-2xl p-3 shadow-2xl border border-white/20">
                <User size={20} className="text-white" />
              </div>
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <div className="inline-block px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] mb-4">
                Growth Access Verified
              </div>
              <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tighter mb-4 leading-none">{t("prof_header")}</h1>
              <p className="text-gray-400 font-bold flex items-center justify-center md:justify-start gap-3 text-sm tracking-tight break-all">
                <Mail size={18} className="text-emerald-500 shrink-0" />
                {session?.user?.email}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-1">{t("prof_name")}</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                  <User className="text-gray-600 group-focus-within:text-emerald-500 transition-colors" size={18} />
                </div>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="bg-white/[0.03] border border-white/10 text-white text-sm font-bold rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/50 block w-full pl-12 pr-5 py-4.5 transition-all placeholder:text-gray-700 backdrop-blur-md"
                  required
                  placeholder={t("prof_placeholder_name")}
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] pl-1">{t("prof_phone")}</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                  <Phone className="text-gray-600 group-focus-within:text-emerald-500 transition-colors" size={18} />
                </div>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="bg-white/[0.03] border border-white/10 text-white text-sm font-bold rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/50 block w-full pl-12 pr-5 py-4.5 transition-all placeholder:text-gray-700 backdrop-blur-md"
                  placeholder={t("prof_placeholder_phone")}
                />
              </div>
            </div>

            <div className="md:col-span-2 space-y-3">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] pl-1">{t("prof_bio")}</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 pt-5 flex items-start pointer-events-none">
                  <FileText className="text-gray-600 group-focus-within:text-emerald-500 transition-colors" size={18} />
                </div>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                  className="bg-white/[0.03] border border-white/10 text-white text-sm font-bold rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/50 block w-full pl-12 pr-5 py-5 transition-all min-h-[160px] placeholder:text-gray-700 backdrop-blur-md"
                  placeholder={t("prof_placeholder_bio")}
                />
              </div>
            </div>

            <div className="md:col-span-2 pt-10 flex flex-col md:flex-row items-center justify-between gap-10">
              <button
                type="submit"
                disabled={saving}
                className="w-full md:w-auto h-18 px-16 growth-gradient text-white font-black uppercase tracking-[0.4em] rounded-[2rem] text-[11px] flex justify-center items-center gap-4 transition-all shadow-2xl shadow-emerald-600/20 hover:shadow-emerald-600/40 hover:-translate-y-2 active:scale-95 disabled:opacity-50"
              >
                {saving ? <Loader2 className="animate-spin" size={22} /> : <Save size={22} />}
                {t("prof_save")}
              </button>

              <AnimatePresence>
                {message && (
                  <motion.div 
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex items-center gap-4 text-emerald-400 font-black uppercase tracking-[0.2em] text-[10px] bg-emerald-500/5 px-6 py-3 rounded-2xl border border-emerald-500/10 shadow-lg"
                  >
                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                       <CheckCircle2 size={20} />
                    </div>
                    {message}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
