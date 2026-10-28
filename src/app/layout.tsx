import type { Metadata } from "next";
import { Hind_Siliguri } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import PriceTicker from "@/components/PriceTicker";
import Footer from "@/components/Footer";
import { ProductProvider } from "@/context/ProductContext";
import AuthToast from "@/components/AuthToast"; // Import korun

const hindSiliguri = Hind_Siliguri({
  subsets: ["latin", "bengali"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "বাজার দর",
  description: "নিত্যপ্রয়োজনীয় পণ্যের দৈনন্দিন বাজার দর ও দামের তুলনা",
};

export default function RootLayout({
  children,
}: LayoutProps<"/">) {
  return (
    <html
      lang="bn"
      className={`${hindSiliguri.className} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ProductProvider>
          {/* Shob kichur upore floating notification toiri hobe */}
          <AuthToast />
          <Navbar />
          <PriceTicker />
          <main>{children}</main>
          <Footer />
        </ProductProvider>
      </body>
    </html>
  );
}