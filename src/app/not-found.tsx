"use client";

import Link from "next/link";
import React from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";

const NotFound = () => {
  return (
    <div className="min-h-[calc(100vh-140px)] bg-[#f3f6f4] flex flex-col items-center justify-center px-4 py-16 text-center">
      {/* আইকন বা ইলাস্ট্রেশন */}
      <div className="relative mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-green-100/70 text-emerald-700 shadow-inner">
        <FaMagnifyingGlass className="h-9 w-9" />
      </div>

      {/* স্ট্যাটাস ব্যাজ */}
      <span className="mb-3 inline-block rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
        ৪০৪ — পেজ পাওয়া যায়নি
      </span>

      {/* হেডিং ও সাবটাইটেল */}
      <h1 className="text-2xl font-bold tracking-tight text-[#1a2a22] sm:text-3xl">
        দুঃখিত, আপনি যে পাতাটি খুঁজছেন তা পাওয়া যায়নি
      </h1>
      <p className="mx-auto mt-2 max-w-md text-sm text-gray-600">
        লিংকটি ভুল হতে পারে অথবা পণ্য ও ক্যাটাগরিটি সরিয়ে নেওয়া হয়েছে। বাজার দরের মূল পাতায় ফিরে গিয়ে আবার অনুসন্ধান করুন।
      </p>

      {/* হোম পেজে ফিরে যাওয়ার অ্যাকশন বাটন */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl bg-[#058241] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#046e37] focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2"
        >
          <span>←</span> হোম পেজে ফিরে যান
        </Link>
      </div>
    </div>
  );
};

export default NotFound;