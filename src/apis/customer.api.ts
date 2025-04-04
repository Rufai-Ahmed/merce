// src/api/customers.api.ts
import { baseApi, addAuthParams } from './base.api';

export interface Customer {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  // ... add any additional customer fields as required
}

export const customersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCustomers: builder.query<Customer[], void>({
      query: () => ({
        url: 'customers',
        params: addAuthParams(),
      }),
    }),
    getCustomerById: builder.query<Customer, number>({
      query: (id) => ({
        url: `customers/${id}`,
        params: addAuthParams(),
      }),
    }),
    createCustomer: builder.mutation<Customer, Partial<Customer>>({
      query: (body) => ({
        url: 'customers',
        method: 'POST',
        body,
        params: addAuthParams(),
      }),
    }),
    updateCustomer: builder.mutation<Customer, { id: number; data: Partial<Customer> }>({
      query: ({ id, data }) => ({
        url: `customers/${id}`,
        method: 'PUT',
        body: data,
        params: addAuthParams(),
      }),
    }),
    deleteCustomer: builder.mutation<{ deleted: boolean; previous: Customer }, number>({
      query: (id) => ({
        url: `customers/${id}`,
        method: 'DELETE',
        params: { force: true, ...addAuthParams() },
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetCustomersQuery,
  useGetCustomerByIdQuery,
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
} = customersApi;
