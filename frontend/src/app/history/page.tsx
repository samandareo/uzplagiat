"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { Loader2, History as HistoryIcon, ArrowLeft, Percent } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/components/LanguageSwitcher";

interface HistoryItem {
  id: string;
  plagiarism_percentage: number;
  created_at: string;
  text_snippet: string;
}

export default function HistoryPage() {
  const { t } = useTranslation();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Basic protection: if AuthContext finishes loading and user is not auth
    if (!isAuthenticated && !localStorage.getItem("token")) {
      router.push("/login");
      return;
    }

    const fetchHistory = async () => {
      try {
        const res = await axios.get("https://api.samandareo.uz/api/plagiarism/history", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });
        setHistory(res.data);
      } catch (err) {
        console.error("Failed to fetch history:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [isAuthenticated, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-10 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 flex items-center justify-between relative">
          <div className="absolute top-0 right-0">
            <LanguageSwitcher />
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="p-2 hover:bg-gray-200 rounded-full transition-colors">
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <HistoryIcon className="w-8 h-8 text-indigo-600" />
              {t('history.title')}
            </h1>
          </div>
        </div>

        {history.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 text-center">
            <HistoryIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900">{t('history.empty_title')}</h3>
            <p className="mt-2 text-gray-500">{t('history.empty_desc')}</p>
            <Link 
              href="/" 
              className="mt-6 inline-block px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors"
            >
              {t('history.empty_btn')}
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((item, idx) => {
              const isHigh = item.plagiarism_percentage > 30;
              const isMod = item.plagiarism_percentage > 10 && !isHigh;
              
              return (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={item.id} 
                  className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col sm:flex-row gap-6 items-start sm:items-center"
                >
                  <div className={`flex-shrink-0 w-20 h-20 rounded-xl flex flex-col items-center justify-center ${
                    isHigh ? 'bg-red-50 text-red-600 border border-red-100' : 
                    isMod ? 'bg-orange-50 text-orange-600 border border-orange-100' : 
                    'bg-green-50 text-green-600 border border-green-100'
                  }`}>
                    <span className="text-2xl font-bold">{Math.round(item.plagiarism_percentage)}%</span>
                    <Percent className="w-4 h-4 opacity-70" />
                  </div>
                  
                  <div className="flex-grow">
                    <p className="text-gray-800 font-medium line-clamp-2 mb-2">"{item.text_snippet}"</p>
                    <p className="text-sm text-gray-500">
                      {t('history.date')}: {new Date(item.created_at).toLocaleString('uz-UZ')}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  );
}
