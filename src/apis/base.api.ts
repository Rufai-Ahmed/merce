import { RootState } from "@/lib/store";
import { createApi, fetchBaseQuery, retry } from "@reduxjs/toolkit/query/react";
import { logout } from "@/lib/features/auth/auth.slice";

export const BASE_URL = "http://localhost:5000/api/woocommerce/wc/v3";

export const staggeredBaseQuery = retry(
  async (args, api, extraOptions) => {
    const result = await fetchBaseQuery({
      baseUrl: BASE_URL,
      prepareHeaders: (headers, { getState }) => {
        const token = (getState() as RootState).auth.token;
        if (token) {
          headers.set("Authorization", `Bearer ${token}`);
        }
        return headers;
      },
    })(args, api, extraOptions);

    if (result.error?.status === 401) {
      const retryResult = await fetchBaseQuery({
        baseUrl: BASE_URL,
        prepareHeaders: (headers) => {
          headers.set(
            "Authorization",
            `Bearer ${(api.getState() as RootState).auth.token || ""}`
          );
          console.debug("trying again...", headers);
          return headers;
        },
      })(args, api, extraOptions);

      if (retryResult.error?.status === 401) {
        api.dispatch(logout());
        localStorage.clear();
      }
      return retryResult;
    }
    return result;
  },
  {
    maxRetries: 0,
  }
);

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: staggeredBaseQuery,
  endpoints: () => ({}),
  tagTypes: [
    "Products",
    "Attributes",
    "AttributeTerms",
    "Categories",
    "Reviews",
    "Orders",
    "ShippingMethods",
    "Admin",
  ],
});

export const {} = baseApi;
