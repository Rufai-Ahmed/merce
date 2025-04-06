import React from "react";
import ProductDetails from "./ProductDetails";
import { Product } from "@/types/product.types";

interface ProductDetailsContentProps {
  product: Product;
}

const ProductDetailsContent = ({ product }: ProductDetailsContentProps) => {
  return (
    <section>
      <h3 className="text-xl sm:text-2xl font-bold text-black mb-5 sm:mb-6">
        Product specifications
      </h3>
      <ProductDetails attributes={product.attributes} />{" "}
      {product.description && (
        <div className="mt-6">
          <h4 className="text-lg font-semibold text-black mb-2">Description</h4>
          <div
            className="text-sm text-neutral-800"
            dangerouslySetInnerHTML={{ __html: product.description }}
          />
        </div>
      )}
    </section>
  );
};

export default ProductDetailsContent;
