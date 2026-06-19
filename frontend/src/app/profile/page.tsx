"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import axios from "axios";
import { User, Lock, Loader2, Save, CheckCircle, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function ProfilePage() {
  const { t } = useTranslation();
  const { isAuthenticated, token } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isPremium, setIsPremium] = useState(false);
  const [subscribedAt, setSubscribedAt] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await axios.get("https://api.samandareo.uz/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setEmail(res.data.email);
        setIsPremium(res.data.is_premium);
        setSubscribedAt(res.data.subscribed_at || null);
      } catch (err) {
        console.error("Failed to fetch profile", err);
      } finally {
        setFetching(false);
      }
    };

    fetchProfile();
  }, [isAuthenticated, token, router]);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setError(t('profile.error_short'));
      return;
    }
    setLoading(true);
    setError("");
    setMessage("");

    try {
      await axios.post(
        "https://api.samandareo.uz/api/auth/update-password",
        { new_password: newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(t('profile.success'));
      setNewPassword("");
    } catch (err: any) {
      setError(err.response?.data?.detail || t('profile.error_general'));
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 relative">
      <div className="absolute top-4 right-4 sm:top-12 sm:right-6 z-10">
        <LanguageSwitcher />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-soft border border-slate-200 overflow-hidden"
      >
        <div className="border-b border-slate-200 p-8 flex items-center gap-4 bg-slate-50">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-blue-600" />
          </div>
          <div className="flex-grow">
            <h1 className="text-2xl font-bold text-slate-900">{t('profile.title')}</h1>
            <p className="text-slate-500 font-medium">{email}</p>
          </div>
          <div className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-1.5 ${
            isPremium
              ? 'bg-blue-100 text-blue-700'
              : 'bg-slate-100 text-slate-600'
          }`}>
            {isPremium ? <><Zap className="w-4 h-4 text-yellow-500" /> Premium</> : 'Free Plan'}
          </div>
        </div>

        <div className="p-8">
          <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Lock className="w-5 h-5 text-slate-400" />
            {t('profile.update_pass')}
          </h2>

          <form onSubmit={handleUpdatePassword} className="space-y-6 max-w-md">
            {error && (
              <div className="p-4 bg-red-50 text-red-700 rounded-xl text-sm border border-red-100">
                {error}
              </div>
            )}
            {message && (
              <div className="p-4 bg-emerald-50 text-emerald-700 rounded-xl text-sm border border-emerald-100 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                {message}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">{t('profile.new_pass')}</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder={t('profile.new_pass_placeholder')}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !newPassword}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold rounded-xl transition-colors flex items-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {t('profile.save')}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
