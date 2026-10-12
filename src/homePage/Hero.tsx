"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Hero() {
  const [today, setToday] = useState("");

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
    <section className="bg-[#f1f6f1] px-4 py-5 sm:py-6">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-5 overflow-hidden rounded-[22px] border border-[#e0e9e0] bg-[#fbfdfb] px-5 py-5 sm:px-7 sm:py-6 md:grid-cols-[1fr_240px] md:gap-8 lg:grid-cols-[1fr_270px] lg:px-9">
        {/* Left content */}
        <div className="order-2 min-w-0 md:order-1">
            <div className="mb-2">
                <span className="inline-flex items-center rounded-full bg-[#e0f3e7] px-3 py-1 text-xs font-medium leading-4 text-[#078443]">
                    {today}
                </span>    
            </div>

          <h2 className="mt-2 text-2xl font-extrabold leading-tight tracking-tight text-[#202b23] sm:text-3xl">
            আজকের বাজারের দাম এক নজরে
          </h2>

          <p className="mt-4 max-w-2xl text-sm leading-6 text-gray-500">
            চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম —
            বাজারভিত্তিক বিস্তারিত, গড়, সর্বনিম্ন-সর্বাধিক এবং
            দামের পরিবর্তন এক জায়গায়!
          </p>

          <Link
            href="#সব-পণ্য"
            className="mt-6 inline-flex items-center justify-center rounded-lg bg-green-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-green-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700"
          >
            সব পণ্য দেখুন
          </Link>
        </div>

        {/* Right illustration */}
        <div className="order-1 flex items-center justify-center md:order-2">
          <div className="relative h-40 w-48 sm:h-48 sm:w-56 md:h-48 md:w-56">
            <Image
              src="/assets/bazar-hero.png"
              alt="বাজারের তাজা ফল ও সবজির ঝুড়ি"
              fill
              priority
              sizes="(max-width: 768px) 224px, 270px"
              className="object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
}