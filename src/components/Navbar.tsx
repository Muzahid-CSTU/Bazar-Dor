"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
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
  { label: "চাল", href: "/category/rice", icon: FaBowlRice, color: "text-slate-400" },
  { label: "ডাল", href: "/category/lentils", icon: FaSeedling, color: "text-red-700" },
  { label: "তেল", href: "/category/oil", icon: FaBottleDroplet, color: "text-red-900" },
  { label: "সবজি", href: "/category/vegetables", icon: FaCarrot, color: "text-green-600" },
  { label: "মাছ", href: "/category/fish", icon: FaFish, color: "text-sky-600" },
  { label: "মাংস", href: "/category/meat", icon: FaDrumstickBite, color: "text-orange-700" },
  { label: "ডিম-দুধ", href: "/category/egg-milk", icon: FaEgg, color: "text-slate-400" },
  { label: "মসলা", href: "/category/spices", icon: FaPepperHot, color: "text-red-600" },
];

export default function Navbar() {
  const [today, setToday] = useState("");

  // client-এ set করা হচ্ছে যাতে hydration mismatch না হয়
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
            <h1 className="text-xl font-extrabold text-[#1a2a22]">বাজার দর</h1>
            <p className="min-h-4 text-xs text-gray-600">{today}</p>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/signin"
            className="rounded-lg px-4 py-2 text-sm font-medium text-gray-800 transition hover:bg-gray-100"
          >
            সাইন ইন
          </Link>
          <Link
            href="/signup"
            className="rounded-lg bg-green-700 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-green-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700"
          >
            সাইন আপ
          </Link>
        </div>
      </div>

      {/* Category row */}
      <nav aria-label="Categories" className="border-t border-gray-100">
        <ul className="mx-auto flex max-w-6xl items-center gap-6 overflow-x-auto px-4 py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {categories.map(({ label, href, icon: Icon, color }) => (
            <li key={href} className="shrink-0">
              <Link
                href={href}
                className="flex items-center gap-1.5 text-sm text-gray-700 transition hover:text-green-700"
              >
                <Icon className={`h-4 w-4 ${color}`} aria-hidden="true" />
                <span>{label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
