// src/api/products.api.ts
import { PaginatedResponse } from "@/types/pagination";
import { baseApi, addAuthParams } from "./base.api";

export interface Product {
  id: number;
  name: string;
  price: string;
}

export const productsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<
      PaginatedResponse<Product>,
      { page?: number; perPage?: number }
    >({
      query: ({ page = 1, perPage = 10 }) => ({
        url: "products",
        params: {
          ...addAuthParams(),
          page,
          per_page: perPage,
          _fields: "id,name,price",
        },
      }),
      transformResponse: (
        response: Product[],
        meta
      ): PaginatedResponse<Product> => {
        const total = meta?.response?.headers.get("X-WP-Total");
        const totalPages = meta?.response?.headers.get("X-WP-TotalPages");
        return {
          data: response,
          total: total ? parseInt(total, 10) : 0,
          totalPages: totalPages ? parseInt(totalPages, 10) : 0,
        };
      },
    }),
    getProductById: builder.query<Product, number>({
      query: (id) => ({
        url: `products/${id}`,
        params: addAuthParams(),
      }),
    }),
    createProduct: builder.mutation<Product, Partial<Product>>({
      query: (body) => ({
        url: "products",
        method: "POST",
        body,
        params: addAuthParams(),
      }),
    }),
    updateProduct: builder.mutation<
      Product,
      { id: number; data: Partial<Product> }
    >({
      query: ({ id, data }) => ({
        url: `products/${id}`,
        method: "PUT",
        body: data,
        params: addAuthParams(),
      }),
    }),
    deleteProduct: builder.mutation<
      { deleted: boolean; previous: Product },
      number
    >({
      query: (id) => ({
        url: `products/${id}`,
        method: "DELETE",
        params: { force: true, ...addAuthParams() },
      }),
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
} = productsApi;
