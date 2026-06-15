"use client";

import { CheckCircle, Zap } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function PricingPage() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const { isAuthenticated, token } = useAuth();
  const router = useRouter();

  const handleSubscribe = async () => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    setLoading(true);
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await axios.post("http://localhost:8000/api/checkout/create-session", {}, { headers });
      if (res.data.url) {
        window.location.href = res.data.url;
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert(t('pricing.error_checkout'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 relative">
      <div className="absolute top-4 right-4 sm:top-8 sm:right-8">
        <LanguageSwitcher />
      </div>
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
          {t('pricing.title')}
        </h1>
        <p className="text-xl text-slate-600">
          {t('pricing.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {/* Free Plan */}
        <div className="bg-white rounded-3xl shadow-soft border border-slate-200 p-8 sm:p-10 flex flex-col">
          <h3 className="text-2xl font-bold text-slate-900 mb-2">{t('pricing.free_title')}</h3>
          <p className="text-slate-500 mb-6">{t('pricing.free_desc')}</p>
          <div className="mb-8">
            <span className="text-5xl font-extrabold text-slate-900">{t('pricing.free_price')}</span>
            <span className="text-slate-500 font-medium ml-2">{t('pricing.free_period')}</span>
          </div>
          
          <ul className="space-y-4 mb-8 flex-grow">
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
              <span className="text-slate-700">{t('pricing.free_benefit_1')}</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
              <span className="text-slate-700">{t('pricing.free_benefit_2')}</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
              <span className="text-slate-700">{t('pricing.free_benefit_3')}</span>
            </li>
          </ul>

          <button 
            onClick={() => router.push("/")}
            className="w-full py-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl transition-colors"
          >
            {t('pricing.free_btn')}
          </button>
        </div>

        {/* Premium Plan */}
        <div className="bg-slate-900 rounded-3xl shadow-soft p-8 sm:p-10 flex flex-col relative overflow-hidden ring-2 ring-blue-500">
          <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs font-bold px-4 py-1.5 rounded-bl-xl uppercase tracking-wider">
            {t('pricing.premium_badge')}
          </div>
          
          <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
            {t('pricing.premium_title')} <Zap className="w-5 h-5 text-yellow-400" />
          </h3>
          <p className="text-slate-400 mb-6">{t('pricing.premium_desc')}</p>
          <div className="mb-8">
            <span className="text-5xl font-extrabold text-white">{t('pricing.premium_price')}</span>
            <span className="text-slate-400 font-medium ml-2">{t('pricing.premium_period')}</span>
          </div>
          
          <ul className="space-y-4 mb-8 flex-grow">
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <span className="text-slate-300">{t('pricing.premium_benefit_1')}</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <span className="text-slate-300">{t('pricing.premium_benefit_2')}</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <span className="text-slate-300">{t('pricing.premium_benefit_3')}</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <span className="text-slate-300">{t('pricing.premium_benefit_4')}</span>
            </li>
          </ul>

          <button 
            onClick={handleSubscribe}
            disabled={loading}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-bold rounded-xl transition-colors shadow-lg shadow-blue-900/50"
          >
            {loading ? t('pricing.premium_loading') : t('pricing.premium_btn')}
          </button>
        </div>
      </div>
    </div>
  );
}
