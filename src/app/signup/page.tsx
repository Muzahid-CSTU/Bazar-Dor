"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";

const SignupPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<"google" | "github" | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const name = (formData.get("name") as string)?.trim();
    const email = (formData.get("email") as string)?.trim();
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (!name) {
      toast.error("অনুগ্রহ করে আপনার নাম দিন।");
      return;
    }

    if (!email) {
      toast.error("অনুগ্রহ করে একটি সঠিক ইমেইল দিন।");
      return;
    }

    if (password.length < 8) {
      toast.error("পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে।");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("পাসওয়ার্ড দুটি মেলেনি!");
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await authClient.signUp.email({
        name,
        email,
        password,
        callbackURL: "/",
      });

      if (error) {
        toast.error(error.message || "অ্যাকাউন্ট তৈরি করতে সমস্যা হয়েছে।");
        return;
      }

      if (data) {
        toast.success("অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে!");
        router.push("/");
        router.refresh();
      }
    } catch {
      toast.error("অ্যাকাউন্ট তৈরি করা যায়নি। আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSignIn = async (provider: "google" | "github") => {
    setSocialLoading(provider);
    try {
      localStorage.setItem(
        "auth_toast_message",
        `${provider === "google" ? "Google" : "GitHub"} অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে!`
      );

      await authClient.signIn.social({
        provider,
        callbackURL: "/",
      });
    } catch {
      localStorage.removeItem("auth_toast_message");
      toast.error(`${provider === "google" ? "Google" : "GitHub"} অ্যাকাউন্ট সংযুক্ত করা যায়নি!`);
      setSocialLoading(null);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#f3f6f4] px-4 py-10">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-gray-800">
          অ্যাকাউন্ট তৈরি করুন
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          বিনা খরচে সাইন আপ করে সব বিস্তারিত দাম দেখুন।
        </p>
      </div>

      <div className="w-full max-w-sm rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-gray-700">
              নাম
            </label>
            <input
              name="name"
              type="text"
              placeholder="যেমন: রহিম উদ্দিন"
              disabled={loading || !!socialLoading}
              className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm text-gray-800 placeholder-gray-400 outline-none transition focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 disabled:bg-gray-50"
              required
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-gray-700">
              ইমেইল
            </label>
            <input
              name="email"
              type="email"
              placeholder="you@example.com"
              disabled={loading || !!socialLoading}
              className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm text-gray-800 placeholder-gray-400 outline-none transition focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 disabled:bg-gray-50"
              required
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-gray-700">
              পাসওয়ার্ড
            </label>
            <input
              name="password"
              type="password"
              placeholder="কমপক্ষে ৮ অক্ষর"
              disabled={loading || !!socialLoading}
              className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm text-gray-800 placeholder-gray-400 outline-none transition focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 disabled:bg-gray-50"
              required
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-gray-700">
              পাসওয়ার্ড নিশ্চিত করুন
            </label>
            <input
              name="confirmPassword"
              type="password"
              placeholder="আবার লিখুন"
              disabled={loading || !!socialLoading}
              className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm text-gray-800 placeholder-gray-400 outline-none transition focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 disabled:bg-gray-50"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading || !!socialLoading}
            className="mt-2 flex w-full items-center justify-center rounded-lg bg-[#058241] py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#046e37] disabled:opacity-70"
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                অ্যাকাউন্ট তৈরি হচ্ছে...
              </span>
            ) : (
              "অ্যাকাউন্ট তৈরি করুন"
            )}
          </button>
        </form>

        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <span className="relative bg-white px-2 text-xs text-gray-400">
            অথবা
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            disabled={loading || !!socialLoading}
            onClick={() => handleSocialSignIn("google")}
            className="flex items-center justify-center gap-1.5 rounded-lg border border-gray-200 py-2 px-2 text-xs font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-70"
          >
            <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24">
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
            <span>{socialLoading === "google" ? "লোডিং..." : "Google"}</span>
          </button>

          <button
            type="button"
            disabled={loading || !!socialLoading}
            onClick={() => handleSocialSignIn("github")}
            className="flex items-center justify-center gap-1.5 rounded-lg border border-gray-200 py-2 px-2 text-xs font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-70"
          >
            <svg
              className="h-3.5 w-3.5 shrink-0 fill-current text-gray-800"
              viewBox="0 0 24 24"
            >
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            <span>{socialLoading === "github" ? "লোডিং..." : "GitHub"}</span>
          </button>
        </div>

        <p className="mt-5 text-center text-xs text-gray-500">
          অ্যাকাউন্ট আছে?{" "}
          <Link
            href="/signin"
            className="font-semibold text-[#058241] hover:underline"
          >
            সাইন ইন করুন
          </Link>
        </p>
      </div>

      <Link
        href="/"
        className="mt-6 flex items-center gap-1 text-xs text-gray-400 transition hover:text-gray-600"
      >
        <span>←</span> হোম পেজে ফিরে যান
      </Link>
    </div>
  );
};

export default SignupPage;