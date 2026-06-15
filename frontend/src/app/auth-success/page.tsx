"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";

function AuthSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { login } = useAuth();

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      login(token);
    } else {
      router.push("/login");
    }
  }, [searchParams, login, router]);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center">
      <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
      <h2 className="text-xl font-semibold text-gray-700">Tizimga kirilmoqda...</h2>
      <p className="text-gray-500">Iltimos kuting (Please wait)</p>
    </div>
  );
}

export default function AuthSuccess() {
  return (
    <Suspense fallback={
      <div className="min-h-[80vh] flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
      </div>
    }>
      <AuthSuccessContent />
    </Suspense>
  );
}
