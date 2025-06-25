import React from "react";
import Rating from "../ui/Rating";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types/product.types";
import { useSearchParams } from "next/navigation";

type ProductCardProps = {
  data: Product;
};

const ProductCard = ({ data }: ProductCardProps) => {
  const params = useSearchParams();
  const color = params.get("color") || "";
  const image = color
    ? data?.images?.find((i) =>
        i.alt.toLowerCase().includes(color.toLowerCase())
      )?.src || data?.images[0]?.src
    : data?.images[0]?.src;

  const discount = data.sale_price
    ? {
        percentage: Math.round(
          ((data.regular_price - data.sale_price) / data.regular_price) * 100
        ),
        amount: data.regular_price - data.sale_price,
      }
    : { percentage: 0, amount: 0 };

  return (
    <Link
      href={`/shop/product/${data._id}/${data.name
        .split(" ")
        .join("-")
        ?.toLowerCase()}`}
      className="flex flex-col items-start aspect-auto"
    >
      <div className="bg-[#F0EEED] rounded-[13px] lg:rounded-[20px] w-full lg:max-w-[295px] aspect-square mb-2.5 xl:mb-4 overflow-hidden">
        <Image
          src={image}
          width={295}
          height={298}
          className="rounded-md w-full h-full object-cover hover:scale-110 transition-all duration-500"
          alt={data.name}
          priority
          unoptimized
        />
      </div>
      <strong className="text-black xl:text-xl">{data.name}</strong>
      <div className="flex items-end mb-1 xl:mb-2">
        <Rating
          initialValue={data.average_rating}
          allowFraction
          SVGclassName="inline-block"
          emptyClassName="fill-gray-50"
          size={19}
          readonly
        />
        <span className="text-black text-xs xl:text-sm ml-[11px] xl:ml-[13px] pb-0.5 xl:pb-0">
          {data.average_rating.toFixed(1)}
          <span className="text-black/60">/5</span>
        </span>
      </div>
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
    </Link>
  );
};

export default ProductCard;
