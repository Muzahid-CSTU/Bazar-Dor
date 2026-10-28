import React, { Suspense } from "react";
import CategoryPage from "./CategoryPage";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

const CategoryLoading = () => {
  return (
    <section className="min-h-[60vh] bg-[#f0f5f0] px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-5 h-20 animate-pulse rounded-2xl bg-white" />

        <div className="mb-4 h-14 animate-pulse rounded-xl bg-white" />

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-28 animate-pulse rounded-xl border border-[#e2eae3] bg-white p-4"
            >
              <div className="h-4 w-28 rounded bg-gray-200" />
              <div className="mt-4 h-3 w-20 rounded bg-gray-200" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const CategoryContent = async ({ params }: PageProps) => {
  const { slug } = await params;

  return <CategoryPage slug={slug} />;
};

const Page = ({ params }: PageProps) => {
  return (
    <Suspense fallback={<CategoryLoading />}>
      <CategoryContent params={params} />
    </Suspense>
  );
};

export default Page;