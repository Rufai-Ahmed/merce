"use client";

import CartCounter from "@/components/ui/CartCounter";
import {
  addToCart,
  CartItem,
  remove,
  removeCartItem,
} from "@/lib/features/carts/cartsSlice";
import { useAppDispatch } from "@/lib/hooks/redux";
import Image from "next/image";
import Link from "next/link";
import { PiTrashFill } from "react-icons/pi";
import { Button } from "../ui/button";
import { Product } from "@/types/product.types";

type ProductCardProps = {
  data: CartItem;
};

const ProductCard = ({ data }: ProductCardProps) => {
  const dispatch = useAppDispatch();

  const discount = data.sale_price
    ? {
        percentage: Math.round(
          ((data.regular_price - data.sale_price) / data.regular_price) * 100
        ),
        amount: data.regular_price - data.sale_price,
      }
    : { percentage: 0, amount: 0 };

  return (
    <div className="flex items-start space-x-4">
      <Link
        href={`/shop/product/${data._id}/${data.name.split(" ").join("-")}`}
        className="bg-[#F0EEED] rounded-lg w-full min-w-[100px] max-w-[100px] sm:max-w-[124px] aspect-square overflow-hidden"
      >
        <Image
          src={data.images[0].src}
          width={124}
          height={124}
          className="rounded-md w-full h-full object-cover hover:scale-110 transition-all duration-500"
          alt={data.name}
          priority
        />
      </Link>
      <div className="flex w-full self-stretch flex-col">
        <div className="flex items-center justify-between">
          <Link
            href={`/shop/product/${data._id}/${data.name.split(" ").join("-")}`}
            className="text-black font-bold text-base xl:text-xl"
          >
            {data.name}
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="h-5 w-5 md:h-9 md:w-9"
            onClick={() =>
              dispatch(
                remove({
                  _id: data._id,
                  attributes: data.attributes.map((attr) => attr.options[0]),
                })
              )
            }
          >
            <PiTrashFill className="text-xl md:text-2xl text-red-600" />
          </Button>
        </div>
        <div className="-mt-1">
          <span className="text-black text-xs md:text-sm mr-1">Size:</span>
          <span className="text-black/60 text-xs md:text-sm">
            {data.attributes.find((attr) => attr.name === "Size")?.options[0] ||
              "N/A"}
          </span>
        </div>
        <div className="mb-auto -mt-1.5">
          <span className="text-black text-xs md:text-sm mr-1">Color:</span>
          <span className="text-black/60 text-xs md:text-sm">
            {data.attributes.find((attr) => attr.name === "Color")
              ?.options[0] || "N/A"}
          </span>
        </div>
        <div className="flex items-center flex-wrap justify-between">
          <div className="flex items-center space-x-[5px] xl:space-x-2.5">
            {discount.percentage > 0 ? (
              <span className="font-bold text-black text-xl xl:text-2xl">
                {`₦${Math.round(data.sale_price || 0)}`}
              </span>
            ) : discount.amount > 0 ? (
              <span className="font-bold text-black text-xl xl:text-2xl">
                {`₦${data.sale_price}`}
              </span>
            ) : (
              <span className="font-bold text-black text-xl xl:text-2xl">
                ₦{data.regular_price}
              </span>
            )}
            {(discount.percentage || discount.amount) > 0 && (
              <span className="font-bold text-black/40 line-through text-xl xl:text-2xl">
                ₦{data.regular_price}
              </span>
            )}
            {discount.percentage > 0 ? (
              <span className="font-medium text-[10px] xl:text-xs py-1.5 px-3.5 rounded-full bg-[#FF3333]/10 text-[#FF3333]">
                {`-${discount.percentage}%`}
              </span>
            ) : (
              discount.amount > 0 && (
                <span className="font-medium text-[10px] xl:text-xs py-1.5 px-3.5 rounded-full bg-[#FF3333]/10 text-[#FF3333]">
                  {`-₦${discount.amount}`}
                </span>
              )
            )}
          </div>
          <CartCounter
            value={data.quantity}
            onAdd={() =>
              dispatch(
                addToCart({
                  ...data,
                  quantity: 1,
                })
              )
            }
            onRemove={() =>
              dispatch(
                removeCartItem({
                  _id: data._id,
                  attributes: data.attributes.map((attr) => attr.options[0]),
                })
              )
            }
            isZeroDelete
            className="px-5 py-3 max-h-8 md:max-h-10 min-w-[105px] max-w-[105px] sm:max-w-32"
          />
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
