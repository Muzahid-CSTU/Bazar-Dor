
"use client";

import Image from "next/image";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  FaBowlRice,
  FaSeedling,
  FaBottleDroplet,
  FaCarrot,
  FaFish,
  FaDrumstickBite,
  FaEgg,
  FaPepperHot,
} from "react-icons/fa6";

const categories = [
  {
    label: "চাল",
    href: "/category/chal",
    icon: FaBowlRice,
    color: "text-slate-400",
  },
  {
    label: "ডাল",
    href: "/category/dal",
    icon: FaSeedling,
    color: "text-red-700",
  },
  {
    label: "তেল",
    href: "/category/tel",
    icon: FaBottleDroplet,
    color: "text-red-900",
  },
  {
    label: "সবজি",
    href: "/category/sobji",
    icon: FaCarrot,
    color: "text-green-600",
  },
  {
    label: "মাছ",
    href: "/category/mach",
    icon: FaFish,
    color: "text-sky-600",
  },
  {
    label: "মাংস",
    href: "/category/mangsho",
    icon: FaDrumstickBite,
    color: "text-orange-700",
  },
  {
    label: "ডিম-দুধ",
    href: "/category/dim-dui",
    icon: FaEgg,
    color: "text-slate-400",
  },
  {
    label: "মসলা",
    href: "/category/mosla",
    icon: FaPepperHot,
    color: "text-red-600",
  },
];

function NavbarContent() {
  const pathname = usePathname();
  const [today, setToday] = useState("");

  // Client-এ তারিখ সেট করা হচ্ছে, যাতে hydration mismatch না হয়
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

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/90 backdrop-blur">
      {/* Top row */}
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-3">
          <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-[24%] bg-[#05893E] shadow-sm">
            <Image
              src="/assets/logo-icon.png"
              alt="বাজার দর"
              fill
              sizes="48px"
              priority
              className="object-contain p-3"
            />
          </span>

          <div className="leading-tight">
            <h1 className="text-xl font-extrabold text-[#1a2a22]">
              বাজার দর
            </h1>
            <p className="min-h-4 text-xs text-gray-600">{today}</p>
          </div>
        </Link>

        {/* Authentication links */}
        <div className="flex items-center gap-1 sm:gap-3">
          <Link
            href="/signin"
            className="rounded-lg px-2 py-2 text-xs font-medium text-gray-800 transition hover:bg-gray-100 sm:px-4 sm:text-sm"
          >
            সাইন ইন
          </Link>

          <Link
            href="/signup"
            className="rounded-lg bg-green-700 px-3 py-2.5 text-xs font-semibold text-white shadow-md transition hover:bg-green-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700 sm:px-5 sm:text-sm"
          >
            সাইন আপ
          </Link>
        </div>
      </div>

      {/* Category navigation */}
      <nav
        aria-label="পণ্যের ক্যাটাগরি"
        className="border-t border-gray-100"
      >
        <ul className="mx-auto flex max-w-6xl items-center gap-5 overflow-x-auto px-4 py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:gap-6">
          {categories.map(({ label, href, icon: Icon, color }) => {
            const isActive = pathname === href;

            return (
              <li key={href} className="shrink-0">
                <Link
                  href={href}
                  aria-current={isActive ? "page" : undefined}
                  className={`flex items-center gap-1.5 rounded-md text-sm transition ${
                    isActive
                      ? "font-bold text-green-700"
                      : "text-gray-700 hover:text-green-700"
                  }`}
                >
                  <Icon
                    className={`h-4 w-4 ${color}`}
                    aria-hidden="true"
                  />
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
