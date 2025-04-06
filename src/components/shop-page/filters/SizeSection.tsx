"use client";

import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useGetAttributesQuery,
  useGetAttributeTermsQuery,
} from "@/apis/product.api";

interface SizeSectionProps {
  updateSearchParams: (params: {
    [key: string]: string | number | undefined;
  }) => void;
}

const SizeSection: React.FC<SizeSectionProps> = ({ updateSearchParams }) => {
  const searchParams = useSearchParams();
  const selectedSize = searchParams.get("size") || "";
  const { data: attributes, isLoading: isAttributesLoading } =
    useGetAttributesQuery();

  const sizeAttribute = attributes?.find((attr) => attr.slug === "pa_size");
  const { data: sizeTerms, isLoading: isTermsLoading } =
    useGetAttributeTermsQuery(sizeAttribute?.id || 0, { skip: !sizeAttribute });

  if (isAttributesLoading || isTermsLoading) {
    return (
      <div className="flex flex-wrap gap-2">
        {[...Array(9)].map((_, i) => (
          <Skeleton key={i} className="h-10 w-20 rounded-full" />
        ))}
      </div>
    );
  }

  return (
    <Accordion type="single" collapsible defaultValue="filter-size">
      <AccordionItem value="filter-size" className="border-none">
        <AccordionTrigger className="text-black font-bold text-xl hover:no-underline p-0 py-0.5">
          Size
        </AccordionTrigger>
        <AccordionContent className="pt-4 pb-0">
          <div className="flex items-center flex-wrap">
            {sizeTerms?.map((term) => (
              <button
                key={term.id}
                type="button"
                className={cn([
                  "bg-[#F0F0F0] m-1 flex items-center justify-center px-5 py-2.5 text-sm rounded-full max-h-[39px]",
                  selectedSize === term.slug &&
                    "bg-black font-medium text-white",
                ])}
                onClick={() => updateSearchParams({ size: term.slug, page: 1 })}
              >
                {term.name}
              </button>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default SizeSection;
