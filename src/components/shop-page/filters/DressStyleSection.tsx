import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";
import { MdKeyboardArrowRight } from "react-icons/md";
import { useSearchParams } from "next/navigation";

interface DressStyleSectionProps {
  updateSearchParams: (params: {
    [key: string]: string | number | undefined;
  }) => void;
}

const dressStylesData = [
  { title: "Casual", slug: "casual" },
  { title: "Formal", slug: "formal" },
  { title: "Party", slug: "party" },
  { title: "Gym", slug: "gym" },
];

const DressStyleSection: React.FC<DressStyleSectionProps> = ({
  updateSearchParams,
}) => {
  const searchParams = useSearchParams();
  const selectedStyle = searchParams.get("style") || "";
  return (
    <Accordion type="single" collapsible defaultValue="filter-style">
      <AccordionItem value="filter-style" className="border-none">
        <AccordionTrigger className="text-black font-bold text-xl hover:no-underline p-0 py-0.5">
          Dress Style
        </AccordionTrigger>
        <AccordionContent className="pt-4 pb-0">
          <div className="flex flex-col text-black/60 space-y-0.5">
            {dressStylesData.map((dStyle) => (
              <button
                key={dStyle.slug}
                onClick={() =>
                  updateSearchParams({ style: dStyle.slug, page: 1 })
                }
                className={`flex items-center justify-between py-2 ${
                  selectedStyle === dStyle.slug ? "text-black font-medium" : ""
                }`}
              >
                {dStyle.title} <MdKeyboardArrowRight />
              </button>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default DressStyleSection;
