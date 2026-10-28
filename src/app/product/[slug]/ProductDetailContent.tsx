"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useProducts } from "@/context/ProductContext";

type ProductDetailContentProps = {
  slug: string;
};

type Market = {
  market: string;
  division: string;
  min: number;
  max: number;
};

type ProductDetails = {
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
  lastWeek?: number;
  lastMonth?: number;
  change: {
    dir: "up" | "down" | "flat";
    pct: number;
  };
  markets: Market[];
};

function bnNumber(value: number) {
  return new Intl.NumberFormat("bn-BD", {
    maximumFractionDigits: 2,
  }).format(value);
}

function getUnit(unit: string) {
  const units: Record<string, string> = {
    kg: "কেজি",
    liter: "লিটার",
    litre: "লিটার",
    piece: "পিস",
    pcs: "পিস",
    dozen: "ডজন",
  };

  return units[unit?.toLowerCase()] ?? unit ?? "কেজি";
}

function LoadingSkeleton() {
  return (
    <main className="min-h-screen bg-[#f0f5f0] px-3 py-4 sm:px-5">
      <div className="mx-auto max-w-5xl animate-pulse space-y-3">
        <div className="h-4 w-48 rounded bg-gray-200" />
        <div className="h-32 rounded-2xl bg-white" />
        <div className="h-80 rounded-2xl bg-white" />
      </div>
    </main>
  );
}

export default function ProductDetailContent({
  slug,
}: ProductDetailContentProps) {
  const { products, loading, error } = useProducts();

  const product = useMemo(
    () => products.find((item) => item.slug === slug),
    [products, slug]
  );

  const [details, setDetails] = useState<ProductDetails | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState("");

  useEffect(() => {
    if (!product) {
      setDetails(null);
      return;
    }

    // Store the ID after checking that product exists.
    // This lets TypeScript safely use it inside the async function.
    const productId = product.id;
    const controller = new AbortController();

    async function fetchProductDetails() {
      setDetailsLoading(true);
      setDetailsError("");
      setDetails(null);

      try {
        const response = await fetch(
          `https://openapi.programming-hero.com/api/bazardor/products/${productId}`,
          {
            cache: "no-store",
            signal: controller.signal,
          }
        );

        if (!response.ok) {
          throw new Error("Product details request failed");
        }

        const data: unknown = await response.json();

        if (
          !data ||
          typeof data !== "object" ||
          !("id" in data) ||
          !("markets" in data) ||
          !Array.isArray(data.markets)
        ) {
          throw new Error("Invalid product details");
        }

        setDetails(data as ProductDetails);
      } catch {
        if (!controller.signal.aborted) {
          setDetailsError("বাজারভিত্তিক তথ্য লোড করা যায়নি।");
        }
      } finally {
        if (!controller.signal.aborted) {
          setDetailsLoading(false);
        }
      }
    }

    void fetchProductDetails();

    return () => controller.abort();
  }, [product]);

  // সব Hooks conditional return-এর আগে রাখা হয়েছে
  const currentProduct = details ?? product;
  const markets = details?.markets ?? [];

  const marketSummary = useMemo(() => {
    if (markets.length === 0) {
      return null;
    }

    const lowest = Math.min(
      ...markets.map((market) => market.min)
    );

    const highest = Math.max(
      ...markets.map((market) => market.max)
    );

    const average =
      markets.reduce(
        (total, market) =>
          total + (market.min + market.max) / 2,
        0
      ) / markets.length;

    return {
      lowest,
      highest,
      average,
    };
  }, [markets]);

  // Loading State
  if (loading) {
    return <LoadingSkeleton />;
  }

  // API Error State
  if (error) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center bg-[#f0f5f0] px-4">
        <div className="text-center">
          <h1 className="text-lg font-bold text-[#303a32]">
            পণ্যের তথ্য লোড করা যায়নি
          </h1>

          <p className="mt-2 text-sm text-[#778078]">
            ইন্টারনেট সংযোগ পরীক্ষা করে আবার চেষ্টা করুন।
          </p>

          <Link
            href="/"
            className="mt-4 inline-flex rounded-lg bg-green-700 px-4 py-2 text-sm font-semibold text-white hover:bg-green-800"
          >
            হোম পেজে ফিরে যান
          </Link>
        </div>
      </main>
    );
  }

  // Product Not Found
  if (!product || !currentProduct) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center bg-[#f0f5f0] px-4">
        <div className="text-center">
          <div className="text-4xl" aria-hidden="true">
            🛒
          </div>

          <h1 className="mt-3 text-lg font-bold text-[#303a32]">
            পণ্য পাওয়া যায়নি
          </h1>

          <p className="mt-2 text-sm text-[#778078]">
            পণ্যের লিংকটি সঠিক কি না পরীক্ষা করুন।
          </p>

          <Link
            href="/"
            className="mt-4 inline-flex rounded-lg bg-green-700 px-4 py-2 text-sm font-semibold text-white hover:bg-green-800"
          >
            হোম পেজে ফিরে যান
          </Link>
        </div>
      </main>
    );
  }

  const trend = currentProduct.change?.dir ?? "flat";
  const percentage = Math.abs(
    currentProduct.change?.pct ?? 0
  );

  return (
    <main className="min-h-screen bg-[#f0f5f0] px-3 py-3 sm:px-5 sm:py-4">
      <div className="mx-auto max-w-5xl">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="mb-3 flex flex-wrap items-center gap-2 text-[11px] text-[#59645b]"
        >
          <Link href="/" className="hover:text-green-700">
            হোম
          </Link>

          <span aria-hidden="true">›</span>

          <Link
            href={`/category/${product.category}`}
            className="hover:text-green-700"
          >
            {product.categoryNameBn}
          </Link>

          <span aria-hidden="true">›</span>

          <span className="font-medium text-[#303a32]">
            {product.nameBn}
          </span>
        </nav>

        {/* Product Header */}
        <section className="flex flex-col justify-between gap-3 rounded-2xl border border-[#e0e8e1] bg-[#fbfdfb] p-4 sm:flex-row sm:items-center sm:px-5 sm:py-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#f0f5f0] text-3xl sm:h-[60px] sm:w-[60px]">
              <span aria-hidden="true">
                {currentProduct.image ||
                  currentProduct.categoryIcon ||
                  "🛒"}
              </span>
            </div>

            <div className="min-w-0">
              <h1 className="text-lg font-extrabold leading-7 text-[#303a32] sm:text-xl">
                {currentProduct.nameBn}
              </h1>

              <p className="text-[11px] text-[#778078]">
                প্রতি {getUnit(currentProduct.unit)} ·{" "}
                {currentProduct.categoryNameBn}
              </p>

              <p className="mt-1 text-[11px] text-[#59645b]">
                {currentProduct.yesterday < currentProduct.today
                  ? `গতকালের তুলনায় আজ দাম বেড়েছে ${bnNumber(
                      currentProduct.today -
                        currentProduct.yesterday
                    )} টাকা`
                  : currentProduct.yesterday >
                      currentProduct.today
                    ? `গতকালের তুলনায় আজ দাম কমেছে ${bnNumber(
                        currentProduct.yesterday -
                          currentProduct.today
                      )} টাকা`
                    : "গতকালের তুলনায় আজ দামের পরিবর্তন নেই"}
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center justify-between gap-4 rounded-xl bg-[#f0f5f0] px-4 py-3 sm:min-w-[105px] sm:flex-col sm:gap-0 sm:text-center">
            <div>
              <p className="text-[10px] text-[#778078]">
                আজকের দাম
              </p>

              <p className="text-2xl font-extrabold leading-8 text-[#303a32]">
                {bnNumber(currentProduct.today)}
              </p>

              <p className="text-[10px] text-[#778078]">
                টাকা / {getUnit(currentProduct.unit)}
              </p>
            </div>

            <p
              className={`text-[11px] font-bold ${
                trend === "up"
                  ? "text-red-600"
                  : trend === "down"
                    ? "text-green-700"
                    : "text-gray-500"
              }`}
            >
              {trend === "up"
                ? "▲"
                : trend === "down"
                  ? "▼"
                  : "−"}{" "}
              {bnNumber(percentage)}%
            </p>
          </div>
        </section>

        {/* Summary and Market Table: One Card */}
        <section className="mt-3 rounded-2xl border border-[#e0e8e1] bg-[#fbfdfb] p-3 sm:p-4">
          <h2 className="mb-3 text-sm font-bold text-[#303a32]">
            দামের সারসংক্ষেপ
          </h2>

          {detailsLoading ? (
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-[72px] animate-pulse rounded-xl bg-[#f0f5f0]"
                />
              ))}
            </div>
          ) : marketSummary ? (
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              <div className="rounded-xl border border-[#e2eae3] px-3 py-3">
                <p className="text-[11px] text-[#778078]">
                  সর্বনিম্ন দাম
                </p>

                <p className="mt-1 text-base font-bold text-[#199653]">
                  {bnNumber(marketSummary.lowest)}{" "}
                  <span className="text-xs font-medium">
                    টাকা
                  </span>
                </p>

                <p className="mt-1 text-[10px] text-[#778078]">
                  বাজারগুলোর মধ্যে
                </p>
              </div>

              <div className="rounded-xl border border-[#e2eae3] px-3 py-3">
                <p className="text-[11px] text-[#778078]">
                  সর্বোচ্চ দাম
                </p>

                <p className="mt-1 text-base font-bold text-[#dc4843]">
                  {bnNumber(marketSummary.highest)}{" "}
                  <span className="text-xs font-medium">
                    টাকা
                  </span>
                </p>

                <p className="mt-1 text-[10px] text-[#778078]">
                  বাজারগুলোর মধ্যে
                </p>
              </div>

              <div className="rounded-xl border border-[#e2eae3] px-3 py-3">
                <p className="text-[11px] text-[#778078]">
                  আনুমানিক গড় দাম
                </p>

                <p className="mt-1 text-base font-bold text-[#199653]">
                  {bnNumber(marketSummary.average)}{" "}
                  <span className="text-xs font-medium">
                    টাকা
                  </span>
                </p>

                <p className="mt-1 text-[10px] text-[#778078]">
                  প্রতিটি বাজারের মধ্যমানের গড়
                </p>
              </div>
            </div>
          ) : (
            <p className="py-3 text-xs text-[#778078]">
              {detailsError || "বাজারভিত্তিক তথ্য পাওয়া যায়নি।"}
            </p>
          )}

          {/* Market Table */}
          <h2 className="mb-3 mt-4 text-sm font-bold text-[#303a32]">
            বাজারভিত্তিক আজকের দাম
          </h2>

          {detailsLoading ? (
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((item) => (
                <div
                  key={item}
                  className="h-8 animate-pulse rounded-lg bg-[#f0f5f0]"
                />
              ))}
            </div>
          ) : markets.length > 0 ? (
            <div className="overflow-x-auto rounded-xl border border-[#e0e8e1]">
              <table className="w-full min-w-[600px] border-collapse text-left text-[11px]">
                <thead className="bg-[#fbfdfb] text-[#778078]">
                  <tr>
                    <th className="px-3 py-3 font-semibold">
                      বাজার
                    </th>

                    <th className="px-3 py-3 font-semibold">
                      বিভাগ
                    </th>

                    <th className="px-3 py-3 text-right font-semibold">
                      সর্বনিম্ন
                    </th>

                    <th className="px-3 py-3 text-right font-semibold">
                      সর্বোচ্চ
                    </th>

                    <th className="px-3 py-3 text-right font-semibold">
                      গড়
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {markets.map((market, index) => (
                    <tr
                      key={`${market.market}-${market.division}`}
                      className={
                        index % 2 === 0
                          ? "border-t border-[#dce5dd] bg-[#f0f5f0]"
                          : "border-t border-[#dce5dd] bg-[#fbfdfb]"
                      }
                    >
                      <td className="px-3 py-2.5 font-medium text-[#303a32]">
                        {market.market}
                      </td>

                      <td className="px-3 py-2.5 text-[#59645b]">
                        {market.division}
                      </td>

                      <td className="px-3 py-2.5 text-right text-[#303a32]">
                        {bnNumber(market.min)} টাকা
                      </td>

                      <td className="px-3 py-2.5 text-right text-[#303a32]">
                        {bnNumber(market.max)} টাকা
                      </td>

                      <td className="px-3 py-2.5 text-right font-bold text-[#303a32]">
                        {bnNumber(
                          (market.min + market.max) / 2
                        )}{" "}
                        টাকা
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="py-3 text-xs text-[#778078]">
              {detailsError ||
                "এই পণ্যের বাজারভিত্তিক তথ্য নেই।"}
            </p>
          )}
        </section>
      </div>
    </main>
  );
}