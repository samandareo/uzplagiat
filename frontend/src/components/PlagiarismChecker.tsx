"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { Search, Loader2, AlertCircle } from "lucide-react";
import ResultsDashboard from "./ResultsDashboard";
import PaywallOverlay from "./PaywallOverlay";
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "react-i18next";

const MAX_FREE_CHECKS = 5;

export default function PlagiarismChecker() {
  const { t } = useTranslation();
  const { isAuthenticated, token } = useAuth();
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState("");
  const [checksCount, setChecksCount] = useState(0);
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    // Load local state
    const count = parseInt(localStorage.getItem("checksCount") || "0");
    setChecksCount(count);

    // Check if returning from successful Stripe checkout
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("success") === "true") {
      // Re-fetch user profile to get the real premium status from DB
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        axios.get("https://api.samandareo.uz/api/auth/me", {
          headers: { Authorization: `Bearer ${storedToken}` }
        }).then(res => {
          setIsPremium(res.data.is_premium);
        }).catch(() => {
          // fallback: assume premium since payment succeeded
          setIsPremium(true);
        });
      }
      // Clean up the URL
      window.history.replaceState({}, "", "/");
    } else if (token) {
      // Fetch real premium status on every load for logged-in users
      axios.get("https://api.samandareo.uz/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => {
        setIsPremium(res.data.is_premium);
      }).catch(() => {});
    }
  }, [token]);

  const handleCheck = async () => {
    if (!text.trim()) {
      setError("Iltimos, matn kiriting (Please enter text).");
      return;
    }

    if (!isAuthenticated && !isPremium && checksCount >= MAX_FREE_CHECKS) {
      return; // Handled by overlay
    }

    setLoading(true);
    setError("");
    setResults(null);

    try {
      const headers = isAuthenticated && token ? { Authorization: `Bearer ${token}` } : {};
      
      const response = await axios.post("https://api.samandareo.uz/api/plagiarism/check", {
        text: text
      }, { headers });

      setResults(response.data);
      
      if (!isAuthenticated && !isPremium) {
        const newCount = checksCount + 1;
        setChecksCount(newCount);
        localStorage.setItem("checksCount", newCount.toString());
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.detail || "Xatolik yuz berdi (An error occurred). Backend ishlayotganligini tekshiring.");
    } finally {
      setLoading(false);
    }
  };

  const showPaywall = !isAuthenticated && !isPremium && checksCount >= MAX_FREE_CHECKS;

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      <div className="relative z-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-soft border border-slate-200 overflow-hidden"
        >
          <div className="p-6 sm:p-8">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <Search className="w-5 h-5" />
              </div>
              {t('checker.check_btn')}
            </h2>
            <div className="relative group">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={t('checker.placeholder')}
                className="w-full h-72 p-5 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl outline-none resize-none text-base leading-relaxed placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-shadow"
                disabled={loading || showPaywall}
              />
              
              <AnimatePresence>
                {showPaywall && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 z-10 backdrop-blur-sm bg-white/60 flex items-center justify-center rounded-xl"
                  >
                    <PaywallOverlay />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-sm text-slate-500">
                {isAuthenticated ? (
                  <span className="text-blue-600 font-medium">{t('checker.logged_in')}</span>
                ) : !isPremium ? (
                  <span>
                    {t('checker.free_plan').replace('{{used}}', checksCount.toString()).replace('{{max}}', MAX_FREE_CHECKS.toString())}
                  </span>
                ) : (
                  <span className="text-blue-600 font-medium">{t('checker.premium_plan')}</span>
                )}
              </p>
              
              <button
                onClick={handleCheck}
                disabled={loading || showPaywall || !text.trim()}
                className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-md hover:-translate-y-0.5"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {t('checker.analyzing')}
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    {t('checker.check_btn')}
                  </>
                )}
              </button>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg flex items-center gap-2"
              >
                <AlertCircle className="w-5 h-5" />
                <p>{error}</p>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {results && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <ResultsDashboard results={results} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
