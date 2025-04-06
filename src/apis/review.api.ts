import { Review } from "@/types/review.types";
import { baseApi } from "./base.api";

export const productsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getReviews: builder.query<
      Review[],
      { perPage?: number; fields?: string[] }
    >({
      query: ({ perPage = 10, fields }) => ({
        url: "products/reviews",
        method: "GET",
        params: {
          per_page: perPage,
          ...(fields && { _fields: fields.join(",") }),
        },
      }),
      transformResponse: (response: any[]): Review[] => {
        return response.map((item) => ({
          id: item.id,
          user: item.reviewer,
          content: item.review,
          rating: item.rating,
          date: item.date_created,
        }));
      },
    }),
  }),
  overrideExisting: false,
});

export const { useGetReviewsQuery } = productsApi;
