import { baseApi } from "./base.api";

export interface DashboardAnalytics {
  overview: {
    totalProducts: number;
    totalOrders: number;
    totalCustomers: number;
    totalReviews: number;
    totalCoupons: number;
    totalCategories: number;
    totalBrands: number;
  };
  sales: {
    thisMonth: {
      revenue: number;
      orders: number;
    };
    lastMonth: {
      revenue: number;
      orders: number;
    };
    growth: {
      revenue: number;
      orders: number;
    };
  };
  recentOrders: Array<{
    id: string;
    customer: {
      first_name: string;
      last_name: string;
      email: string;
    };
    total: string;
    status: string;
    date: string;
  }>;
  topProducts: Array<{
    id: string;
    name: string;
    price: number;
    totalSold: number;
    revenue: number;
    image: string;
  }>;
  salesChart: Array<{
    date: string;
    sales: number;
    orders: number;
  }>;
  orderStatusDistribution: Array<{
    _id: string;
    count: number;
  }>;
}

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: "super-admin" | 'admin' | 'customer';
  avatar_url: string;
  date_created: string;
  last_login: string;
  is_active: boolean;
  is_email_verified: boolean;
  orders_count: number;
  total_spent: string;
}

export interface SalesReport {
  period: string;
  date_range: {
    from: string;
    to: string;
  };
  totals: {
    total_sales: number;
    net_sales: number;
    total_orders: number;
    total_items: number;
    average_order_value: number;
  };
  data: Array<{
    date: string;
    total_sales: number;
    net_sales: number;
    orders: number;
    items_sold: number;
  }>;
}

export interface ProductReport {
  top_selling: Array<{
    product_id: string;
    name: string;
    quantity_sold: number;
    revenue: number;
    stock_quantity: number;
    price: number;
  }>;
  low_stock: Array<{
    name: string;
    stock_quantity: number;
    price: number;
  }>;
  by_category: Array<{
    category_name: string;
    product_count: number;
    total_value: number;
  }>;
}

export interface SystemInfo {
  server: {
    node_version: string;
    environment: string;
    uptime: number;
    memory_usage: {
      rss: number;
      heapTotal: number;
      heapUsed: number;
      external: number;
    };
  };
  database: {
    collections: Array<{
      name: string;
      count: number;
      avgObjSize: number;
      storageSize: number;
    }>;
  };
  services: {
    cloudinary: {
      cloud_name: string;
      status: string;
    };
    flutterwave: {
      public_key: string;
      status: string;
    };
    resend: {
      status: string;
    };
  };
}

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardAnalytics: builder.query<DashboardAnalytics, void>({
      query: () => ({
        url: "admin/dashboard",
      }),
      providesTags: ["Admin"],
    }),

    getAllUsers: builder.query<
      { data: User[]; total: number; totalPages: number },
      { role?: string; search?: string; page?: number; per_page?: number }
    >({
      query: ({ role, search, page = 1, per_page = 10 }) => ({
        url: "admin/users",
        params: {
          role,
          search,
          page,
          per_page,
        },
      }),
      transformResponse: (response: User[], meta) => ({
        data: response,
        total: parseInt(meta?.response?.headers.get("X-WP-Total") || "0", 10),
        totalPages: parseInt(
          meta?.response?.headers.get("X-WP-TotalPages") || "0",
          10
        ),
      }),
      providesTags: ["Admin"],
    }),

    updateUserRole: builder.mutation<
      {
        id: string;
        email: string;
        first_name: string;
        last_name: string;
        role: string;
        message: string;
      },
      { id: string; role: string }
    >({
      query: ({ id, role }) => ({
        url: `admin/users/${id}/role`,
        method: "PUT",
        body: { role },
      }),
      invalidatesTags: ["Admin"],
    }),

    bulkUpdateUsers: builder.mutation<
      { status: string; message: string; affected_count: number },
      { ids: string[]; action: "activate" | "deactivate" | "delete" }
    >({
      query: ({ ids, action }) => ({
        url: "admin/users/bulk",
        method: "POST",
        body: { ids, action },
      }),
      invalidatesTags: ["Admin"],
    }),

    getSalesReport: builder.query<
      SalesReport,
      {
        period?: "week" | "month" | "year";
        date_from?: string;
        date_to?: string;
      }
    >({
      query: ({ period, date_from, date_to }) => ({
        url: "admin/reports/sales",
        params: {
          period,
          date_from,
          date_to,
        },
      }),
      providesTags: ["Admin"],
    }),

    getProductReport: builder.query<ProductReport, void>({
      query: () => ({
        url: "admin/reports/products",
      }),
      providesTags: ["Admin"],
    }),

    sendCustomEmail: builder.mutation<
      {
        status: string;
        message: string;
        results: Array<{ email: string; status: string; error?: string }>;
        summary: { total: number; sent: number; failed: number };
      },
      {
        recipients: string[];
        subject: string;
        content: string;
        is_html?: boolean;
      }
    >({
      query: (body) => ({
        url: "admin/email/send",
        method: "POST",
        body,
      }),
    }),

    getSystemInfo: builder.query<SystemInfo, void>({
      query: () => ({
        url: "admin/system/info",
      }),
      providesTags: ["Admin"],
    }),

    exportOrders: builder.query<
      {
        export_date: string;
        total_orders: number;
        date_range: { from: string; to: string };
        data: any[];
      },
      { format?: "json" | "csv"; date_from?: string; date_to?: string }
    >({
      query: ({ format, date_from, date_to }) => ({
        url: "admin/export/orders",
        params: {
          format,
          date_from,
          date_to,
        },
      }),
    }),

    performCleanup: builder.mutation<
      {
        status: string;
        message: string;
        results: Array<{
          action: string;
          status: string;
          affected_count?: number;
          error?: string;
        }>;
      },
      {
        actions: Array<
          | "delete_spam_reviews"
          | "delete_expired_coupons"
          | "delete_failed_orders"
          | "optimize_images"
        >;
      }
    >({
      query: (body) => ({
        url: "admin/cleanup",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Admin"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetDashboardAnalyticsQuery,
  useGetAllUsersQuery,
  useUpdateUserRoleMutation,
  useBulkUpdateUsersMutation,
  useGetSalesReportQuery,
  useGetProductReportQuery,
  useSendCustomEmailMutation,
  useGetSystemInfoQuery,
  useExportOrdersQuery,
  usePerformCleanupMutation,
} = adminApi;
