"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";

type ProductDetailContentProps = {
  slug?: string;
};

type Market = {
  market: string;
  division: string;
  min: number;
  max: number;
};

type ProductDetails = {
  id: number;
  slug?: string;
  nameBn: string;
  category: string;
  categoryNameBn: string;
  categoryIcon: string;
  unit: string;
  image?: string;
  today: number;
  yesterday: number;
  lastWeek?: number;
  lastMonth?: number;
  change?: {
    dir: "up" | "down" | "flat";
    pct: number;
  };
  markets?: Market[];
};

const BASE_URL = "https://api.api-store.workers.dev";
const FALLBACK_URL = "https://openapi.programming-hero.com";

const bnNumber = (value: number) => {
  return new Intl.NumberFormat("bn-BD", {
    maximumFractionDigits: 2,
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

const LoadingSkeleton = () => {
  return (
    <main className="min-h-screen bg-[#f0f5f0] px-3 py-4 sm:px-5">
      <div className="mx-auto max-w-5xl animate-pulse space-y-3">
        <div className="h-4 w-48 rounded bg-gray-200" />
        <div className="h-32 rounded-2xl bg-white" />
        <div className="h-80 rounded-2xl bg-white" />
      </div>
    </main>
  );
};

const ProductDetailContent = ({ slug }: ProductDetailContentProps) => {
  const router = useRouter();
  const routeParams = useParams();
  const currentSlug = String(slug || routeParams?.slug || "");

  const { data: session, isPending: authPending } = authClient.useSession();
  const [details, setDetails] = useState<ProductDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authPending && !session?.user) {
      toast.error("বিস্তারিত দেখতে অনুগ্রহ করে আগে সাইন ইন করুন");
      router.push(`/signin?callbackUrl=/product/${currentSlug}`);
    }
  }, [authPending, session, router, currentSlug]);

  useEffect(() => {
    let isMounted = true;

    const loadProductData = async () => {
      if (!currentSlug) return;
      setLoading(true);

      const targetSlug = decodeURIComponent(currentSlug).toLowerCase().trim();

      try {
        let allProducts: any[] = [];
        const baseUrls = [BASE_URL, FALLBACK_URL];

        for (const base of baseUrls) {
          try {
            const res = await fetch(`${base}/api/bazardor/products`, {
              cache: "no-store",
            });
            if (res.ok) {
              const resData = await res.json();
              allProducts = Array.isArray(resData)
                ? resData
                : resData?.data || [];
              if (allProducts.length > 0) break;
            }
          } catch {
            // next url
          }
        }

        const matchedItem = allProducts.find((item) => {
          const itemSlug = (item.slug || "").toString().toLowerCase().trim();
          const itemId = (item.id || "").toString().toLowerCase().trim();
          return itemSlug === targetSlug || itemId === targetSlug;
        });

        if (!matchedItem) {
          if (isMounted) {
            setDetails(null);
            setLoading(false);
          }
          return;
        }

        let singleProductData: ProductDetails | null = null;

        for (const base of baseUrls) {
          try {
            const singleRes = await fetch(
              `${base}/api/bazardor/products/${matchedItem.id}`,
              { cache: "no-store" }
            );

            if (singleRes.ok) {
              const resJson = await singleRes.json();
              const payload = resJson?.data || resJson;

              if (payload && typeof payload === "object") {
                singleProductData = {
                  ...matchedItem,
                  ...payload,
                  markets: payload.markets || matchedItem.markets || [],
                };
                break;
              }
            }
          } catch {
            // fallback
          }
        }

        if (isMounted) {
          setDetails(singleProductData || matchedItem);
          setLoading(false);
        }
      } catch {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (!authPending && session?.user) {
      loadProductData();
    }

    return () => {
      isMounted = false;
    };
  }, [currentSlug, authPending, session]);

  const markets = details?.markets || [];

  const marketSummary = useMemo(() => {
    if (!markets || markets.length === 0) {
      return null;
    }

    const lowest = Math.min(...markets.map((m) => m.min));
    const highest = Math.max(...markets.map((m) => m.max));
    const average =
      markets.reduce((total, m) => total + (m.min + m.max) / 2, 0) /
      markets.length;

    return { lowest, highest, average };
  }, [markets]);

  if (authPending || loading) {
    return <LoadingSkeleton />;
  }

  if (!session?.user) {
    return null;
  }

  if (!details) {
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

  const trend = details.change?.dir ?? "flat";
  const percentage = Math.abs(details.change?.pct ?? 0);

  return (
    <main className="min-h-screen bg-[#f0f5f0] px-3 py-3 sm:px-5 sm:py-4">
      <div className="mx-auto max-w-5xl">
        <nav
          aria-label="Breadcrumb"
          className="mb-3 flex flex-wrap items-center gap-2 text-[11px] text-[#59645b]"
        >
          <Link href="/" className="hover:text-green-700">
            হোম
          </Link>

          <span aria-hidden="true">›</span>

          <Link
            href={`/category/${details.category}`}
            className="hover:text-green-700"
          >
            {details.categoryNameBn}
          </Link>

          <span aria-hidden="true">›</span>

          <span className="font-medium text-[#303a32]">{details.nameBn}</span>
        </nav>

        <section className="flex flex-col justify-between gap-3 rounded-2xl border border-[#e0e8e1] bg-[#fbfdfb] p-4 sm:flex-row sm:items-center sm:px-5 sm:py-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#f0f5f0] text-3xl sm:h-[60px] sm:w-[60px]">
              <span aria-hidden="true">
                {details.image || details.categoryIcon || "🛒"}
              </span>
            </div>

            <div className="min-w-0">
              <h1 className="text-lg font-extrabold leading-7 text-[#303a32] sm:text-xl">
                {details.nameBn}
              </h1>

              <p className="text-[11px] text-[#778078]">
                প্রতি {getUnit(details.unit)} · {details.categoryNameBn}
              </p>

              <p className="mt-1 text-[11px] text-[#59645b]">
                {details.yesterday < details.today
                  ? `গতকালের তুলনায় আজ দাম বেড়েছে ${bnNumber(
                      details.today - details.yesterday
                    )} টাকা`
                  : details.yesterday > details.today
                    ? `গতকালের তুলনায় আজ দাম কমেছে ${bnNumber(
                        details.yesterday - details.today
                      )} টাকা`
                    : "গতকালের তুলনায় আজ দামের পরিবর্তন নেই"}
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center justify-between gap-4 rounded-xl bg-[#f0f5f0] px-4 py-3 sm:min-w-[105px] sm:flex-col sm:gap-0 sm:text-center">
            <div>
              <p className="text-[10px] text-[#778078]">আজকের দাম</p>

              <p className="text-2xl font-extrabold leading-8 text-[#303a32]">
                {bnNumber(details.today)}
              </p>

              <p className="text-[10px] text-[#778078]">
                টাকা / {getUnit(details.unit)}
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
              {trend === "up" ? "▲" : trend === "down" ? "▼" : "−"}{" "}
              {bnNumber(percentage)}%
            </p>
          </div>
        </section>

        <section className="mt-3 rounded-2xl border border-[#e0e8e1] bg-[#fbfdfb] p-3 sm:p-4">
          <h2 className="mb-3 text-sm font-bold text-[#303a32]">
            দামের সারসংক্ষেপ
          </h2>

          {marketSummary ? (
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              <div className="rounded-xl border border-[#e2eae3] px-3 py-3">
                <p className="text-[11px] text-[#778078]">সর্বনিম্ন দাম</p>

                <p className="mt-1 text-base font-bold text-[#199653]">
                  {bnNumber(marketSummary.lowest)}{" "}
                  <span className="text-xs font-medium">টাকা</span>
                </p>

                <p className="mt-1 text-[10px] text-[#778078]">
                  সব বাজারগুলোর মধ্যে
                </p>
              </div>

              <div className="rounded-xl border border-[#e2eae3] px-3 py-3">
                <p className="text-[11px] text-[#778078]">সর্বোচ্চ দাম</p>

                <p className="mt-1 text-base font-bold text-[#dc4843]">
                  {bnNumber(marketSummary.highest)}{" "}
                  <span className="text-xs font-medium">টাকা</span>
                </p>

                <p className="mt-1 text-[10px] text-[#778078]">
                  সব বাজারগুলোর মধ্যে
                </p>
              </div>

              <div className="rounded-xl border border-[#e2eae3] px-3 py-3">
                <p className="text-[11px] text-[#778078]">আনুমানিক গড় দাম</p>

                <p className="mt-1 text-base font-bold text-[#199653]">
                  {bnNumber(marketSummary.average)}{" "}
                  <span className="text-xs font-medium">টাকা</span>
                </p>

                <p className="mt-1 text-[10px] text-[#778078]">
                  প্রতিটি বাজারের মধ্যমানের গড়
                </p>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-[#e2eae3] p-4 text-center text-xs text-[#778078]">
              দামের সারসংক্ষেপের তথ্য পাওয়া যায়নি
            </div>
          )}

          <h2 className="mb-3 mt-4 text-sm font-bold text-[#303a32]">
            বাজারভিত্তিক আজকের দাম
          </h2>

          {markets && markets.length > 0 ? (
            <div className="overflow-x-auto rounded-xl border border-[#e0e8e1]">
              <table className="w-full min-w-[600px] border-collapse text-left text-[11px]">
                <thead className="bg-[#fbfdfb] text-[#778078]">
                  <tr>
                    <th className="px-3 py-3 font-semibold">বাজার</th>
                    <th className="px-3 py-3 font-semibold">বিভাগ</th>
                    <th className="px-3 py-3 text-right font-semibold">
                      সর্বনিম্ন
                    </th>
                    <th className="px-3 py-3 text-right font-semibold">
                      সর্বোচ্চ
                    </th>
                    <th className="px-3 py-3 text-right font-semibold">গড়</th>
                  </tr>
                </thead>

                <tbody>
                  {markets.map((market, index) => (
                    <tr
                      key={`${market.market}-${market.division}-${index}`}
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
                        {bnNumber((market.min + market.max) / 2)} টাকা
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="py-3 text-xs text-[#778078]">
              এই পণ্যের কোনো বাজারভিত্তিক তথ্য পাওয়া যায়নি।
            </p>
          )}
        </section>
      </div>
    </main>
  );
};

export default ProductDetailContent;