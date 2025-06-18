import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseApi } from "./base.api";
import { RootState } from "@/lib/store";
import { User } from "./admin.api";

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

export interface Order {
  id: string;
  status: string;
  total: string;
  date_created: string;
}

const BASE_URL = "http://localhost:5000/api/woocommerce";

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
    login: builder.mutation<{ token: string; user: User }, LoginCredentials>({
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
    forgotPassword: builder.mutation<
      { status: string; message: string },
      { email: string }
    >({
      query: (data) => ({
        url: "jwt-auth/v1/forgot-password",
        method: "POST",
        body: data,
      }),
    }),
    resetPassword: builder.mutation<
      { status: string; message: string },
      { token: string; password: string }
    >({
      query: (data) => ({
        url: "jwt-auth/v1/reset-password",
        method: "POST",
        body: data,
      }),
    }),
    validateToken: builder.query<
      { status: string; message: string; data: { user_id: string } },
      void
    >({
      query: () => ({
        url: "jwt-auth/v1/validate",
        method: "POST",
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useValidateTokenQuery,
} = authApi;
