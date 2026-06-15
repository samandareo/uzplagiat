import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "UzPlagiat - O'zbek Tili Ilmiy Plagiat Detektori",
  description: "Sun'iy intellekt va SBERT texnologiyasi asosida ishlaydigan aqlli tizim.",
};

import { I18nProvider } from "@/i18n/I18nProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uz" className={inter.className}>
      <body className="min-h-screen bg-slate-50 text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
        <AuthProvider>
          <I18nProvider>
            <main className="relative flex flex-col min-h-screen">
              {children}
            </main>
          </I18nProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
