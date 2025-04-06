"use client";
import { useGetCategoriesQuery } from "@/apis/category.api";
import { useGetProductsQuery } from "@/apis/product.api";
import ProductListSec from "@/components/common/ProductListSec";
import Brands from "@/components/homepage/Brands";
import DressStyle from "@/components/homepage/DressStyle";
import Header from "@/components/homepage/Header";
import Reviews from "@/components/homepage/Reviews";
import { Metadata } from "next";

const metadata: Metadata = {
  title: "BigVybz",
  description: "Your number one clothing store.",
};

export default function Home() {
  const { data: newArrivals, isLoading: isNewArrivalsLoading } =
    useGetProductsQuery({
      per_page: 10,
      orderby: "date",
      order: "desc",
      fields: [
        "id",
        "name",
        "price",
        "regular_price",
        "sale_price",
        "images",
        "average_rating",
      ],
    });

  const { data: topSelling, isLoading: isTopSellingLoading } =
    useGetProductsQuery({
      per_page: 10,
      orderby: "popularity",
      fields: [
        "id",
        "name",
        "price",
        "regular_price",
        "sale_price",
        "images",
        "average_rating",
      ],
    });

  return (
    <>
      <Header />
      <Brands />
      <main className="my-[50px] sm:my-[72px]">
        <ProductListSec
          title="NEW ARRIVALS"
          data={newArrivals?.data || []}
          viewAllLink="/shop#new-arrivals"
          isLoading={isNewArrivalsLoading}
        />
        <div className="max-w-frame mx-auto px-4 xl:px-0">
          <hr className="h-[1px] border-t-black/10 my-10 sm:my-16" />
        </div>
        <div className="mb-[50px] sm:mb-20">
          <ProductListSec
            title="TOP SELLING"
            data={topSelling?.data || []}
            viewAllLink="/shop#top-selling"
            isLoading={isTopSellingLoading}
          />
        </div>
        <div className="mb-[50px] sm:mb-20">
          <DressStyle />
        </div>
        <Reviews />
      </main>
    </>
  );
}
