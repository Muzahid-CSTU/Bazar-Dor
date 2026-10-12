"use client";

import {
  FaArrowTrendUp,
  FaArrowTrendDown,
} from "react-icons/fa6";

const priceItems = [
  { name: "সুগন্ধি চাল", price: "৪৮", change: "২.৫", up: true },
  { name: "মিনিকেট চাল", price: "৬৫", change: "১.৫", up: false },
  { name: "বাটার সয়াবিন তেল", price: "১৬৬", change: "০.৩", up: true },
  { name: "মসুর ডাল", price: "৮৪", change: "২.৯", up: true },
  { name: "ভোজ্য তেল", price: "১৭০", change: "১.৮", up: false },
  { name: "আমন চাল", price: "৫৮", change: "০.৭", up: false },
];

export default function PriceTicker() {
  return (
    <section
      aria-label="বাজারদরের সংক্ষিপ্ত আপডেট"
      className="w-full overflow-hidden border-y border-gray-100 bg-white"
    >
      <div className="flex h-8 items-center">
        <div className="ticker-track flex w-max items-center">
          {[...priceItems, ...priceItems].map((item, index) => (
            <div
              key={`${item.name}-${index}`}
              className="flex h-8 shrink-0 items-center gap-1.5 border-r border-gray-100 px-3 text-[10px] sm:text-[11px]"
            >
              <span
                className={`shrink-0 ${
                  item.name.includes("ডাল")
                    ? "text-red-800"
                    : "text-gray-400"
                }`}
                aria-hidden="true"
              >
                ●
              </span>

              <span className="font-medium text-gray-700">
                {item.name}
              </span>

              <span className="whitespace-nowrap text-gray-600">
                {item.price} টাকা/কেজি
              </span>

              <span
                className={`flex shrink-0 items-center gap-1 whitespace-nowrap font-semibold ${
                  item.up ? "text-red-600" : "text-green-600"
                }`}
              >
                {item.up ? (
                  <FaArrowTrendUp aria-hidden="true" />
                ) : (
                  <FaArrowTrendDown aria-hidden="true" />
                )}
                {item.change}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}