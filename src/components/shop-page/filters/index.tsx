import React from "react";
import CategoriesSection from "@/components/shop-page/filters/CategoriesSection";
import ColorsSection from "@/components/shop-page/filters/ColorsSection";
import DressStyleSection from "@/components/shop-page/filters/DressStyleSection";
import PriceSection from "@/components/shop-page/filters/PriceSection";
import SizeSection from "@/components/shop-page/filters/SizeSection";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";

interface FiltersProps {
  updateSearchParams: (params: {
    [key: string]: string | number | undefined;
  }) => void;
}

const Filters: React.FC<FiltersProps> = ({ updateSearchParams }) => {

  return (
    <>
      <hr className="border-t-black/10" />
      <CategoriesSection updateSearchParams={updateSearchParams} />
      <hr className="border-t-black/10" />
      <PriceSection
        updateSearchParams={updateSearchParams}
      />
      <hr className="border-t-black/10" />
      <ColorsSection updateSearchParams={updateSearchParams} />
      <hr className="border-t-black/10" />
      <SizeSection updateSearchParams={updateSearchParams} />
      <hr className="border-t-black/10" />
      {/* <DressStyleSection updateSearchParams={updateSearchParams} />
      <Button
        type="button"
        className="bg-black w-full rounded-full text-sm font-medium py-4 h-12"
      >
        Apply Filter
      </Button> */}
    </>
  );
};

export default Filters;
