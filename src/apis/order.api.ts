// src/api/orders.api.ts
import { baseApi, addAuthParams } from './base.api';

export interface Order {
  id: number;
  status: string;
  total: string;
  // ... include additional order properties as needed
}

export const ordersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOrders: builder.query<Order[], void>({
      query: () => ({
        url: 'orders',
        params: addAuthParams(),
      }),
    }),
    getOrderById: builder.query<Order, number>({
      query: (id) => ({
        url: `orders/${id}`,
        params: addAuthParams(),
      }),
    }),
    createOrder: builder.mutation<Order, Partial<Order>>({
      query: (body) => ({
        url: 'orders',
        method: 'POST',
        body,
        params: addAuthParams(),
      }),
    }),
    updateOrder: builder.mutation<Order, { id: number; data: Partial<Order> }>({
      query: ({ id, data }) => ({
        url: `orders/${id}`,
        method: 'PUT',
        body: data,
        params: addAuthParams(),
      }),
    }),
    deleteOrder: builder.mutation<{ deleted: boolean; previous: Order }, number>({
      query: (id) => ({
        url: `orders/${id}`,
        method: 'DELETE',
        params: { force: true, ...addAuthParams() },
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetOrdersQuery,
  useGetOrderByIdQuery,
  useCreateOrderMutation,
  useUpdateOrderMutation,
  useDeleteOrderMutation,
} = ordersApi;
