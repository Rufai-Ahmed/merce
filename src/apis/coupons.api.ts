// src/api/coupons.api.ts
import { baseApi } from "./base.api";

export interface Coupon {
  id: number;
  code: string;
  discount_type: string;
  amount: string;
}

export const couponsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCoupons: builder.query<Coupon[], void>({
      query: () => ({
        url: "coupons",
      }),
    }),
    getCouponById: builder.query<Coupon, number>({
      query: (id) => ({
        url: `coupons/${id}`,
      }),
    }),
    createCoupon: builder.mutation<Coupon, Partial<Coupon>>({
      query: (body) => ({
        url: "coupons",
        method: "POST",
        body,
      }),
    }),
    updateCoupon: builder.mutation<
      Coupon,
      { id: number; data: Partial<Coupon> }
    >({
      query: ({ id, data }) => ({
        url: `coupons/${id}`,
        method: "PUT",
        body: data,
      }),
    }),
    deleteCoupon: builder.mutation<
      { deleted: boolean; previous: Coupon },
      number
    >({
      query: (id) => ({
        url: `coupons/${id}`,
        method: "DELETE",
        params: { force: true },
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetCouponsQuery,
  useGetCouponByIdQuery,
  useCreateCouponMutation,
  useUpdateCouponMutation,
  useDeleteCouponMutation,
} = couponsApi;
