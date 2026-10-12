import Image from "next/image";
import Hero from "@/homePage/Hero";
import PriceTicker from "@/components/PriceTicker";
import PriceRisers from "@/homePage/PriceRisers";
import PriceFallers from "@/homePage/PriceFallers";

export default function Home() {
  return (
    <div>
      <PriceTicker />
      <Hero />
      <PriceRisers />
      <PriceFallers />
    </div>
  );
}
