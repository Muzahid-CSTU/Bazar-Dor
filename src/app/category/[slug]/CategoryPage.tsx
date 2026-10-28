"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useProducts } from "@/context/ProductContext";

type CategoryPageProps = {
  slug: string;
};

type SortOption = "default" | "low" | "high";

const bnNumber = (value: number) => {
  return new Intl.NumberFormat("bn-BD", {
    maximumFractionDigits: 1,
  }).format(value);
};

const getUnit = (unit: string) => {
  const units: Record<string, string> = {
    kg: "কেজি",
    liter: "লিটার",
    litre: "লিটার",
    piece: "পিস",
    pcs: "পিস",
    dozen: "ডজন",
  };

  return units[unit?.toLowerCase()] ?? unit ?? "কেজি";
};

const getProductIcon = (image?: string, categoryIcon?: string) => {
  return image || categoryIcon || "🛒";
};

const CategoryPage = ({ slug }: CategoryPageProps) => {
  const { products, loading, error } = useProducts();
  const [sortBy, setSortBy] = useState<SortOption>("default");

  const categoryProducts = useMemo(() => {
    return products.filter(
      (product) =>
        product.category?.toLowerCase() === slug.toLowerCase()
    );
  }, [products, slug]);

  const sortedProducts = useMemo(() => {
    const list = [...categoryProducts];

    if (sortBy === "low") {
      list.sort((a, b) => a.today - b.today);
    } else if (sortBy === "high") {
      list.sort((a, b) => b.today - a.today);
    }

    return list;
  }, [categoryProducts, sortBy]);

  const categoryName = categoryProducts[0]?.categoryNameBn ?? "";
  const categoryIcon = categoryProducts[0]?.categoryIcon ?? "🛒";

  if (loading) {
    return (
      <section className="min-h-[60vh] bg-[#f0f5f0] px-4 py-8 sm:px-5">
        <div className="mx-auto max-w-6xl">
          <div className="mb-5 h-20 animate-pulse rounded-2xl bg-white" />

          <div className="mb-4 h-14 animate-pulse rounded-xl bg-white" />

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-[110px] animate-pulse rounded-[14px] border border-[#e2eae3] bg-white p-3"
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
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="flex min-h-[60vh] items-center justify-center bg-[#f0f5f0] px-4">
        <div className="text-center">
          <h1 className="text-lg font-bold text-[#303a32]">
            পণ্যের তথ্য লোড করা যায়নি
          </h1>

          <p className="mt-2 text-sm text-[#778078]">
            ইন্টারনেট সংযোগ পরীক্ষা করে আবার চেষ্টা করুন।
          </p>

          <Link
            href="/"
            className="mt-5 inline-flex rounded-lg bg-green-700 px-4 py-2 text-sm font-semibold text-white hover:bg-green-800"
          >
            হোম পেজে ফিরে যান
          </Link>
        </div>
      </section>
    );
  }

  if (categoryProducts.length === 0) {
    return (
      <section className="flex min-h-[60vh] items-center justify-center bg-[#f0f5f0] px-4">
        <div className="text-center">
          <span className="text-4xl" aria-hidden="true">
            🛒
          </span>

          <h1 className="mt-4 text-lg font-bold text-[#303a32]">
            ক্যাটাগরি পাওয়া যায়নি
          </h1>

          <p className="mt-2 text-sm text-[#778078]">
            এই ক্যাটাগরিতে কোনো পণ্য নেই অথবা ক্যাটাগরিটি সঠিক নয়।
          </p>

          <Link
            href="/"
            className="mt-5 inline-flex rounded-lg bg-green-700 px-4 py-2 text-sm font-semibold text-white hover:bg-green-800"
          >
            হোম পেজে ফিরে যান
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-[60vh] bg-[#f0f5f0] px-4 py-6 sm:px-5">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center gap-3 rounded-2xl border border-[#e2eae3] bg-[#fbfdfb] p-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#f0f5f0] text-2xl">
            {categoryIcon}
          </div>

          <div>
            <h1 className="text-lg font-bold text-[#303a32]">
              {categoryName}
            </h1>

            <p className="text-xs text-[#778078]">
              {bnNumber(categoryProducts.length)}টি পণ্যের বর্তমান বাজারদর
            </p>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-end gap-2 rounded-xl border border-[#e2eae3] bg-[#fbfdfb] p-3">
          <label
            htmlFor="sort-products"
            className="text-xs text-[#778078]"
          >
            সাজান
          </label>

          <select
            id="sort-products"
            value={sortBy}
            onChange={(event) =>
              setSortBy(event.target.value as SortOption)
            }
            className="max-w-full rounded-lg border border-[#e2eae3] bg-white px-3 py-2 text-xs text-[#303a32] outline-none focus:border-green-600"
          >
            <option value="default">ডিফল্ট</option>
            <option value="low">দাম: কম থেকে বেশি</option>
            <option value="high">দাম: বেশি থেকে কম</option>
          </select>
        </div>

        <p className="my-3 text-xs text-[#778078]">
          মোট {bnNumber(sortedProducts.length)}টি পণ্য দেখানো হচ্ছে
        </p>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {sortedProducts.map((product) => {
            const trend = product.change?.dir ?? "flat";
            const percentage = Math.abs(product.change?.pct ?? 0);
            const icon = getProductIcon(
              product.image,
              product.categoryIcon
            );

            return (
              <Link
                key={product.id}
                href={`/product/${product.slug}`}
                aria-label={`${product.nameBn} বিস্তারিত দেখুন`}
                className="rounded-[14px] border border-[#e2eae3] bg-[#fbfdfb] p-3 transition-shadow hover:shadow-sm"
              >
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-[10px] bg-[#f0f5f0] text-xl">
                    {icon}
                  </div>

                  <div className="min-w-0">
                    <h2 className="truncate text-[13px] font-bold leading-5 text-[#303a32]">
                      {product.nameBn}
                    </h2>

                    <p className="text-[10px] text-[#778078]">
                      প্রতি {getUnit(product.unit)}
                    </p>
                  </div>
                </div>

                <div className="mt-3 flex items-end justify-between gap-2">
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
                      <span aria-label="দাম বেড়েছে">▲</span>
                    ) : trend === "down" ? (
                      <span aria-label="দাম কমেছে">▼</span>
                    ) : (
                      <span aria-label="দাম অপরিবর্তিত">—</span>
                    )}

                    {bnNumber(percentage)}%
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-6">
          <Link
            href="/"
            className="text-sm font-medium text-green-700 hover:underline"
          >
            ← হোম পেজে ফিরে যান
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CategoryPage;