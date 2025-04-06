import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseApi } from "./base.api";
import { RootState } from "@/lib/store";

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  username?: string;
  first_name?: string;
  last_name?: string;
}

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
}

export interface Order {
  id: number;
  status: string;
  total: string;
  date_created: string;
}

const BASE_URL = "/api/woocommerce";

export const authApi = createApi({
  reducerPath: "authApi",
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
  endpoints: (builder) => ({
    login: builder.mutation<{ token: string }, LoginCredentials>({
      query: (credentials) => ({
        url: "jwt-auth/v1/token",
        method: "POST",
        body: credentials,
      }),
    }),
    register: builder.mutation<User, RegisterData>({
      query: (userData) => ({
        url: "wc/v3/customers",
        method: "POST",
        body: userData,
      }),
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation } = authApi;
