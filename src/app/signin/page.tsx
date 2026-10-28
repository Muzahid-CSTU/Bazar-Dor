"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import React, { useState } from "react";

const SigninPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const { data, error } = await authClient.signIn.email({
      email,
      password,
      callbackURL: "/",
    });

    setLoading(false);

    if (data) {
      router.push("/");
    }

    if (error) {
      setErrorMessage(error.message || "ইমেইল বা পাসওয়ার্ড ভুল হয়েছে।");
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f6f4] flex flex-col justify-center items-center py-10 px-4">
      {/* হেডার টেক্সট */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
          সাইন ইন
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          বিস্তারিত দাম, বাজার তুলনা ও প্রোফাইল দেখতে অ্যাকাউন্টে ঢুকুন।
        </p>
      </div>

      {/* কার্ড কন্টেইনার */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm w-full max-w-sm p-6 sm:p-8">
        <form onSubmit={onSubmit} className="space-y-4">
          {/* ইমেইল */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              ইমেইল
            </label>
            <input
              name="email"
              type="email"
              placeholder="you@example.com"
              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600 transition"
              required
            />
          </div>

          {/* পাসওয়ার্ড */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              পাসওয়ার্ড
            </label>
            <input
              name="password"
              type="password"
              placeholder="কমপক্ষে ৮ অক্ষর"
              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600 transition"
              required
            />
          </div>

          {/* এরর মেসেজ */}
          {errorMessage && (
            <p className="text-red-500 text-xs font-medium pt-1 text-center">
              {errorMessage}
            </p>
          )}

          {/* সাইন ইন বাটন */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#058241] hover:bg-[#046e37] text-white font-medium py-2.5 rounded-lg text-sm transition shadow-sm disabled:opacity-70 mt-2"
          >
            {loading ? "সাইন ইন হচ্ছে..." : "সাইন ইন"}
          </button>
        </form>

        {/* সেপারেটর */}
        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <span className="relative bg-white px-2 text-xs text-gray-400">
            অথবা
          </span>
        </div>

        {/* সোশ্যাল লগইন বাটন */}
        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            className="flex items-center justify-center gap-1.5 py-2 px-2 border border-gray-200 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 transition"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            Google দিয়ে চালিয়ে যান
          </button>

          <button
            type="button"
            className="flex items-center justify-center gap-1.5 py-2 px-2 border border-gray-200 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 transition"
          >
            <svg
              className="w-3.5 h-3.5 fill-current text-gray-800"
              viewBox="0 0 24 24"
            >
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            GitHub দিয়ে চালিয়ে যান
          </button>
        </div>

        {/* সাইন আপ লিঙ্ক */}
        <p className="text-center text-xs text-gray-500 mt-5">
          অ্যাকাউন্ট নেই?{" "}
          <Link
            href="/signup"
            className="text-[#058241] font-semibold hover:underline"
          >
            সাইন আপ করুন
          </Link>
        </p>
      </div>

      {/* হোম পেজে ফিরে যাওয়ার লিঙ্ক */}
      <Link
        href="/"
        className="mt-6 text-xs text-gray-400 hover:text-gray-600 transition flex items-center gap-1"
      >
        <span>←</span> হোম পেজে ফিরে যান
      </Link>
    </div>
  );
};

export default SigninPage;