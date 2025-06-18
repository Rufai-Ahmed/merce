import { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductPageClient from "./product-client-page";
import { Product } from "@/types/product.types";

type Slug = {
  slug: string[];
};
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";

export async function generateMetadata({
  params,
}: {
  params: Promise<Slug>;
}): Promise<Metadata> {
  const { slug } = await params;
  const productId = slug[0];

  const response = await fetch(
    `${baseUrl}/api/woocommerce/wc/v3/products/${productId}`
  );
  const product = await response.json();
  if (!product || response.status !== 200) {
    return {
      title: "Product Not Found | BigVybz",
      description: "This product could not be found.",
    };
  }

  return {
    title: `${product.name} - Product | BigVybz`,
    description: product.description || "Buy this amazing product at BigVybz.",
    openGraph: {
      title: product.name,
      description:
        product.description || "Buy this amazing product at BigVybz.",
      images: [product.srcUrl],
      url: `https://bigvybz.com/product/${productId}`,
    },
    alternates: {
      canonical: `https://bigvybz.com/product/${productId}`,
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<Slug>;
}) {
  const { slug } = await params;

  const productId = slug[0];

  const response = await fetch(
    `${baseUrl}/api/woocommerce/wc/v3/products/${productId}`
  );
  const product = await response.json();
  if (!product || response.status !== 200) {
    notFound();
  }

  return (
    <>
      <StructuredData product={product} />
      <ProductPageClient productId={productId} />
    </>
  );
}

const StructuredData = ({ product }: { product: Product }) => (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{
      __html: JSON.stringify({
        "@context": "https://schema.org/",
        "@type": "Product",
        name: product.name,
        image: product.images?.[0]?.src,
        description: product.description || "No description available",
        offers: {
          "@type": "Offer",
          priceCurrency: "NGN",
          price: product.price,
          availability: "https://schema.org/InStock",
        },
      }),
    }}
  />
);
