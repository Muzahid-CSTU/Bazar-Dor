"use client";

import Link from "next/link";
import { useProducts } from "@/context/ProductContext";

function bnNumber(value: number) {
  return new Intl.NumberFormat("bn-BD", {
    maximumFractionDigits: 1,
  }).format(value);
}

function getUnit(unit: string) {
  const units: Record<string, string> = {
    kg: "কেজি",
    liter: "লিটার",
    piece: "পিস",
    pcs: "পিস",
    dozen: "ডজন",
  };

  return units[unit?.toLowerCase()] ?? unit ?? "কেজি";
}

export default function PriceRisers() {
  const { products, loading, error } = useProducts();

  const risingProducts = products
    .filter((product) => product.change?.dir === "up")
    .sort(
      (a, b) =>
        Math.abs(b.change?.pct ?? 0) -
        Math.abs(a.change?.pct ?? 0)
    )
    .slice(0, 6);

  return (
    <section className="bg-[#f0f5f0] px-4 py-5 sm:px-5">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-3 flex items-center gap-2 text-base font-bold text-[#303a32]">
          <span
            className="text-[13px] leading-none text-[#dc3f43]"
            aria-hidden="true"
          >
            ▲
          </span>
          আজ দাম বেড়েছে
        </h2>

        {loading ? (
          <p className="py-4 text-sm text-[#778078]">
            পণ্যের তথ্য লোড হচ্ছে...
          </p>
        ) : error ? (
          <p className="py-4 text-sm text-[#778078]">
            পণ্যের তথ্য লোড করা যায়নি।
          </p>
        ) : risingProducts.length === 0 ? (
          <p className="py-4 text-sm text-[#778078]">
            আজ দাম বেড়েছে এমন কোনো পণ্যের তথ্য নেই।
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {risingProducts.map((product) => (
              <Link
                key={product.id}
                href={`/product/${product.slug}`}
                aria-label={`${product.nameBn} এর বিস্তারিত দেখুন`}
                className="block rounded-[14px] border border-[#e2eae3] bg-[#fbfdfb] p-3 transition-shadow hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-green-700 sm:p-3"
              >
                {/* Product Information */}
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-[#f0f5f0] text-xl">
                    <span aria-hidden="true">
                      {product.image || product.categoryIcon || "🛒"}
                    </span>
                  </div>

                  <div className="min-w-0">
                    <h3 className="truncate text-[13px] font-bold leading-5 text-[#303a32]">
                      {product.nameBn}
                    </h3>

                    <p className="text-[10px] text-[#778078]">
                      প্রতি {getUnit(product.unit)}
                    </p>
                  </div>
                </div>

                {/* Today's Price and Price Change */}
                <div className="mt-2 flex items-end justify-between gap-2">
                  <div>
                    <p className="text-[10px] leading-4 text-[#778078]">
                      আজকের দাম
                    </p>

                    <p className="text-sm font-bold leading-5 text-[#303a32]">
                      {bnNumber(product.today)}{" "}
                      <span className="text-[11px] font-medium">
                        টাকা
                      </span>
                    </p>
                  </div>

                  <span className="mb-0.5 inline-flex shrink-0 items-center gap-1 rounded-full bg-[#fdf0ef] px-2 py-1 text-[9px] font-bold text-[#dc4843]">
                    <span
                      className="text-[9px] leading-none"
                      aria-hidden="true"
                    >
                      ▲
                    </span>

                    {bnNumber(
                      Math.abs(product.change?.pct ?? 0)
                    )}
                    %
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}