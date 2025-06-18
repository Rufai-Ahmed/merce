import { Brand } from "@/types/brand.types";
import { baseApi } from "./base.api";

export const brandsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBrands: builder.query<Brand[], { perPage?: number; fields?: string[] }>({
      query: ({ perPage = 10, fields }) => ({
        url: "products/brands",
        method: "GET",
        params: {
          per_page: perPage,
          ...(fields && { _fields: fields.join(",") }),
        },
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useGetBrandsQuery } = brandsApi;
