import { baseApi } from "./base.api";

interface GetOrdersParams {
  page?: number;
  search?: string;
  status?: string;
  customer?: string;
}

export interface OrderItem {
  id: string;
  product_id: string;
  variation_id?: string;
  quantity: number;
  price: number;
  total: string;
  name: string;
  sku: string;
}

export interface Order {
  id: string;
  parent_id: number;
  status: string;
  currency: string;
  version: string;
  prices_include_tax: boolean;
  date_created: string;
  date_modified: string;
  discount_total: string;
  discount_tax: string;
  shipping_total: string;
  shipping_tax: string;
  cart_tax: string;
  total: string;
  total_tax: string;
  customer_id: string;
  order_key: string;
  billing: {
    first_name: string;
    last_name: string;
    company: string;
    address_1: string;
    address_2: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
    email: string;
    phone: string;
  };
  shipping: {
    first_name: string;
    last_name: string;
    company: string;
    address_1: string;
    address_2: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
  };
  payment_method: string;
  payment_method_title: string;
  transaction_id?: string;
  customer_ip_address: string;
  customer_user_agent: string;
  created_via: string;
  customer_note?: string;
  date_completed?: string;
  date_paid?: string;
  cart_hash: string;
  number: string;
  meta_data: any[];
  line_items: OrderItem[];
  tax_lines: any[];
  shipping_lines: any[];
  fee_lines: any[];
  coupon_lines: any[];
  refunds: any[];
  payment_url: string;
  is_editable: boolean;
  needs_payment: boolean;
  needs_processing: boolean;
  date_created_gmt: string;
  date_modified_gmt: string;
  date_completed_gmt?: string;
  date_paid_gmt?: string;
  currency_symbol: string;
}

export const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOrders: builder.query<Order[], GetOrdersParams>({
      query: ({ page = 1, search = "", status = "", customer }) => ({
        url: "orders",
        params: {
          page,
          search,
          status,
          customer,
          per_page: 10,
        },
      }),
      providesTags: ["Orders"],
    }),

    getOrderById: builder.query<Order, string>({
      query: (id) => `orders/${id}`,
      providesTags: (result, error, id) => [{ type: "Orders", id }],
    }),

    createOrder: builder.mutation<
      Order,
      {
        line_items: {
          product_id: string;
          quantity: number;
          variation_id?: string;
        }[];
        billing: {
          first_name: string;
          last_name: string;
          email: string;
          phone: string;
          address_1: string;
          city: string;
          state: string;
          country: string;
          company?: string;
          address_2?: string;
          postcode?: string;
        };
        shipping?: {
          first_name: string;
          last_name: string;
          address_1: string;
          city: string;
          state: string;
          country: string;
          company?: string;
          address_2?: string;
          postcode?: string;
        };
        shipping_lines?: {
          method_id: string;
          method_title: string;
          total: string;
        }[];
        coupon_lines?: any[];
        payment_method?: string;
        payment_method_title?: string;
        customer_note?: string;
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
      invalidatesTags: ["Orders"],
    }),

    updateOrder: builder.mutation<
      Order,
      {
        id: string;
        data: {
          status?: string;
          tracking_number?: string;
          customer_note?: string;
        };
      }
    >({
      query: ({ id, data }) => ({
        url: `orders/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Orders", id },
        "Orders",
      ],
    }),

    getShippingMethods: builder.query<any[], void>({
      query: () => "shipping_methods",
      providesTags: ["ShippingMethods"],
    }),

    regeneratePaymentUrl: builder.mutation<
      { status: string; payment_url: string; message: string },
      string
    >({
      query: (orderId) => ({
        url: `orders/${orderId}/regenerate-payment`,
        method: "POST",
      }),
      invalidatesTags: (result, error, orderId) => [
        { type: "Orders", id: orderId },
        "Orders",
      ],
    }),

    verifyOrderPayment: builder.mutation<
      { status: string; data: any },
      { tx_ref?: string; transaction_id?: string }
    >({
      query: (body) => ({
        url: "orders/verify-payment",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Orders"],
    }),
  }),
});

export const {
  useGetOrdersQuery,
  useGetOrderByIdQuery,
  useCreateOrderMutation,
  useUpdateOrderMutation,
  useGetShippingMethodsQuery,
  useRegeneratePaymentUrlMutation,
  useVerifyOrderPaymentMutation,
} = orderApi;
