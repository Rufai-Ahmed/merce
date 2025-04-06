"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { FaMinus, FaPlus } from "react-icons/fa6";
import { cn } from "@/lib/utils";

type CartCounterProps = {
  isZeroDelete?: boolean;
  onAdd: () => void;
  onRemove: () => void;
  className?: string;
  value: number;
};

const CartCounter = ({
  isZeroDelete = false,
  onAdd,
  onRemove,
  className,
  value,
}: CartCounterProps) => {
  const handleRemove = () => {
    if (value <= 0 || (!isZeroDelete && value === 1)) return;
    onRemove();
  };

  const handleAdd = () => {
    onAdd();
  };

  return (
    <div
      className={cn(
        "bg-[#F0F0F0] w-full min-w-[110px] max-w-[110px] sm:max-w-[170px] py-3 md:py-3.5 px-4 sm:px-5 rounded-full flex items-center justify-between",
        className
      )}
    >
      <Button
        variant="ghost"
        size="icon"
        type="button"
        className="h-5 w-5 sm:h-6 sm:w-6 text-xl hover:bg-transparent"
        onClick={handleRemove}
        disabled={value <= 0 || (!isZeroDelete && value === 1)}
      >
        <FaMinus />
      </Button>
      <span className="font-medium text-sm sm:text-base">{value}</span>
      <Button
        variant="ghost"
        size="icon"
        type="button"
        className="h-5 w-5 sm:h-6 sm:w-6 text-xl hover:bg-transparent"
        onClick={handleAdd}
      >
        <FaPlus />
      </Button>
    </div>
  );
};

export default CartCounter;
