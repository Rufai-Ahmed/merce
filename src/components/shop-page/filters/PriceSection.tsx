import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Slider } from "@/components/ui/slider";
import { useSearchParams } from "next/navigation";

interface PriceSectionProps {
  updateSearchParams: (params: {
    [key: string]: string | number | undefined;
  }) => void;
}

const PriceSection: React.FC<PriceSectionProps> = ({ updateSearchParams }) => {
  const searchParams = useSearchParams();
  const initPrice: [number, number] = [
    Number(searchParams.get("minPrice")) || 0,
    Number(searchParams.get("maxPrice")) || 250,
  ];

  return (
    <Accordion type="single" collapsible defaultValue="filter-price">
      <AccordionItem value="filter-price" className="border-none">
        <AccordionTrigger className="text-black font-bold text-xl hover:no-underline p-0 py-0.5">
          Price
        </AccordionTrigger>
        <AccordionContent className="pt-4" contentClassName="overflow-visible">
          <Slider
            // defaultValue={[50, 200]}
            value={initPrice}
            onValueChange={(value) =>
              updateSearchParams({
                minPrice: value[0],
                maxPrice: value[1],
                page: 1,
              })
            }
            min={0}
            max={250}
            step={1}
            label="₦"
          />
          <div className="mb-3" />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default PriceSection;
