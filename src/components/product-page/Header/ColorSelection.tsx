// src/components/product-page/ColorSelection.tsx
"use client";

import { setColorSelection } from "@/lib/features/products/productsSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux";
import { cn } from "@/lib/utils";
import { IoMdCheckmark } from "react-icons/io";

const colorMap: { [key: string]: string } = {
  Black: "bg-black",
  Brown: "bg-[#4F4631]",
  Grey: "bg-gray-500",
  White: "bg-white border border-gray-300",
};

const ColorSelection = ({ colors }: { colors: string[] }) => {
  const { colorSelection } = useAppSelector(
    (state) => state.products
  );
  const dispatch = useAppDispatch();

  return (
    <div className="flex flex-col">
      <span className="text-sm sm:text-base text-black/60 mb-4">
        Select Colors
      </span>
      <div className="flex items-center flex-wrap space-x-3 sm:space-x-4">
        {colors.map((color, index) => (
          <button
            key={index}
            type="button"
            className={cn([
              colorMap[color] || "bg-gray-400",
              "rounded-full w-9 sm:w-10 h-9 sm:h-10 flex items-center justify-center",
            ])}
            onClick={() =>
              dispatch(
                setColorSelection({
                  name: color,
                  code: colorMap[color] || "bg-gray-400",
                })
              )
            }
          >
            {colorSelection?.name === color && (
              <IoMdCheckmark className="text-base text-white" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ColorSelection;
