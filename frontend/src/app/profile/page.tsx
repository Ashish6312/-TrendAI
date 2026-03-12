"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { User, Mail, Phone, FileText, Loader2, Save, CheckCircle2, ArrowLeft } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { motion } from "framer-motion";

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
    <div className="max-w-4xl mx-auto px-6 py-12">
      <motion.button 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => router.back()} 
        className="group flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 text-gray-400 hover:text-white transition-all w-fit mb-12"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        <span className="text-xs font-black uppercase tracking-[0.2em]">{t("road_return")}</span>
      </motion.button>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-10 md:p-14 bg-gradient-to-br from-blue-600/10 via-transparent to-indigo-600/10 border-white/10 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/5 rounded-full blur-[100px] -mr-48 -mt-48 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-600/5 rounded-full blur-[100px] -ml-32 -mb-32 animate-pulse delay-1000" />
        
        <div className="flex flex-col md:flex-row items-center gap-12 mb-16 relative z-10">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
            <img 
              src={formData.image_url || `https://ui-avatars.com/api/?name=${formData.name}`} 
              className="relative w-36 h-36 rounded-[2.5rem] border-2 border-white/20 shadow-2xl group-hover:border-blue-500/50 transition-all duration-500 object-cover"
              alt="Profile"
            />
            <div className="absolute -bottom-2 -right-2 bg-blue-600 rounded-2xl p-2.5 shadow-2xl border border-white/20">
              <User size={18} className="text-white" />
            </div>
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <div className="inline-block px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-lg text-[10px] font-black text-blue-500 uppercase tracking-widest mb-4">Account Verified</div>
            <h1 className="text-5xl font-black text-white tracking-tighter mb-3">{t("prof_header")}</h1>
            <p className="text-gray-400 font-bold flex items-center justify-center md:justify-start gap-2 text-sm">
              <Mail size={16} className="text-blue-500" />
              {session?.user?.email}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] pl-1">{t("prof_name")}</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                <User className="text-gray-600 group-focus-within:text-blue-500 transition-colors" size={18} />
              </div>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="bg-white/[0.03] border border-white/10 text-white text-sm font-bold rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 block w-full pl-12 pr-5 py-4.5 transition-all placeholder:text-gray-700"
                required
                placeholder={t("prof_placeholder_name")}
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] pl-1">{t("prof_phone")}</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                <Phone className="text-gray-600 group-focus-within:text-blue-500 transition-colors" size={18} />
              </div>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="bg-white/[0.03] border border-white/10 text-white text-sm font-bold rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 block w-full pl-12 pr-5 py-4.5 transition-all placeholder:text-gray-700"
                placeholder={t("prof_placeholder_phone")}
              />
            </div>
          </div>

          <div className="md:col-span-2 space-y-3">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] pl-1">{t("prof_bio")}</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-5 pt-5 flex items-start pointer-events-none">
                <FileText className="text-gray-600 group-focus-within:text-blue-500 transition-colors" size={18} />
              </div>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({...formData, bio: e.target.value})}
                className="bg-white/[0.03] border border-white/10 text-white text-sm font-bold rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 block w-full pl-12 pr-5 py-5 transition-all min-h-[140px] placeholder:text-gray-700"
                placeholder={t("prof_placeholder_bio")}
              />
            </div>
          </div>

          <div className="md:col-span-2 pt-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <button
              type="submit"
              disabled={saving}
              className="w-full md:w-auto h-16 px-14 premium-gradient text-white font-black uppercase tracking-[0.2em] rounded-2xl text-[11px] flex justify-center items-center gap-3 transition-all shadow-2xl shadow-blue-600/20 hover:shadow-blue-600/40 hover:-translate-y-1 active:translate-y-0 disabled:opacity-50"
            >
              {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
              {t("prof_save")}
            </button>

            {message && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3 text-green-400 font-black uppercase tracking-widest text-xs"
              >
                <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center">
                   <CheckCircle2 size={18} />
                </div>
                {message}
              </motion.div>
            )}
          </div>
        </form>
      </motion.div>
    </div>
  );
}
