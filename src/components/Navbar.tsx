"use client";

import Image from "next/image";
import Link from "next/link";
import { Suspense, useEffect, useState, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { FaChevronDown } from "react-icons/fa6";

const categories = [
  {
    label: "চাল",
    href: "/category/chal",
    icon: "🍚",
  },
  {
    label: "ডাল",
    href: "/category/dal",
    icon: "🫘",
  },
  {
    label: "তেল",
    href: "/category/tel",
    icon: "🛢️",
  },
  {
    label: "সবজি",
    href: "/category/sobji",
    icon: "🥬",
  },
  {
    label: "মাছ",
    href: "/category/mach",
    icon: "🐟",
  },
  {
    label: "মাংস",
    href: "/category/mangsho",
    icon: "🍗",
  },
  {
    label: "ডিম-দুধ",
    href: "/category/dim-dudh",
    icon: "🥛",
  },
  {
    label: "মসলা",
    href: "/category/mosla",
    icon: "🌶️",
  },
];

function NavbarContent() {
  const pathname = usePathname();
  const router = useRouter();
  const [today, setToday] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Better Auth থেকে ইউজারের সেশন চেক করা
  const { data: session, isPending } = authClient.useSession();

  // তারিখ ফরম্যাট (বাংলায়)
  useEffect(() => {
    setToday(
      new Intl.DateTimeFormat("bn-BD", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "Asia/Dhaka",
      }).format(new Date())
    );
  }, []);

  // ড্রপডাউনের বাইরে ক্লিক করলে যাতে বন্ধ হয়
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // সাইন আউট মেথড
  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          setDropdownOpen(false);
          router.push("/signin");
          router.refresh();
        },
      },
    });
  };

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur">
      {/* Top Header Bar */}
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        {/* লোগো ও তারিখ */}
        <Link href="/" className="flex items-center gap-3">
          <span className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#058241] shadow-sm">
            <Image
              src="/assets/logo-icon.png"
              alt="বাজার দর"
              width={26}
              height={26}
              priority
              className="object-contain brightness-0 invert"
            />
          </span>

          <div className="leading-tight">
            <h1 className="text-xl font-bold tracking-tight text-[#1a2a22]">
              বাজার দর
            </h1>
            <p className="text-xs text-gray-500">{today}</p>
          </div>
        </Link>

        {/* ডানদিকের অথ সেকশন */}
        <div className="flex items-center">
          {isPending ? (
            <div className="h-9 w-24 animate-pulse rounded-lg bg-gray-100" />
          ) : session?.user ? (
            /* সাইন ইন করা থাকলে: ইউজার প্রোফাইল */
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 rounded-full p-1 transition hover:bg-gray-100 focus:outline-none"
              >
                <div className="relative h-9 w-9 overflow-hidden rounded-full border border-gray-200 bg-gray-100 flex items-center justify-center">
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
                    <div className="flex h-full w-full items-center justify-center bg-emerald-700 text-xs font-semibold text-white">
                      {session.user.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                  )}
                </div>

                <span className="text-sm font-semibold text-gray-800">
                  {session.user.name}
                </span>

                <FaChevronDown className="h-2.5 w-2.5 text-gray-500" />
              </button>

              {/* প্রোফাইল ড্রপডাউন মেনু */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl border border-gray-100 bg-white py-1.5 shadow-lg z-50">
                  <div className="border-b border-gray-100 px-4 py-2">
                    <p className="truncate text-xs font-semibold text-gray-800">
                      {session.user.name}
                    </p>
                    <p className="truncate text-[11px] text-gray-500">
                      {session.user.email}
                    </p>
                  </div>

                  <Link
                    href="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="block px-4 py-2 text-xs font-medium text-gray-700 transition hover:bg-gray-50"
                  >
                    প্রোফাইল
                  </Link>

                  <button
                    onClick={handleSignOut}
                    className="w-full px-4 py-2 text-left text-xs font-medium text-red-600 transition hover:bg-red-50"
                  >
                    সাইন আউট
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* সাইন ইন না থাকলে: লগইন / রেজিস্টার বাটন */
            <div className="flex items-center gap-3">
              <Link
                href="/signin"
                className="px-2 py-2 text-sm font-medium text-gray-800 transition hover:text-green-700"
              >
                সাইন ইন
              </Link>

              <Link
                href="/signup"
                className="rounded-lg bg-[#058241] px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-[#046e37]"
              >
                সাইন আপ
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* ক্যাটাগরি মেনু ও ডিভাইডার */}
      <nav
        aria-label="পণ্যের ক্যাটাগরি"
        className="border-t border-gray-200/80 bg-gray-50/50"
      >
        <ul className="mx-auto flex max-w-6xl items-center gap-5 overflow-x-auto px-4 py-2.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:gap-6">
          {categories.map(({ label, href, icon }) => {
            const isActive = pathname === href;

            return (
              <li key={href} className="shrink-0">
                <Link
                  href={href}
                  aria-current={isActive ? "page" : undefined}
                  className={`flex items-center gap-1.5 text-xs transition sm:text-sm ${
                    isActive
                      ? "font-bold text-green-700"
                      : "text-gray-700 hover:text-green-700"
                  }`}
                >
                  <span className="text-base leading-none">{icon}</span>
                  <span>{label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}

export default function Navbar() {
  return (
    <Suspense
      fallback={
        <header className="min-h-[110px] border-b border-gray-200 bg-white" />
      }
    >
      <NavbarContent />
    </Suspense>
  );
}