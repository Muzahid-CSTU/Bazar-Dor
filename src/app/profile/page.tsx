"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";

const ProfilePage = () => {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [name, setName] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!isPending && !session?.user) {
      toast.error("প্রোফাইল দেখতে অনুগ্রহ করে আগে সাইন ইন করুন!");
      router.push("/signin");
    }
    if (session?.user?.name) {
      setName(session.user.name);
    }
  }, [session, isPending, router]);

  const handleLogout = async () => {
    try {
      await authClient.signOut();
      toast.success("সফলভাবে সাইন আউট হয়েছে!");
      router.push("/signin");
      router.refresh();
    } catch {
      toast.error("সাইন আউট সম্পন্ন করা যায়নি!");
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();

    if (!trimmedName) {
      toast.error("নামের ঘরটি খালি রাখা যাবে না!");
      return;
    }

    setUpdating(true);
    try {
      await authClient.updateUser({
        name: trimmedName,
      });
      toast.success("প্রোফাইল সফলভাবে আপডেট করা হয়েছে!");
      router.refresh();
    } catch {
      toast.error("প্রোফাইল আপডেট করতে সমস্যা হয়েছে!");
    } finally {
      setUpdating(false);
    }
  };

  if (isPending) {
    return (
      <main className="min-h-screen bg-[#f0f5f0] px-4 py-10">
        <div className="mx-auto max-w-2xl animate-pulse space-y-5">
          <div className="space-y-2">
            <div className="h-7 w-44 rounded-lg bg-gray-200" />
            <div className="h-4 w-60 rounded bg-gray-200" />
          </div>

          <div className="rounded-3xl border border-[#e2ece3] bg-white p-7 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-20 w-20 rounded-2xl bg-gray-200" />
                <div className="space-y-2">
                  <div className="h-6 w-36 rounded bg-gray-200" />
                  <div className="h-4 w-48 rounded bg-gray-200" />
                </div>
              </div>
              <div className="h-10 w-28 rounded-xl bg-gray-200" />
            </div>
          </div>

          <div className="rounded-3xl border border-[#e2ece3] bg-white p-7 shadow-sm">
            <div className="h-5 w-16 rounded bg-gray-200" />
            <div className="mt-5 h-11 w-full rounded-xl bg-gray-200" />
            <div className="mt-5 h-11 w-full rounded-xl bg-gray-200" />
          </div>
        </div>
      </main>
    );
  }

  if (!session?.user) {
    return null;
  }

  const user = session.user;
  const initialLetter = user.name?.charAt(0).toUpperCase() || "U";

  return (
    <main className="min-h-screen bg-[#f0f5f0] px-4 py-10 text-[#222e25]">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6">
          <h1 className="text-2xl font-black tracking-tight text-[#222e25]">
            আমার প্রোফাইল
          </h1>
          <p className="mt-1 text-xs text-[#6e7b71]">
            আপনার অ্যাকাউন্টের তথ্য এখানে দেখুন।
          </p>
        </div>

        {/* User Card */}
        <div className="flex flex-col gap-4 rounded-3xl border border-[#e2ece3] bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-7">
          <div className="flex items-center gap-4">
            <div className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[#f0f5f0] shadow-sm">
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name || "User"}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLElement).style.display = "none";
                  }}
                />
              ) : (
                <span className="text-2xl font-bold text-[#058241]">
                  {initialLetter}
                </span>
              )}
            </div>

            <div className="min-w-0">
              <h2 className="truncate text-xl font-bold text-[#222e25]">
                {user.name}
              </h2>
              <p className="truncate text-xs text-[#7d8b80]">{user.email}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center justify-center gap-1.5 self-start rounded-xl border border-[#e7807d] px-4 py-2 text-xs font-semibold text-[#dc4843] transition hover:bg-[#fdf2f2] sm:self-center"
          >
            <span className="text-sm">↩</span> সাইন আউট
          </button>
        </div>

        {/* Edit Form */}
        <div className="mt-5 rounded-3xl border border-[#e2ece3] bg-white p-6 shadow-sm sm:p-7">
          <h3 className="mb-4 text-base font-bold text-[#222e25]">তথ্য</h3>

          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-bold text-[#222e25]">
                নাম
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="আপনার নাম"
                disabled={updating}
                className="w-full rounded-xl border border-[#e4ebe4] bg-white px-4 py-2.5 text-sm text-[#222e25] outline-none transition focus:border-[#058241] focus:ring-1 focus:ring-[#058241] disabled:bg-gray-50"
                required
              />
            </div>

            <button
              type="submit"
              disabled={updating}
              className="flex w-full items-center justify-center rounded-xl bg-[#058241] py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#046e37] disabled:opacity-70"
            >
              {updating ? (
                <span className="inline-flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  আপডেট হচ্ছে...
                </span>
              ) : (
                "আপডেট"
              )}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
};

export default ProfilePage;