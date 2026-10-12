import {
  FaArrowTrendUp,
} from "react-icons/fa6";

const risingProducts = [
  { id: 1, name: "পেঁয়াজ", emoji: "🧅", price: 58, change: 2.5, unit: "কেজি" },
  { id: 2, name: "আদা", emoji: "🫚", price: 85, change: 3.0, unit: "কেজি" },
  { id: 3, name: "বেগুন", emoji: "🍆", price: 44, change: 4.8, unit: "কেজি" },
  { id: 4, name: "রুই মাছ", emoji: "🐟", price: 460, change: 4.0, unit: "কেজি" },
  { id: 5, name: "ডিম", emoji: "🥚", price: 158, change: 2.9, unit: "ডজন" },
  { id: 6, name: "মাখন (১০০ গ্রাম)", emoji: "🧈", price: 145, change: 0.6, unit: "পিস" },
];

function bnNumber(value: number) {
  return new Intl.NumberFormat("bn-BD", {
    maximumFractionDigits: 1,
  }).format(value);
}

export default function PriceRisers() {
  return (
    <section className="bg-[#f0f5f0] px-4 py-5 sm:px-5">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-3 flex items-center gap-2 text-base font-bold text-[#303a32]">
          <FaArrowTrendUp className="text-red-500" size={13} />
          আজ দাম বেড়েছে
        </h2>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {risingProducts.map((product) => (
            <article
              key={product.id}
              className="rounded-[14px] border border-[#e2eae3] bg-[#fbfdfb] p-3 transition-shadow hover:shadow-sm sm:p-3"
            >
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-[#f0f5f0] text-xl">
                  <span aria-hidden="true">{product.emoji}</span>
                </div>

                <div className="min-w-0">
                  <h3 className="truncate text-[13px] font-bold leading-5 text-[#303a32]">
                    {product.name}
                  </h3>
                  <p className="text-[10px] text-[#778078]">
                    প্রতি {product.unit}
                  </p>
                </div>
              </div>

              <div className="mt-2 flex items-end justify-between gap-2">
                <div>
                  <p className="text-[10px] leading-4 text-[#778078]">
                    আজকের দাম
                  </p>
                  <p className="text-sm font-bold leading-5 text-[#303a32]">
                    {bnNumber(product.price)}{" "}
                    <span className="text-[11px] font-medium">টাকা</span>
                  </p>
                </div>

                <span className="mb-0.5 inline-flex shrink-0 items-center gap-1 rounded-full bg-[#fdf0ef] px-2 py-1 text-[9px] font-bold text-[#dc4843]">
                  <FaArrowTrendUp size={9} />
                  {bnNumber(product.change)}%
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
