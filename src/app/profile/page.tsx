"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { FiLogOut } from "react-icons/fi";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    if (session?.user?.name) {
      setName(session.user.name);
    }
  }, [session]);

  // লগইন না থাকলে সাইন-ইন পেজে রিডাইরেক্ট
  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/signin");
    }
  }, [session, isPending, router]);

  // নাম আপডেট হ্যান্ডলার
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    setMessage(null);

    const { error } = await authClient.updateUser({
      name: name.trim(),
    });

    setLoading(false);

    if (error) {
      setMessage({ text: error.message || "নাম আপডেট করতে সমস্যা হয়েছে।", type: "error" });
    } else {
      setMessage({ text: "তথ্য সফলভাবে আপডেট করা হয়েছে!", type: "success" });
    }
  };

  // সাইন আউট হ্যান্ডলার
  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/signin");
          router.refresh();
        },
      },
    });
  };

  if (isPending) {
    return (
      <div className="min-h-[calc(100vh-120px)] bg-[#f3f6f4] flex justify-center items-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />
      </div>
    );
  }

  if (!session?.user) return null;

  return (
    <div className="min-h-[calc(100vh-120px)] bg-[#f3f6f4] py-10 px-4">
      <div className="mx-auto max-w-2xl">
        {/* হেডার টেক্সট */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
            আমার প্রোফাইল
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            আপনার অ্যাকাউন্টের তথ্য এখানে দেখুন।
          </p>
        </div>

        {/* কার্ড ১: ইউজার তথ্য ও সাইন আউট বাটন */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 sm:p-6 mb-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* প্রোফাইল ছবি */}
            <div className="relative h-16 w-16 overflow-hidden rounded-2xl bg-gray-100 border border-gray-100 flex items-center justify-center shrink-0">
              {session.user.image ? (
                <img
                  src={session.user.image}
                  alt={session.user.name || "User Avatar"}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLElement).style.display = "none";
                  }}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-emerald-700 text-xl font-bold text-white">
                  {session.user.name?.charAt(0).toUpperCase() || "U"}
                </div>
              )}
            </div>

            {/* নাম ও ইমেইল */}
            <div className="min-w-0">
              <h2 className="text-lg font-bold text-gray-800 truncate">
                {session.user.name}
              </h2>
              <p className="text-xs text-gray-400 truncate mt-0.5">
                {session.user.email}
              </p>
            </div>
          </div>

          {/* সাইন আউট বাটন */}
          <button
            onClick={handleSignOut}
            className="flex items-center gap-1.5 border border-red-300 text-red-500 hover:bg-red-50 px-3.5 py-1.5 rounded-xl text-xs font-medium transition"
          >
            <FiLogOut className="h-3.5 w-3.5 rotate-180" />
            <span>সাইন আউট</span>
          </button>
        </div>

        {/* কার্ড ২: এডিট ফর্ম */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 sm:p-7">
          <h3 className="text-sm font-bold text-gray-800 mb-4">তথ্য</h3>

          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                নাম
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="আপনার নাম"
                className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600 transition"
                required
              />
            </div>

            {message && (
              <p
                className={`text-xs font-medium ${
                  message.type === "success" ? "text-emerald-600" : "text-red-500"
                }`}
              >
                {message.text}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#058241] hover:bg-[#046e37] text-white font-medium py-2.5 rounded-lg text-sm transition shadow-sm disabled:opacity-70"
            >
              {loading ? "আপডেট হচ্ছে..." : "আপডেট"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}