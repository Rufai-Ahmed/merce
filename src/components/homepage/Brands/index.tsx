import { useGetBrandsQuery } from "@/apis/brand.api";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";

const Brands = () => {
  const { data: brands, isLoading } = useGetBrandsQuery({});

  if (isLoading) {
    return (
      <div className="bg-black">
        <div className="max-w-frame mx-auto flex flex-wrap items-center justify-center md:justify-between py-5 md:py-0 sm:px-4 xl:px-0 space-x-7">
          {[...Array(5)].map((_, index) => (
            <Skeleton
              key={index}
              className="w-[116px] h-[26px] lg:w-48 lg:h-9 my-5 md:my-11"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    brands && (
      <div className="bg-black">
        <div className="max-w-frame mx-auto flex flex-wrap items-center justify-center md:justify-between py-5 md:py-0 sm:px-4 xl:px-0 space-x-7">
          {brands.map((brand) => (
            <Image
              key={brand.id}
              priority
              src={brand.srcUrl}
              height={0}
              width={0}
              alt={brand.id}
              className="h-auto w-auto max-w-[116px] lg:max-w-48 max-h-[26px] lg:max-h-9 my-5 md:my-11"
            />
          ))}
        </div>
      </div>
    )
  );
};

export default Brands;
