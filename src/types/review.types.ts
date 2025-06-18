export type Review = {
  _id: string;
  product: string;
  reviewer: string;
  reviewer_email: string;
  review: string;
  rating: number;
  status: "approved" | "pending" | "spam" | "trash";
  reviewer_avatar_urls?: {
    [key: string]: string;
  };
  verified: boolean;
  meta_data?: Array<{
    key: string;
    value: any;
  }>;

  createdAt: Date;
  updatedAt: Date;
};
