
"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import { useProducts } from "@/context/ProductContext";

function bnNumber(value: number) {
  return new Intl.NumberFormat("bn-BD", {
    maximumFractionDigits: 2,
  }).format(value);
}

export default function ProductDetailPage() {
  const params = useParams<{ slug: string }>();
  const { products, loading, error } = useProducts();

  const product = useMemo(
    () => products.find((item) => item.slug === params.slug),
    [products, params.slug]
  );

  if (loading) {
    return (
      <main className="min-h-[60vh] bg-[#f0f5f0] p-6">
        <div className="mx-auto max-w-4xl animate-pulse rounded-2xl bg-white p-8">
          <div className="h-6 w-40 rounded bg-gray-200" />
          <div className="mt-5 h-4 w-64 rounded bg-gray-200" />
          <div className="mt-8 h-10 w-32 rounded bg-gray-200" />
        </div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center bg-[#f0f5f0] px-4">
        <div className="text-center">
          <h1 className="text-xl font-bold text-[#303a32]">
            {error ? "পণ্যের তথ্য লোড করা যায়নি" : "পণ্য পাওয়া যায়নি"}
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            আবার চেষ্টা করুন অথবা হোম পেজে ফিরে যান।
          </p>
          <Link
            href="/"
            className="mt-5 inline-flex rounded-lg bg-green-700 px-5 py-3 text-sm font-semibold text-white hover:bg-green-800"
          >
            হোম পেজে ফিরে যান
          </Link>
        </div>
      </main>
    );
  }

  const trend = product.change?.dir ?? "flat";
  const percentage = Math.abs(product.change?.pct ?? 0);

  return (
    <main className="min-h-[60vh] bg-[#f0f5f0] px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <Link
          href={`/category/${product.category}`}
          className="text-sm font-medium text-green-700 hover:underline"
        >
          ← {product.categoryNameBn} ক্যাটাগরিতে ফিরে যান
        </Link>

        <section className="mt-5 rounded-2xl border border-[#e2eae3] bg-white p-6 sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-[#f0f5f0] text-5xl">
              {product.image || product.categoryIcon || "🛒"}
            </div>

            <div className="flex-1">
              <p className="text-sm text-gray-500">
                {product.categoryNameBn}
              </p>

              <h1 className="mt-1 text-2xl font-bold text-[#303a32]">
                {product.nameBn}
              </h1>

              <p className="mt-2 text-sm text-gray-500">
                প্রতি {product.unit}
              </p>

              <p className="mt-5 text-sm text-gray-500">আজকের বাজারদর</p>

              <p className="mt-1 text-3xl font-extrabold text-green-700">
                {bnNumber(product.today)} টাকা
              </p>

              <span
                className={`mt-3 inline-flex rounded-full px-3 py-1 text-sm font-semibold ${
                  trend === "up"
                    ? "bg-red-50 text-red-600"
                    : trend === "down"
                      ? "bg-green-50 text-green-700"
                      : "bg-gray-100 text-gray-600"
                }`}
              >
                {trend === "up" ? "▲ দাম বেড়েছে" : trend === "down" ? "▼ দাম কমেছে" : "— দাম অপরিবর্তিত"}
                {" "}
                {bnNumber(percentage)}%
              </span>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-xl bg-[#f7f9f7] p-4">
              <p className="text-sm text-gray-500">গতকালের দাম</p>
              <p className="mt-2 text-xl font-bold text-[#303a32]">
                {bnNumber(product.yesterday)} টাকা
              </p>
            </div>

            {typeof product.lastWeek === "number" && (
              <div className="rounded-xl bg-[#f7f9f7] p-4">
                <p className="text-sm text-gray-500">গত সপ্তাহের দাম</p>
                <p className="mt-2 text-xl font-bold text-[#303a32]">
                  {bnNumber(product.lastWeek)} টাকা
                </p>
              </div>
            )}

            {typeof product.lastMonth === "number" && (
              <div className="rounded-xl bg-[#f7f9f7] p-4">
                <p className="text-sm text-gray-500">গত মাসের দাম</p>
                <p className="mt-2 text-xl font-bold text-[#303a32]">
                  {bnNumber(product.lastMonth)} টাকা
                </p>
              </div>
            )}
          </div>

          <p className="mt-6 text-xs leading-6 text-gray-500">
            বাজারদর সময় ও স্থান অনুযায়ী পরিবর্তিত হতে পারে।
          </p>
        </section>
      </div>
    </main>
  );
}
