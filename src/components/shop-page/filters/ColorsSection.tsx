"use client";

import React, { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { IoMdCheckmark } from "react-icons/io";
import { cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import {
  useGetAttributesQuery,
  useGetAttributeTermsQuery,
} from "@/apis/product.api";
import { Skeleton } from "@/components/ui/skeleton";

interface ColorsSectionProps {
  updateSearchParams: (params: {
    [key: string]: string | number | undefined;
  }) => void;
}

const colorMap: { [key: string]: string } = {
  black: "bg-black",
  blue: "bg-blue-600",
  brown: "bg-[#8B4513]", 
  green: "bg-green-600",
  grey: "bg-gray-500",
  orange: "bg-orange-600",
  pink: "bg-pink-600",
  purple: "bg-purple-600",
  red: "bg-red-600",
  white: "bg-white border border-black/20",
  yellow: "bg-yellow-300",
};

const ColorsSection: React.FC<ColorsSectionProps> = ({
  updateSearchParams,
}) => {
  const searchParams = useSearchParams();
  const { data: attributes, isLoading: isAttributesLoading } =
    useGetAttributesQuery();
  const selectedColor = searchParams.get("color") || "";
  const colorAttribute = attributes?.find((attr) => attr.slug === "pa_color");
  const { data: colorTerms, isLoading: isTermsLoading } =
    useGetAttributeTermsQuery(colorAttribute?.id || 0, {
      skip: !colorAttribute,
    });

  if (isAttributesLoading || isTermsLoading) {
    return (
      <div className="flex flex-wrap gap-2.5">
        {[...Array(10)].map((_, i) => (
          <Skeleton key={i} className="w-10 h-10 rounded-full" />
        ))}
      </div>
    );
  }

  return (
    <Accordion type="single" collapsible defaultValue="filter-colors">
      <AccordionItem value="filter-colors" className="border-none">
        <AccordionTrigger className="text-black font-bold text-xl hover:no-underline p-0 py-0.5">
          Colors
        </AccordionTrigger>
        <AccordionContent className="pt-4 pb-0">
          <div className="flex space-2.5 flex-wrap md:grid grid-cols-5 gap-2.5">
            {colorTerms?.map((term) => (
              <button
                key={term.id}
                type="button"
                className={cn([
                  colorMap[term.slug.toLowerCase()] || "bg-gray-400",
                  "rounded-full w-9 sm:w-10 h-9 sm:h-10 flex items-center justify-center border border-black/20",
                ])}
                onClick={() =>
                  updateSearchParams({ color: term.slug, page: 1 })
                }
              >
                {selectedColor === term.slug && (
                  <IoMdCheckmark className="text-base text-white" />
                )}
              </button>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default ColorsSection;
