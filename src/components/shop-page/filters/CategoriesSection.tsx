import { useGetCategoriesQuery } from "@/apis/category.api";
import { Skeleton } from "@/components/ui/skeleton";
import { useSearchParams } from "next/navigation";
import React from "react";
import { MdKeyboardArrowRight } from "react-icons/md";

interface CategoriesSectionProps {
  updateSearchParams: (params: {
    [key: string]: string | number | undefined;
  }) => void;
}

const CategoriesSection: React.FC<CategoriesSectionProps> = ({
  updateSearchParams,
}) => {
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get("category") || "";
  const { data: categories, isLoading } = useGetCategoriesQuery({
    fields: ["name", "slug", "id"],
  });

  if (isLoading && !categories) {
    return (
      <div className="flex flex-col space-y-2">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-8 w-full" />
        ))}
      </div>
    );
  }
  return (
    <div className="flex flex-col space-y-0.5 text-black/60">
      {(categories || []).map((category) => (
        <button
          key={category.id}
          onClick={() => updateSearchParams({ category: category.id, page: 1 })}
          className={`flex items-center justify-between py-2 ${
            selectedCategory === category.id.toString()
              ? "text-black font-medium"
              : ""
          }`}
        >
          {category.name} <MdKeyboardArrowRight />
        </button>
      ))}
    </div>
  );
};

export default CategoriesSection;
