import { baseApi } from "./base.api";

interface GetCategoriesParams {
  page?: number;
  per_page?: number;
  search?: string;
  parent?: string;
  _fields?: string[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  parent: string | number;
  description: string;
  display: string;
  image?: {
    id: string;
    date_created: string;
    date_modified: string;
    src: string;
    name: string;
    alt: string;
  };
  menu_order: number;
  count: number;
  _links?: {
    self: Array<{ href: string }>;
    collection: Array<{ href: string }>;
  };
}

export const categoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query<Category[], GetCategoriesParams>({
      query: ({ page = 1, per_page = 10, search, parent, _fields }) => ({
        url: "products/categories",
        params: {
          page,
          per_page,
          search,
          parent,
          ...(_fields && { _fields: _fields.join(",") }),
        },
      }),
      providesTags: ["Categories"],
    }),

    getCategoryById: builder.query<Category, string>({
      query: (categoryId) => `products/categories/${categoryId}`,
      providesTags: (result, error, id) => [{ type: "Categories", id }],
    }),

    createCategory: builder.mutation<
      Category,
      {
        name: string;
        slug?: string;
        description?: string;
        parent?: string;
        image?: File;
      }
    >({
      query: (categoryData) => {
        const formData = new FormData();
        formData.append("name", categoryData.name);
        if (categoryData.slug) formData.append("slug", categoryData.slug);
        if (categoryData.description)
          formData.append("description", categoryData.description);
        if (categoryData.parent) formData.append("parent", categoryData.parent);
        if (categoryData.image) formData.append("image", categoryData.image);

        return {
          url: "products/categories",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["Categories"],
    }),

    updateCategory: builder.mutation<
      Category,
      {
        id: string;
        data: {
          name?: string;
          slug?: string;
          description?: string;
          parent?: string;
          image?: File;
        };
      }
    >({
      query: ({ id, data }) => {
        const formData = new FormData();
        if (data.name) formData.append("name", data.name);
        if (data.slug) formData.append("slug", data.slug);
        if (data.description !== undefined)
          formData.append("description", data.description);
        if (data.parent !== undefined) formData.append("parent", data.parent);
        if (data.image) formData.append("image", data.image);

        return {
          url: `products/categories/${id}`,
          method: "PUT",
          body: formData,
        };
      },
      invalidatesTags: (result, error, { id }) => [
        { type: "Categories", id },
        "Categories",
      ],
    }),

    deleteCategory: builder.mutation<
      { deleted: boolean; previous: Category },
      string
    >({
      query: (id) => ({
        url: `products/categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Categories", id },
        "Categories",
      ],
    }),

    bulkUpdateCategories: builder.mutation<
      { status: string; message: string; affected_count: number },
      { ids: string[]; action: "delete" }
    >({
      query: ({ ids, action }) => ({
        url: "products/categories/bulk",
        method: "POST",
        body: { ids, action },
      }),
      invalidatesTags: ["Categories"],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetCategoryByIdQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useBulkUpdateCategoriesMutation,
} = categoryApi;
