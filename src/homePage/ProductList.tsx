"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  FaArrowTrendUp,
  FaArrowTrendDown,
} from "react-icons/fa6";

type Product = {
  id: number;
  slug: string;
  nameBn: string;
  category: string;
  categoryNameBn: string;
  categoryIcon: string;
  unit: string;
  image: string;
  today: number;
  yesterday: number;
  change: {
    dir: "up" | "down" | "flat";
    pct: number;
  };
};

const API_URL =
  "https://openapi.programming-hero.com/api/bazardor/products";

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

function ProductIcon({ product }: { product: Product }) {
  const icon = product.image || product.categoryIcon || "🛒";
  const isImageUrl = /^https?:\/\//i.test(icon);

  if (isImageUrl) {
    return (
      <Image
        src={icon}
        alt={product.nameBn}
        width={36}
        height={36}
        unoptimized
        className="h-full w-full object-contain p-1"
      />
    );
  }

  return (
    <span className="flex h-full w-full items-center justify-center text-xl">
      {icon}
    </span>
  );
}

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function fetchProducts() {
      try {
        const response = await fetch(API_URL, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data: unknown = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("Invalid API response");
        }

        setProducts(data as Product[]);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }

        setError("পণ্যের তথ্য লোড করা যায়নি। আবার চেষ্টা করো।");
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchProducts();

    return () => controller.abort();
  }, []);

  return (
    <section
      id="সব-পণ্য"
      className="bg-[#f0f5f0] px-4 py-3 sm:px-5"
    >
      <div className="mx-auto max-w-6xl">
        {/* Section heading */}
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

        {/* Loading skeleton */}
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

        {/* Error state */}
        {!loading && error && (
          <div className="py-8 text-center">
            <p className="text-sm text-red-600">{error}</p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-3 rounded-lg bg-green-700 px-4 py-2 text-sm text-white hover:bg-green-800"
            >
              আবার চেষ্টা করো
            </button>
          </div>
        )}

        {/* Product cards */}
        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => {
              const trend = product.change?.dir ?? "flat";
              const percentage = Math.abs(product.change?.pct ?? 0);

              return (
                <article
                  key={product.id}
                  className="rounded-[14px] border border-[#e2eae3] bg-[#fbfdfb] p-3 transition-shadow hover:shadow-sm"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-[10px] bg-[#f0f5f0]">
                      <ProductIcon product={product} />
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
                        <FaArrowTrendUp size={9} />
                      ) : trend === "down" ? (
                        <FaArrowTrendDown size={9} />
                      ) : (
                        <span>−</span>
                      )}

                      {bnNumber(percentage)}%
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && products.length === 0 && (
          <p className="py-8 text-center text-sm text-gray-500">
            কোনো পণ্য পাওয়া যায়নি।
          </p>
        )}
      </div>
    </section>
  );
}