export interface Brand {
  id: string;
  srcUrl: string;
  name: string;
  slug: string;
  description: string;
  image?: {
    id: string;
    src: string;
    alt: string;
  };
  count: number;
  meta_data?: Array<{
    key: string;
    value: any;
  }>;
  createdAt: Date;
  updatedAt: Date;
}
