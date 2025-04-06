export type Discount = {
  amount: number;
  percentage: number;
};

export type Product = {
  id: number;
  title: string;
  srcUrl: string;
  gallery?: string[];
  price: number;
  discount: Discount;
  rating: number;
  description?: string;
  short_description?: string;
  relatedIds?: number[];
  images?: { src: string; alt: string }[];
  attributes: {
    id: number;
    name: string;
    slug: string;
    options: string[];
    variation: boolean;
  }[];
  variations: {
    id: number;
    price: number;
    attributes: { [key: string]: string };
  }[];
};
