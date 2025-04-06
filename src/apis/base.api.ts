import { RootState } from "@/lib/store";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const BASE_URL = "/api/woocommerce/wc/v3";

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: () => ({}),
  tagTypes: [
    "Products",
    "Attributes",
    "AttributeTerms",
    "Categories",
    "Reviews",
    "Orders",
    "ShippingMethods",
  ],
});

export const {} = baseApi;
