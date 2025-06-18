import { PaginatedResponse } from "@/types/pagination";
import { baseApi } from "./base.api";
import { Product } from "@/types/product.types";

export const productsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<
      PaginatedResponse<Product>,
      { fields?: string[]; [key: string]: any }
    >({
      query: ({ fields, ...params }) => ({
        url: "products",
        params: {
          ...params,
          _fields: (
            fields || [
              "id",
              "name",
              "price",
              "regular_price",
              "sale_price",
              "images",
              "average_rating",
              "related_ids",
              "stock_quantity",
              "status",
              "type",
            ]
          ).join(","),
        },
      }),

      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ _id }) => ({
                type: "Products" as const,
                id: _id,
              })),
              { type: "Products", id: "LIST" },
            ]
          : [{ type: "Products", id: "LIST" }],
    }),

    getProductById: builder.query<Product, string>({
      query: (id) => ({
        url: `products/${id}`,
        params: {
          _fields: [
            "id",
            "name",
            "description",
            "short_description",
            "price",
            "regular_price",
            "sale_price",
            "images",
            "category",
            "brand",
            "stock_quantity",
            "manage_stock",
            "in_stock",
            "type",
            "status",
            "featured",
            "virtual",
            "downloadable",
            "average_rating",
            "rating_count",
            "attributes",
            "variations",
            "variation_options",
            "related_ids",
            "cross_sell_ids",
            "upsell_ids",
            "date_created",
            "date_modified",
          ].join(","),
        },
      }),
      providesTags: (result) =>
        result ? [{ type: "Products", id: result._id }] : [],
    }),

    createProduct: builder.mutation<Product, Partial<Product> | FormData>({
      query: (body) => ({
        url: "products",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Products", id: "LIST" }],
    }),

    updateProduct: builder.mutation<
      Product,
      { id: string; data: FormData | Partial<Product> }
    >({
      query: ({ id, data }) => ({
        url: `products/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Products", id: id.toString() },
        { type: "Products", id: "LIST" },
      ],
    }),

    deleteProduct: builder.mutation<
      { deleted: boolean; previous: Product },
      string
    >({
      query: (id) => ({
        url: `products/${id}`,
        method: "DELETE",
        params: { force: true },
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Products", id: id.toString() },
      ],
    }),

    getAttributes: builder.query<any[], void>({
      query: () => ({
        url: "products/attributes",
      }),
      transformResponse: (response: any[]) =>
        response.map((attr: any) => ({
          id: attr.id,
          name: attr.name,
          slug: attr.slug,
        })),
      providesTags: [{ type: "Attributes", id: "LIST" }],
    }),

    getAttributeTerms: builder.query<any[], number>({
      query: (attributeId) => ({
        url: `products/attributes/${attributeId}/terms`,
        params: { per_page: 100 },
      }),
      transformResponse: (response: any[]) =>
        response.map((term: any) => ({
          id: term.id,
          name: term.name,
          slug: term.slug,
        })),
      providesTags: (result, error, attributeId) => [
        { type: "AttributeTerms", id: attributeId },
      ],
    }),

    getProductReviews: builder.query<
      PaginatedResponse<any>,
      { productId: string; per_page?: number; page?: number }
    >({
      query: ({ productId, per_page = 10, page = 1 }) => ({
        url: `products/reviews`,
        params: {
          product: productId,
          per_page,
          page,
        },
      }),

      providesTags: (result, _error, { productId }) =>
        result
          ? [
              ...result.data.map(({ id }) => ({
                type: "Reviews" as const,
                id,
              })),
              { type: "Reviews", id: `PRODUCT_${productId}` },
            ]
          : [{ type: "Reviews", id: `PRODUCT_${productId}` }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetAttributeTermsQuery,
  useGetAttributesQuery,
  useGetProductReviewsQuery,
} = productsApi;
