"use client";

import { addToCart, CartItem } from "@/lib/features/carts/cartsSlice";
import { emptySelection } from "@/lib/features/products/productsSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux";
import { Product } from "@/types/product.types";
import { toast } from "sonner";

const AddToCartBtn = ({
  data,
  disabled,
}: {
  data: Product & { quantity: number };
  disabled?: boolean;
}) => {
  const dispatch = useAppDispatch();
  const { sizeSelection, colorSelection } = useAppSelector(
    (state) => state.products
  );

  const handleAddToCart = () => {
    const matchingVariation = data.variations?.find((variation) => {
      const sizeAttr = variation.attributes["size"] || "";
      const colorAttr = variation.attributes["color"] || "";
      return (
        sizeAttr.toLowerCase() === sizeSelection?.toLowerCase() &&
        colorAttr.toLowerCase() === colorSelection?.name.toLowerCase()
      );
    });

    const cartItem: CartItem = {
      ...data,
      quantity: data.quantity,
    };

    dispatch(addToCart(cartItem));
    dispatch(emptySelection());
    toast.success("Item added to cart!");
  };

  return (
    <button
      type="button"
      className="bg-black w-full ml-3 sm:ml-5 rounded-full h-11 md:h-[52px] text-sm sm:text-base text-white hover:bg-black/80 transition-all"
      onClick={handleAddToCart}
      disabled={disabled}
    >
      Add to Cart
    </button>
  );
};

export default AddToCartBtn;
