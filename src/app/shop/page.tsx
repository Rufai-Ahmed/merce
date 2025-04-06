"use client";
import BreadcrumbShop from "@/components/shop-page/BreadcrumbShop";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import MobileFilters from "@/components/shop-page/filters/MobileFilters";
import Filters from "@/components/shop-page/filters";
import { FiSliders } from "react-icons/fi";
import ProductCard from "@/components/common/ProductCard";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useGetProductsQuery } from "@/apis/product.api";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetCategoryByIdQuery } from "@/apis/category.api";
import { Metadata } from "next";

const metadata: Metadata = {
  title: "Shop - Browse All Products | BigVybz",
  description:
    "Explore our wide range of products at My Site. Find the best deals and shop now!",
  openGraph: {
    title: "Shop - Browse All Products",
    description: "Explore our wide range of products at My Site.",
    url: "https://bigvybz.com/shop",
  },
};

export default function ShopPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const sortMap = {
    "most-popular": { orderby: "popularity", order: "desc" },
    "low-price": { orderby: "price", order: "asc" },
    "high-price": { orderby: "price", order: "desc" },
  };

  const page = Number(searchParams.get("page")) || 1;
  const category = searchParams.get("category") || "";
  const minPrice = Number(searchParams.get("minPrice")) || undefined;
  const maxPrice = Number(searchParams.get("maxPrice")) || undefined;
  const color = searchParams.get("color") || "";
  const size = searchParams.get("size") || "";
  const style = searchParams.get("style") || "";
  const sort = (searchParams.get("sort") || "most-popular") as
    | "most-popular"
    | "low-price"
    | "high-price";

  const filterParams = {
    page,
    per_page: 10,
    ...(category && { category }), // Category ID
    ...(minPrice && { min_price: minPrice }),
    ...(maxPrice && { max_price: maxPrice }),
    ...(color && { attribute_term: "pa_color", attribute: color }),
    ...(size && { attribute_term: "pa_size", attribute: size }),
    ...(style && { tag: style }),
    orderby: sortMap[sort].orderby,
    order: sortMap[sort].order,
    stock_status: "instock",
  };

  const { data, isLoading, isError } = useGetProductsQuery(filterParams);
  const {
    data: categoryData,
    isLoading: isCategoryLoading,
    isError: isCategoryError,
  } = useGetCategoryByIdQuery(Number(category), {
    skip: !category,
  });

  const updateSearchParams = (newParams: {
    [key: string]: string | number | undefined;
  }) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(newParams).forEach(([key, value]) => {
      if (value === undefined || value === "") params.delete(key);
      else params.set(key, value.toString());
    });
    router.push(`/shop?${params.toString()}`, { scroll: false });
  };

  if (isLoading || (category && isCategoryLoading)) {
    return (
      <main className="pb-20">
        <div className="max-w-frame mx-auto px-4 xl:px-0">
          <hr className="h-[1px] border-t-black/10 mb-5 sm:mb-6" />
          <Skeleton className="h-6 w-1/3 mb-5" /> {/* Breadcrumb */}
          <div className="flex md:space-x-5 items-start">
            <div className="hidden md:block min-w-[295px] max-w-[295px]">
              <Skeleton className="h-64 w-full" /> {/* Filters */}
            </div>
            <div className="flex flex-col w-full space-y-5">
              <Skeleton className="h-8 w-1/4" /> {/* Title */}
              <div className="w-full grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
                {[...Array(10)].map((_, index) => (
                  <Skeleton key={index} className="h-64 w-full" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (isError || !data || (category && isCategoryError)) {
    return <div>Error loading products</div>;
  }

  const totalPages = data.totalPages;
  const products = data.data;
  const pageTitle = categoryData?.name || "All Products";

  return (
    <main className="pb-20">
      <div className="max-w-frame mx-auto px-4 xl:px-0">
        <hr className="h-[1px] border-t-black/10 mb-5 sm:mb-6" />
        <BreadcrumbShop />
        <div className="flex md:space-x-5 items-start">
          <div className="hidden md:block min-w-[295px] max-w-[295px] border border-black/10 rounded-[20px] px-5 md:px-6 py-5 space-y-5 md:space-y-6">
            <div className="flex items-center justify-between">
              <span className="font-bold text-black text-xl">Filters</span>
              <FiSliders className="text-2xl text-black/40" />
            </div>
            <Filters updateSearchParams={updateSearchParams} />
          </div>
          <div className="flex flex-col w-full space-y-5">
            <div className="flex flex-col lg:flex-row lg:justify-between">
              <div className="flex items-center justify-between">
                <h1 className="font-bold text-2xl md:text-[32px]">
                  {pageTitle}
                </h1>
                <MobileFilters
                  isOpen={isMobileFilterOpen}
                  setIsOpen={setIsMobileFilterOpen}
                  updateSearchParams={updateSearchParams}
                />
              </div>
              <div className="flex flex-col sm:items-center sm:flex-row">
                <span className="text-sm md:text-base text-black/60 mr-3">
                  Showing {(page - 1) * 10 + 1}-
                  {Math.min(page * 10, data.total)} of {data.total} Products
                </span>
                <div className="flex items-center">
                  Sort by:{" "}
                  <Select
                    value={sort}
                    onValueChange={(value) =>
                      updateSearchParams({ sort: value })
                    }
                  >
                    <SelectTrigger className="font-medium text-sm px-1.5 sm:text-base w-fit text-black bg-transparent shadow-none border-none">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="most-popular">Most Popular</SelectItem>
                      <SelectItem value="low-price">Low Price</SelectItem>
                      <SelectItem value="high-price">High Price</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <div className="w-full grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
              {products.map((product) => (
                <ProductCard key={product.id} data={product} />
              ))}
            </div>
            <hr className="border-t-black/10" />
            <Pagination className="justify-between">
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (page > 1) updateSearchParams({ page: page - 1 });
                }}
                className="border border-black/10"
              />
              <PaginationContent>
                {Array.from(
                  { length: Math.min(totalPages, 5) },
                  (_, i) => i + 1
                ).map((p) => (
                  <PaginationItem key={p}>
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        updateSearchParams({ page: p });
                      }}
                      className="text-black/50 font-medium text-sm"
                      isActive={p === page}
                    >
                      {p}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                {totalPages > 5 && (
                  <>
                    <PaginationItem>
                      <PaginationEllipsis className="text-black/50 font-medium text-sm" />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          updateSearchParams({ page: totalPages });
                        }}
                        className="text-black/50 font-medium text-sm"
                      >
                        {totalPages}
                      </PaginationLink>
                    </PaginationItem>
                  </>
                )}
              </PaginationContent>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (page < totalPages) updateSearchParams({ page: page + 1 });
                }}
                className="border border-black/10"
              />
            </Pagination>
          </div>
        </div>
      </div>
    </main>
  );
}
