"use client";

import { Lock, Sparkles, LogIn, UserPlus } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "react-i18next";

export default function PaywallOverlay() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token"); // or from useAuth if available
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await axios.post("https://api.samandareo.uz/api/checkout/create-session", {}, { headers });
      if (res.data.url) {
        window.location.href = res.data.url;
      }
    } catch (error) {
      console.error("Checkout xatosi (Checkout error):", error);
      alert("Xatolik yuz berdi. Iltimos qayta urinib ko'ring.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-10 rounded-2xl max-w-md w-full text-center border border-slate-200 shadow-soft flex flex-col items-center relative overflow-hidden">
      <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-6">
        <Lock className="w-8 h-8 text-blue-600" />
      </div>
      
      {!isAuthenticated ? (
        <>
          <h3 className="text-2xl font-bold text-slate-900 mb-3">{t('paywall.title')}</h3>
          <p className="text-slate-600 mb-8 leading-relaxed">
            {t('paywall.desc')}
          </p>
          
          <div className="flex flex-col gap-3 w-full">
            <Link 
              href="/login"
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <LogIn className="w-5 h-5" />
              {t('nav.login')}
            </Link>
            <Link 
              href="/register"
              className="w-full py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors flex items-center justify-center gap-2 border border-slate-200"
            >
              <UserPlus className="w-5 h-5" />
              {t('nav.register')}
            </Link>
          </div>
        </>
      ) : (
        <>
          <h3 className="text-2xl font-bold text-slate-900 mb-3">{t('paywall.title')}</h3>
          <p className="text-slate-600 mb-8 leading-relaxed">
            {t('paywall.desc')}
          </p>
          
          <div className="bg-slate-50 p-5 rounded-xl mb-8 w-full text-left border border-slate-100">
            <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              Premium afzalliklari:
            </h4>
            <ul className="text-sm text-slate-700 space-y-3 font-medium">
              <li className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                {t('paywall.benefits.unlimited')}
              </li>
              <li className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                {t('paywall.benefits.max_words')}
              </li>
              <li className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                {t('paywall.benefits.priority')}
              </li>
            </ul>
          </div>

          <button
            onClick={handleUpgrade}
            disabled={loading}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:bg-blue-400"
          >
            {loading ? "..." : t('paywall.upgrade_btn')}
          </button>
        </>
      )}
    </div>
  );
}
