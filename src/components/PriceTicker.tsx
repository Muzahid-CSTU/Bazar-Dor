
"use client";

import { useProducts, type Product } from "@/context/ProductContext";

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

function ProductIcon({ product }: { product: Product }) {
  const icon = product.image || product.categoryIcon || "🛒";

  if (/^https?:\/\//i.test(icon)) {
    return (
      <img
        src={icon}
        alt=""
        className="h-5 w-5 shrink-0 object-contain"
      />
    );
  }

  return (
    <span className="text-sm leading-none" aria-hidden="true">
      {icon}
    </span>
  );
}

export default function PriceTicker() {
  const { products, loading, error } = useProducts();

  if (loading) {
    return (
      <section
        aria-label="বাজারদরের আপডেট"
        className="h-12 w-full border-y border-[#e2eae3] bg-[#fbfdfb]"
      />
    );
  }

  if (error || products.length === 0) {
    return (
      <section
        aria-label="বাজারদরের আপডেট"
        className="flex h-12 items-center border-y border-[#e2eae3] bg-[#fbfdfb] px-4"
      >
        <p className="text-xs text-gray-500">
          এই মুহূর্তে বাজারদরের তথ্য পাওয়া যাচ্ছে না।
        </p>
      </section>
    );
  }

  return (
    <section
      aria-label="বাজারদরের আপডেট"
      className="w-full overflow-hidden border-y border-[#e2eae3] bg-[#fbfdfb]"
    >
      <div className="flex h-12 items-center overflow-hidden">
        <div className="ticker-track flex w-max items-center">
          {[...products, ...products].map((product, index) => {
            const direction = product.change?.dir ?? "flat";
            const percentage = Math.abs(product.change?.pct ?? 0);

            return (
              <div
                key={`${product.id}-${index}`}
                className="flex h-12 shrink-0 items-center gap-2 border-r border-[#e2eae3] px-3 sm:px-4"
              >
                <ProductIcon product={product} />

                <span className="whitespace-nowrap text-xs font-medium text-[#303a32] sm:text-sm">
                  {product.nameBn}
                </span>

                <span className="whitespace-nowrap text-xs font-semibold text-[#303a32] sm:text-sm">
                  {bnNumber(product.today)} টাকা/
                  {getUnit(product.unit)}
                </span>

                <span
                  className={`flex shrink-0 items-center gap-1 whitespace-nowrap text-xs font-bold sm:text-sm ${
                    direction === "up"
                      ? "text-[#dc3f43]"
                      : direction === "down"
                        ? "text-[#159653]"
                        : "text-[#68736a]"
                  }`}
                >
                  {direction === "up" ? (
                    <span aria-label="দাম বেড়েছে">▲</span>
                  ) : direction === "down" ? (
                    <span aria-label="দাম কমেছে">▼</span>
                  ) : (
                    <span aria-label="দাম অপরিবর্তিত">—</span>
                  )}

                  {bnNumber(percentage)}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
