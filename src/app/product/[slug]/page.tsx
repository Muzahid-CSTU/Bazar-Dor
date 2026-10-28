import React, { Suspense } from "react";
import ProductDetailContent from "./ProductDetailContent";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

const ProductLoading = () => {
  return (
    <main className="min-h-[60vh] bg-[#f0f5f0] px-4 py-8">
      <div className="mx-auto max-w-4xl animate-pulse rounded-2xl bg-white p-8">
        <div className="h-6 w-40 rounded bg-gray-200" />
        <div className="mt-5 h-4 w-64 rounded bg-gray-200" />
        <div className="mt-8 h-10 w-32 rounded bg-gray-200" />
      </div>
    </main>
  );
};

const ProductRoute = async ({ params }: PageProps) => {
  const resolvedParams = await params;
  return <ProductDetailContent slug={resolvedParams.slug} />;
};

const Page = ({ params }: PageProps) => {
  return (
    <Suspense fallback={<ProductLoading />}>
      <ProductRoute params={params} />
    </Suspense>
  );
};

export default Page;