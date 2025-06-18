import { Review } from "@/types/review.types";
import { baseApi } from "./base.api";
import { PaginatedResponse } from "@/types/pagination";

export type CreateReview = {
  product_id: string;
  reviewer: string;
  reviewer_email: string;
  review: string;
  rating: number;
};
export type UpdateReview = Partial<CreateReview>;

export const productsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getReviews: builder.query<
      PaginatedResponse<Review>,
      { perPage?: number; fields?: string[]; status?: string; product?: string }
    >({
      query: ({ perPage = 10, fields, status, product }) => {
        const params: any = {
          per_page: perPage,
          status,
          ...(fields && { _fields: fields.join(",") }),
        };

        if (product) {
          params.product = product;
        }

        return {
          url: "products/reviews",
          method: "GET",
          params,
        };
      },
      providesTags: ["Reviews"],
    }),
    getReviewById: builder.query<Review, string>({
      query: (id) => ({
        url: `products/reviews/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Reviews", id }],
    }),
    createReview: builder.mutation<Review, CreateReview>({
      query: (body) => ({
        url: "products/reviews",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Reviews"],
    }),
    updateReview: builder.mutation<
      Review,
      { id: string; data: Partial<Review> }
    >({
      query: ({ id, data }) => ({
        url: `products/reviews/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        "Reviews",
        { type: "Reviews", id },
      ],
    }),
    deleteReview: builder.mutation<
      {
        deleted: boolean;
        previous: Review;
      },
      string
    >({
      query: (id) => ({
        url: `products/reviews/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        "Reviews",
        { type: "Reviews", id },
      ],
    }),
    bulkUpdateReviews: builder.mutation<
      { status: string; message: string; affected_count: number },
      { ids: string[]; action: string }
    >({
      query: (body) => ({
        url: "products/reviews/bulk",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Reviews"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetReviewsQuery,
  useGetReviewByIdQuery,
  useCreateReviewMutation,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
  useBulkUpdateReviewsMutation,
} = productsApi;
