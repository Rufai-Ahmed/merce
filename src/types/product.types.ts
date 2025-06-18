export type Discount = {
  amount: number;
  percentage: number;
};

export type Variation = {
  _id: string;
  parent: string;
  price: number;
  regular_price: number;
  sale_price?: number;
  stock_quantity: number;
  manage_stock: boolean;
  in_stock: boolean;
  attributes: {
    [key: string]: string;
  };
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type Product = {
  _id: string;
  name: string;
  description: string;
  short_description: string;
  price: number;
  regular_price: number;
  sale_price?: number;
  images: Array<{
    id: string;
    src: string;
    alt: string;
  }>;
  category: string;
  brand?: string;
  stock_quantity: number;
  manage_stock: boolean;
  in_stock: boolean;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  shipping_class?: string;
  attributes: Array<{
    id: string;
    name: string;
    slug: string;
    options: string[];
    variation: boolean;
  }>;
  variations?: Array<Variation>;
  variation_options?: {
    colors?: string[];
    sizes?: string[];
  };
  related_ids: string[];
  cross_sell_ids: string[];
  upsell_ids: string[];
  type: "simple" | "variable" | "grouped" | "external";
  status: "draft" | "pending" | "private" | "publish";
  featured: boolean;
  virtual: boolean;
  downloadable: boolean;
  download_files?: Array<{
    id: string;
    name: string;
    file: string;
  }>;
  average_rating: number;
  rating_count: number;
  meta_data?: Array<{
    key: string;
    value: any;
  }>;
  createdAt: Date;
  updatedAt: Date;
};
