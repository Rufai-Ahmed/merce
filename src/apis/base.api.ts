import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const WC_BASE_URL = process.env.NEXT_PUBLIC_WC_BASE_URL; 
const consumerKey = process.env.NEXT_PUBLIC_WC_CONSUMER_KEY;
const consumerSecret = process.env.NEXT_PUBLIC_WC_CONSUMER_SECRET;

export const addAuthParams = (params: Record<string, any> = {}) => ({
  ...params,
  consumer_key: consumerKey,
  consumer_secret: consumerSecret,
});

export const baseApi = createApi({
  reducerPath: 'baseApi',
  baseQuery: fetchBaseQuery({
    baseUrl: WC_BASE_URL,
  }),
  endpoints: () => ({}),
});

export const {  } = baseApi;
