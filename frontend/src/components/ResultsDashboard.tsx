"use client";

import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle, FileText, Percent } from "lucide-react";
import { useTranslation } from "react-i18next";

interface FlaggedSentence {
  original_sentence: string;
  source_text: string;
  confidence_score: number;
  source_document: string;
}

interface ResultsProps {
  results: {
    plagiarism_percentage: number;
    total_sentences: number;
    flagged_sentences_count: number;
    flagged_sentences: FlaggedSentence[];
  };
}

export default function ResultsDashboard({ results }: ResultsProps) {
  const { t } = useTranslation();
  const getStatus = (percent: number) => {
    if (percent > 95) return { label: t('results.status.direct'), color: "text-red-600", stroke: "text-red-500" };
    if (percent > 85) return { label: t('results.status.strong_paraphrase'), color: "text-orange-600", stroke: "text-orange-500" };
    if (percent > 75) return { label: t('results.status.moderate_similarity'), color: "text-yellow-600", stroke: "text-yellow-500" };
    if (percent >= 50) return { label: t('results.status.low_similarity'), color: "text-blue-600", stroke: "text-blue-500" };
    return { label: t('results.status.original'), color: "text-emerald-600", stroke: "text-emerald-500" };
  };

  const status = getStatus(results.plagiarism_percentage);

  return (
    <div className="bg-white rounded-2xl shadow-soft border border-slate-200 overflow-hidden mt-8">
      <div className="p-6 sm:p-8 border-b border-slate-200 bg-slate-50">
        <h3 className="text-xl font-bold text-slate-900 mb-8">{t('results.title')}</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white border border-slate-200 shadow-sm rounded-xl p-6 flex flex-col items-center justify-center relative"
          >
            <span className="text-sm text-slate-500 font-medium mb-4 tracking-wide uppercase">{t('results.plagiarism_rate')}</span>
            
            {/* SVG Circular Progress */}
            <div className="relative flex items-center justify-center">
              <svg className="transform -rotate-90 w-32 h-32">
                <circle cx="64" cy="64" r="45" className="stroke-current text-slate-200" strokeWidth="8" fill="transparent" />
                <motion.circle 
                  initial={{ strokeDashoffset: 2 * Math.PI * 45 }}
                  animate={{ strokeDashoffset: (2 * Math.PI * 45) - (results.plagiarism_percentage / 100) * (2 * Math.PI * 45) }}
                  transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                  cx="64" cy="64" r="45" 
                  className={`stroke-current ${status.stroke}`} 
                  strokeWidth="8" 
                  fill="transparent" 
                  strokeDasharray={2 * Math.PI * 45} 
                  strokeLinecap="round" 
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className={`text-3xl font-extrabold ${status.color}`}>
                  {Math.round(results.plagiarism_percentage)}%
                </span>
              </div>
            </div>
            <div className={`mt-4 px-4 py-1.5 rounded-full text-sm font-bold ${status.color} bg-slate-50 border border-slate-200`}>
              {status.label}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-white border border-slate-200 shadow-sm rounded-xl p-6 flex flex-col items-center justify-center text-center hover:shadow-md transition-shadow"
          >
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
            <span className="text-sm text-slate-500 font-medium mb-1 uppercase tracking-wide">{t('results.flagged_sentences')}</span>
            <span className="text-4xl font-extrabold text-slate-800">
              {results.flagged_sentences_count}
            </span>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="bg-white border border-slate-200 shadow-sm rounded-xl p-6 flex flex-col items-center justify-center text-center hover:shadow-md transition-shadow"
          >
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-4">
              <FileText className="w-6 h-6 text-blue-500" />
            </div>
            <span className="text-sm text-slate-500 font-medium mb-1 uppercase tracking-wide">{t('results.total_sentences')}</span>
            <span className="text-4xl font-extrabold text-slate-800">
              {results.total_sentences}
            </span>
          </motion.div>
        </div>
      </div>

      {results.flagged_sentences.length > 0 ? (
        <div className="p-6 sm:p-8 bg-white">
          <h4 className="text-lg font-bold text-slate-900 mb-6">{t('results.sources_title')}</h4>
          <div className="space-y-6">
            {results.flagged_sentences.map((sentence, idx) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                key={idx} 
                className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm hover:shadow-soft transition-shadow relative overflow-hidden group"
              >
                <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
                <div className="mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider bg-red-100 text-red-700 px-3 py-1 rounded-full mb-3 inline-block">
                    {t('results.your_text')}
                  </span>
                  <p className="text-slate-800 font-medium text-lg leading-relaxed">{sentence.original_sentence}</p>
                </div>
                
                <div className="pl-5 border-l-2 border-indigo-200 mt-5 pt-2">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider bg-slate-100 text-slate-700 px-2 py-1 rounded-md">
                      {t('results.original_source')}
                    </span>
                    <span className="text-sm text-slate-600 flex items-center gap-1.5 font-medium">
                      <FileText className="w-4 h-4" />
                      {sentence.source_document}
                    </span>
                    <span className="text-sm font-bold text-red-600 ml-auto bg-red-50 px-2 py-1 rounded-md">
                      {Math.round(sentence.confidence_score)}% {t('results.similarity')}
                    </span>
                  </div>
                  <p className="text-slate-600 italic leading-relaxed">"{sentence.source_text}"</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ) : (
        <div className="p-12 flex flex-col items-center justify-center text-center bg-white">
          <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="w-8 h-8 text-emerald-600" />
          </div>
          <h4 className="text-xl font-bold text-slate-900 mb-2">{t('results.no_plagiarism')}</h4>
          <p className="text-slate-500 max-w-md text-lg font-light">
            {t('results.no_plagiarism_desc')}
          </p>
        </div>
      )}
    </div>
  );
}
