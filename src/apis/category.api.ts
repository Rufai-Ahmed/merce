import { baseApi } from "./base.api";

export const categoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query<
      any[],
      { perPage?: number; fields?: string[] }
    >({
      query: ({ perPage = 10, fields }) => ({
        url: "products/categories",
        method: "GET",
        params: {
          //   per_page: perPage,
          ...(fields && { _fields: fields.join(",") }),
        },
        invalidatesTags: ["Categories"],
      }),
    }),
    getCategoryById: builder.query<
      { id: number; name: string; slug: string },
      number
    >({
      query: (categoryId) => ({
        url: `products/categories/${categoryId}`,
        params: { _fields: ["id", "name", "slug"].join(",") },
      }),
      transformResponse: (response: any) => ({
        id: response.id,
        name: response.name,
        slug: response.slug,
      }),
      providesTags: (result) =>
        result ? [{ type: "Categories", id: result.id }] : [],
    }),
  }),
});

export const { useGetCategoriesQuery, useGetCategoryByIdQuery } = categoryApi;
