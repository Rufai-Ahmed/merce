import { baseApi } from "./base.api";

export interface Order {
  id: number;
  status: string;
  total: string;
  date_created: Date | string;
}

export const ordersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation<
      any,
      {
        line_items: {
          product_id: number;
          quantity: number;
          variation_id?: number;
        }[];
        billing: any;
        shipping: any;
        shipping_lines?: {
          method_id: string;
          method_title: string;
          total: string;
        }[];
      }
    >({
      query: (orderData) => ({
        url: "orders",
        method: "POST",
        body: {
          payment_method: "flutterwave",
          payment_method_title: "Flutterwave",
          set_paid: false,
          status: "pending",
          ...orderData,
        },
      }),
      invalidatesTags: [{ type: "Orders", id: "LIST" }],
    }),
    getOrders: builder.query<Order[], number>({
      query: (customerId) => `orders?customer=${customerId}`,
      providesTags: ["Orders"],
    }),

    getOrderById: builder.query<any, number>({
      query: (orderId) => ({
        url: `orders/${orderId}`,
      }),
      providesTags: (result) =>
        result ? [{ type: "Orders", id: result.id }] : [],
    }),

    getShippingMethods: builder.query<any[], void>({
      query: () => ({
        url: "shipping_methods",
      }),
      transformResponse: (response: any[]) =>
        response.map((method) => ({
          id: method.id,
          title: method.title,
          cost: method.settings?.cost?.value || "0",
        })),
      providesTags: [{ type: "ShippingMethods", id: "LIST" }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetShippingMethodsQuery,
  useGetOrderByIdQuery,
  useCreateOrderMutation,
  useGetOrdersQuery,
} = ordersApi;
