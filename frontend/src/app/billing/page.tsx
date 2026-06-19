"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import axios from "axios";
import { CreditCard, Loader2, CheckCircle, Zap, ShieldAlert } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function BillingPage() {
  const { t } = useTranslation();
  const { isAuthenticated, token } = useAuth();
  const router = useRouter();
  const [fetching, setFetching] = useState(true);
  const [profile, setProfile] = useState<any>(null);

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
        setProfile(res.data);
      } catch (err) {
        console.error("Failed to fetch profile", err);
      } finally {
        setFetching(false);
      }
    };

    fetchProfile();
  }, [isAuthenticated, token, router]);

  if (fetching) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const isPremium = profile?.is_premium;
  const checksUsed = profile?.checks_count || 0;
  const checksTotal = 5;

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 relative">
      <div className="absolute top-4 right-4 sm:top-12 sm:right-6">
        <LanguageSwitcher />
      </div>
      <h1 className="text-3xl font-extrabold text-slate-900 mb-8">{t('billing.title')}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Current Plan Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-soft border border-slate-200 p-8 flex flex-col h-full"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isPremium ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-600'}`}>
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{t('billing.current_plan')}</p>
              <h2 className="text-2xl font-bold text-slate-900">{isPremium ? t('billing.plan_premium') : t('billing.plan_free')}</h2>
            </div>
          </div>
          
          <div className="flex-grow">
            <p className="text-slate-600 mb-6">
              {isPremium 
                ? t('billing.desc_premium')
                : t('billing.desc_free')}
            </p>

            {!isPremium && (
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-slate-700">{t('billing.used')}</span>
                  <span className="font-bold text-slate-900">{checksUsed} / {checksTotal}</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2.5">
                  <div 
                    className={`h-2.5 rounded-full ${checksUsed >= checksTotal ? 'bg-red-500' : 'bg-blue-600'}`} 
                    style={{ width: `${Math.min((checksUsed / checksTotal) * 100, 100)}%` }}
                  ></div>
                </div>
                {checksUsed >= checksTotal && (
                  <p className="mt-3 text-sm text-red-600 flex items-center gap-1 font-medium">
                    <ShieldAlert className="w-4 h-4" /> {t('billing.limit_reached')}
                  </p>
                )}
              </div>
            )}
          </div>

          {!isPremium && (
            <Link 
              href="/pricing"
              className="mt-8 w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <Zap className="w-5 h-5" />
              {t('billing.upgrade_btn')}
            </Link>
          )}
        </motion.div>

        {/* Benefits Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-900 rounded-2xl shadow-soft p-8 text-white flex flex-col justify-center"
        >
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Zap className="w-6 h-6 text-yellow-400" />
            {t('billing.why_premium')}
          </h3>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <p className="text-slate-300 font-medium">{t('billing.benefit_1')}</p>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <p className="text-slate-300 font-medium">{t('billing.benefit_2')}</p>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <p className="text-slate-300 font-medium">{t('billing.benefit_3')}</p>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <p className="text-slate-300 font-medium">{t('billing.benefit_4')}</p>
            </li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
}
