"use client";

import CartCounter from "@/components/ui/CartCounter";
import React, { useState } from "react";
import AddToCartBtn from "./AddToCartBtn";
import { Product } from "@/types/product.types";

const AddToCardSection = ({ data, disabled }: { data: Product, disabled?: boolean }) => {
  const [quantity, setQuantity] = useState<number>(1);

  return (
    <div className="fixed md:relative w-full bg-white border-t md:border-none border-black/5 bottom-0 left-0 p-4 md:p-0 z-10 flex items-center justify-between sm:justify-start md:justify-center">
      <CartCounter
        value={quantity}
        onRemove={() => setQuantity(0)}
        onAdd={() => setQuantity((q) => q + 1)}
      />
      <AddToCartBtn disabled={!!disabled} data={{ ...data, quantity }} />
    </div>
  );
};

export default AddToCardSection;
