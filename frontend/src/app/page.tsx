"use client";

import PlagiarismChecker from "@/components/PlagiarismChecker";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { LogOut, History, User } from "lucide-react";

import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function Home() {
  const { isAuthenticated, logout } = useAuth();
  const { t } = useTranslation();

  return (
    <main className="min-h-screen bg-white selection:bg-blue-100 selection:text-blue-900">
      {/* Header / Navbar */}
      <nav className="sticky top-0 z-50 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center">
                <span className="text-white font-bold text-lg leading-none">U</span>
              </div>
              <span className="text-xl font-bold text-slate-900 tracking-tight">
                UzPlagiat
              </span>
            </div>

            <div className="flex items-center gap-4">
              {isAuthenticated ? (
                <div className="flex items-center gap-6">
                  <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
                    <Link href="/pricing" className="hover:text-blue-600 transition-colors">{t('nav.pricing')}</Link>
                    <Link href="/history" className="hover:text-blue-600 transition-colors">{t('nav.history')}</Link>
                    <Link href="/billing" className="hover:text-blue-600 transition-colors">{t('nav.billing')}</Link>
                    <Link href="/profile" className="hover:text-blue-600 transition-colors flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {t('nav.profile')}
                    </Link>
                  </div>
                  <div className="h-6 w-px bg-slate-200 hidden md:block"></div>
                  <LanguageSwitcher />
                  <button 
                    onClick={logout}
                    className="text-sm font-bold text-slate-600 hover:text-red-600 transition-colors"
                  >
                    {t('nav.logout')}
                  </button>
                </div>
              ) : (
                <>
                  <LanguageSwitcher />
                  <Link href="/login" className="text-slate-600 hover:text-blue-600 font-medium transition-colors text-sm">
                    {t('nav.login')}
                  </Link>
                  <Link href="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                    {t('nav.register')}
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 relative z-10 bg-slate-50">
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-blue-200 bg-blue-50 text-blue-700 text-xs font-semibold uppercase tracking-wider mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
            {t('home.badge')}
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4 leading-tight">
            {t('home.title_1')} <br className="hidden sm:block" />
            <span className="text-blue-600">
              {t('home.title_2')}
            </span>
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            {t('home.subtitle')}
          </p>
        </motion.div>

        {/* Main Checker App */}
        <PlagiarismChecker />
      </div>

      {/* Footer */}
      <footer className="mt-12 py-8 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
          <p>&copy; {new Date().getFullYear()} {t('home.footer')}</p>
        </div>
      </footer>
    </main>
  );
}
