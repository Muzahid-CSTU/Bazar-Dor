import { FaArrowTrendDown } from "react-icons/fa6";

const fallingProducts = [
  { id: 1, name: "কাঁচামরিচ", emoji: "🌶️", price: 92, change: 4.8, unit: "কেজি" },
  { id: 2, name: "রসুন", emoji: "🧄", price: 125, change: 2.8, unit: "কেজি" },
  { id: 3, name: "আলু", emoji: "🥔", price: 30, change: 2.6, unit: "কেজি" },
  { id: 4, name: "কাতলা মাছ", emoji: "🐠", price: 430, change: 4.4, unit: "কেজি" },
  { id: 5, name: "হাঁসের মাংস", emoji: "🦆", price: 285, change: 3.8, unit: "কেজি" },
  { id: 6, name: "খাসির মাংস", emoji: "🍖", price: 1290, change: 3.0, unit: "কেজি" },
];

function bnNumber(value: number) {
  return new Intl.NumberFormat("bn-BD", {
    maximumFractionDigits: 1,
  }).format(value);
}

export default function PriceFallers() {
  return (
    <section className="bg-[#f0f5f0] px-4 py-3 sm:px-5">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-3 flex items-center gap-2 text-base font-bold text-[#303a32]">
          <FaArrowTrendDown size={13} className="text-green-600" />
          আজ দাম কমেছে
        </h2>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {fallingProducts.map((product) => (
            <article
              key={product.id}
              className="rounded-[14px] border border-[#e2eae3] bg-[#fbfdfb] p-3"
            >
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-[#f0f5f0] text-xl">
                  {product.emoji}
                </div>

                <div>
                  <h3 className="text-[13px] font-bold leading-5 text-[#303a32]">
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

                <span className="mb-0.5 inline-flex shrink-0 items-center gap-1 rounded-full bg-[#edf6ef] px-2 py-1 text-[9px] font-bold text-[#199653]">
                  <FaArrowTrendDown size={9} />
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
