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
    dozen: "ডজন",
    pcs: "পিস",
  };

  return units[unit?.toLowerCase()] ?? unit ?? "কেজি";
}

export default function ProductList() {
  const { products, loading, error, refreshProducts } = useProducts();

  return (
    <section
      id="সব-পণ্য"
      className="bg-[#f0f5f0] px-4 py-3 sm:px-5"
    >
      <div className="mx-auto max-w-6xl">
        {/* Section Heading */}
        <div className="mb-3">
          <h2 className="text-base font-bold text-[#303a32]">
            সব পণ্য
          </h2>

          <p className="mt-2 text-[10px] text-[#778078]">
            {loading
              ? "পণ্যের তথ্য লোড হচ্ছে..."
              : `মোট ${bnNumber(products.length)}টি পণ্য দেখানো হচ্ছে`}
          </p>
        </div>

        {/* Loading Skeleton */}
        {loading && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-[105px] animate-pulse rounded-[14px] border border-[#e2eae3] bg-[#fbfdfb] p-3"
              >
                <div className="flex gap-3">
                  <div className="h-9 w-9 rounded-[10px] bg-gray-200" />

                  <div className="flex-1">
                    <div className="h-3 w-28 rounded bg-gray-200" />
                    <div className="mt-2 h-2 w-16 rounded bg-gray-200" />
                  </div>
                </div>

                <div className="mt-4 h-3 w-20 rounded bg-gray-200" />
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="py-8 text-center">
            <p className="text-sm text-red-600">{error}</p>

            <button
              type="button"
              onClick={() => void refreshProducts()}
              className="mt-3 rounded-lg bg-green-700 px-4 py-2 text-sm text-white hover:bg-green-800"
            >
              আবার চেষ্টা করো
            </button>
          </div>
        )}

        {/* Product Cards */}
        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => {
              const trend = product.change?.dir ?? "flat";
              const percentage = Math.abs(product.change?.pct ?? 0);

              return (
                <Link
                  key={product.id}
                  href={`/product/${product.slug}`}
                  aria-label={`${product.nameBn} এর বিস্তারিত দেখুন`}
                  className="block rounded-[14px] border border-[#e2eae3] bg-[#fbfdfb] p-3 transition-shadow hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-green-700"
                >
                  {/* Product Information */}
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-[10px] bg-[#f0f5f0] text-xl">
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

                  {/* Price and Percentage */}
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

                    <span
                      className={`mb-0.5 inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-1 text-[9px] font-bold ${
                        trend === "up"
                          ? "bg-[#fdf0ef] text-[#dc4843]"
                          : trend === "down"
                            ? "bg-[#edf6ef] text-[#199653]"
                            : "bg-[#edf2ed] text-[#68736a]"
                      }`}
                    >
                      {trend === "up" ? (
                        <span aria-hidden="true">▲</span>
                      ) : trend === "down" ? (
                        <span aria-hidden="true">▼</span>
                      ) : (
                        <span aria-hidden="true">−</span>
                      )}

                      {bnNumber(percentage)}%
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && products.length === 0 && (
          <p className="py-8 text-center text-sm text-gray-500">
            কোনো পণ্য পাওয়া যায়নি।
          </p>
        )}
      </div>
    </section>
  );
}