import Image from "next/image";
import Hero from "@/homePage/Hero";
import PriceRisers from "@/homePage/PriceRisers";
import PriceFallers from "@/homePage/PriceFallers";
import ProductList from "@/homePage/ProductList";

export default function Home() {
  return (
    <div>
      <Hero />
      <PriceRisers />
      <PriceFallers />
      <ProductList />
    </div>
  );
}
