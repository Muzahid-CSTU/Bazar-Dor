"use client";

import React, { Suspense, useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { FaChevronDown } from "react-icons/fa6";
import toast from "react-hot-toast";

const categoryList = [
  { label: "চাল", href: "/category/chal", icon: "🍚" },
  { label: "ডাল", href: "/category/dal", icon: "🫘" },
  { label: "তেল", href: "/category/tel", icon: "🛢️" },
  { label: "সবজি", href: "/category/sobji", icon: "🥬" },
  { label: "মাছ", href: "/category/mach", icon: "🐟" },
  { label: "মাংস", href: "/category/mangsho", icon: "🍗" },
  { label: "ডিম-দুধ", href: "/category/dim-dudh", icon: "🥛" },
  { label: "মসলা", href: "/category/mosla", icon: "🌶️" },
];

const NavbarContent = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    const banglaDate = new Intl.DateTimeFormat("bn-BD", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "Asia/Dhaka",
    }).format(new Date());

    setCurrentDate(banglaDate);
  }, []);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const handleLogout = async () => {
    try {
      await authClient.signOut();
      setMenuOpen(false);
      toast.success("সফলভাবে সাইন আউট হয়েছে!");
      router.push("/signin");
      router.refresh();
    } catch {
      toast.error("সাইন আউট ব্যর্থ হয়েছে");
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#058241] shadow-sm">
            <Image
              src="/assets/logo-icon.png"
              alt="লোগো"
              width={26}
              height={26}
              priority
              className="object-contain brightness-0 invert"
            />
          </div>

          <div className="leading-tight">
            <h1 className="text-xl font-bold tracking-tight text-[#1a2a22]">
              বাজার দর
            </h1>
            <p className="text-xs text-gray-500">{currentDate}</p>
          </div>
        </Link>

        <div className="flex items-center">
          {isPending ? (
            <div className="h-9 w-24 animate-pulse rounded-lg bg-gray-100" />
          ) : session?.user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setMenuOpen((prev) => !prev)}
                className="flex items-center gap-2 rounded-full p-1 transition hover:bg-gray-100 focus:outline-none"
              >
                <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-gray-200 bg-gray-100 text-xs font-semibold text-white">
                  {session.user.image ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name || "User"}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLElement).style.display = "none";
                      }}
                    />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center bg-emerald-700">
                      {session.user.name?.charAt(0).toUpperCase() || "U"}
                    </span>
                  )}
                </div>

                <span className="text-sm font-semibold text-gray-800">
                  {session.user.name}
                </span>

                <FaChevronDown className="h-2.5 w-2.5 text-gray-500" />
              </button>

              {menuOpen && (
                <div className="absolute right-0 z-50 mt-2 w-48 rounded-xl border border-gray-100 bg-white py-1.5 shadow-lg">
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
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-2 text-xs font-medium text-gray-700 transition hover:bg-gray-50"
                  >
                    প্রোফাইল
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left text-xs font-medium text-red-600 transition hover:bg-red-50"
                  >
                    সাইন আউট
                  </button>
                </div>
              )}
            </div>
          ) : (
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

      <nav
        aria-label="পণ্যের ক্যাটাগরি"
        className="border-t border-gray-200/80 bg-gray-50/50"
      >
        <ul className="mx-auto flex max-w-6xl items-center gap-5 overflow-x-auto px-4 py-2.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:gap-6">
          {categoryList.map((item) => {
            const active = pathname === item.href;

            return (
              <li key={item.href} className="shrink-0">
                <Link
                  href={item.href}
                  className={`flex items-center gap-1.5 text-xs transition sm:text-sm ${
                    active
                      ? "font-bold text-green-700"
                      : "text-gray-700 hover:text-green-700"
                  }`}
                >
                  <span className="text-base leading-none">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
};

const Navbar = () => {
  return (
    <Suspense fallback={<header className="min-h-[110px] border-b border-gray-200 bg-white" />}>
      <NavbarContent />
    </Suspense>
  );
};

export default Navbar;