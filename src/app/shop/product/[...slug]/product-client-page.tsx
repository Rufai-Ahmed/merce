"use client";

import {
  useGetProductByIdQuery,
  useGetProductReviewsQuery,
  useGetProductsQuery,
} from "@/apis/product.api";
import ProductListSec from "@/components/common/ProductListSec";
import BreadcrumbProduct from "@/components/product-page/BreadcrumbProduct";
import Header from "@/components/product-page/Header";
import Tabs from "@/components/product-page/Tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { notFound } from "next/navigation";

type Props = {
  productId: number;
};

export default function ProductPageClient({ productId }: Props) {
  const {
    data: product,
    isLoading,
    isError,
  } = useGetProductByIdQuery(productId);
  const { data: relatedProductsData, isLoading: isRelatedLoading } =
    useGetProductsQuery(
      {
        include: product?.relatedIds?.join(",") || "",
        per_page: 4,
      },
      { skip: !product?.relatedIds?.length }
    );
  const { data: reviewsData, isLoading: isReviewsLoading } =
    useGetProductReviewsQuery({ productId, per_page: 4 }, { skip: !product });

  if (isLoading) {
    return (
      <main>
        <div className="max-w-frame mx-auto px-4 xl:px-0">
          <hr className="h-[1px] border-t-black/10 mb-5 sm:mb-6" />
          <Skeleton className="h-6 w-1/2 mb-5" /> {/* Breadcrumb */}
          <section className="mb-11">
            <Skeleton className="h-64 w-full" /> {/* Header */}
            <Skeleton className="h-32 w-full mt-4" /> {/* Tabs */}
          </section>
        </div>
      </main>
    );
  }

  if (isError || !product) {
    notFound();
  }

  return (
    <main>
      <div className="max-w-frame mx-auto px-4 xl:px-0">
        <hr className="h-[1px] border-t-black/10 mb-5 sm:mb-6" />
        <BreadcrumbProduct title={product?.title ?? "product"} />
        <section className="mb-11">
          <Header data={product} />
        </section>
        <Tabs
          product={product}
          reviewsData={reviewsData?.data || []}
          isReviewsLoading={isReviewsLoading}
        />
      </div>
      <div className="mb-[50px] sm:mb-20">
        <ProductListSec
          isLoading={isRelatedLoading}
          title="You might also like"
          data={relatedProductsData?.data || []}
        />
      </div>
    </main>
  );
}
