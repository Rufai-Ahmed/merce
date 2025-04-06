import { PaginatedResponse } from "@/types/pagination";
import { baseApi } from "./base.api";
import { Product } from "@/types/product.types";

export const productsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<
      PaginatedResponse<Product>,
      { fields?: string[]; [key: string]: any }
    >({
      query: ({ fields, ...params }) => ({
        url: "products",
        params: {
          ...params,
          _fields: (
            fields || [
              "id",
              "name",
              "price",
              "regular_price",
              "sale_price",
              "images",
              "average_rating",
              "related_ids",
            ]
          ).join(","),
        },
      }),
      transformResponse: (
        response: any[],
        meta
      ): PaginatedResponse<Product> => {
        const total = meta?.response?.headers.get("X-WP-Total");
        const totalPages = meta?.response?.headers.get("X-WP-TotalPages");
        const products: Product[] = response.map((item) => {
          const regularPrice = parseFloat(item.regular_price || "0");
          const salePrice = item.sale_price
            ? parseFloat(item.sale_price)
            : null;
          const price =
            salePrice || regularPrice || parseFloat(item.price || "0");
          const discountPercentage =
            salePrice && regularPrice > salePrice
              ? Math.round(((regularPrice - salePrice) / regularPrice) * 100)
              : 0;
          return {
            id: item.id,
            title: item.name,
            srcUrl: item.images?.[0]?.src || "",
            gallery: item.images?.map((img: any) => img.src) || [],
            images: item.images || [],
            price: price,
            discount: {
              amount:
                salePrice && regularPrice > salePrice
                  ? regularPrice - salePrice
                  : 0,
              percentage: discountPercentage,
            },
            rating: parseFloat(item.average_rating || "0"),
            relatedIds: item.related_ids || [],
            attributes: [],
            variations: [],
          } as Product;
        });
        return {
          data: products,
          total: total ? parseInt(total, 10) : 0,
          totalPages: totalPages ? parseInt(totalPages, 10) : 0,
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({
                type: "Products" as const,
                id,
              })),
              { type: "Products", id: "LIST" },
            ]
          : [{ type: "Products", id: "LIST" }],
    }),

    getProductById: builder.query<Product, number>({
      async queryFn(id, _queryApi, _extraOptions, fetchWithBaseQuery) {
        const productFields = [
          "id",
          "name",
          "price",
          "regular_price",
          "sale_price",
          "images",
          "description",
          "short_description",
          "average_rating",
          "related_ids",
          "type",
          "variations",
          "attributes",
        ];

        const productResult = await fetchWithBaseQuery({
          url: `products/${id}`,
          params: {
            _fields: productFields.join(","),
          },
        });
        if (productResult.error) return { error: productResult.error };

        const productData = productResult.data as any;

        // Fetch variations if it's a variable product
        let variations: any[] = [];
        if (
          productData.type === "variable" &&
          productData.variations.length > 0
        ) {
          const variationFields = ["id", "price", "attributes"];
          const variationsResult = await fetchWithBaseQuery({
            url: `products/${id}/variations`,
            params: {
              per_page: 100,
              _fields: variationFields.join(","),
            },
          });
          if (!variationsResult.error)
            variations = variationsResult.data as any[];
        }

        const regularPrice = parseFloat(productData.regular_price || "0");
        const salePrice = productData.sale_price
          ? parseFloat(productData.sale_price)
          : null;
        const price =
          salePrice || regularPrice || parseFloat(productData.price || "0");
        const discountPercentage =
          salePrice && regularPrice > salePrice
            ? Math.round(((regularPrice - salePrice) / regularPrice) * 100)
            : 0;

        const transformedProduct: Product = {
          id: productData.id,
          title: productData.name,
          srcUrl: productData.images?.[0]?.src || "",
          description: productData.description,
          short_description: productData.short_description,
          gallery: productData.images?.map((img: any) => img.src) || [],
          price: price,
          discount: {
            amount:
              salePrice && regularPrice > salePrice
                ? regularPrice - salePrice
                : 0,
            percentage: discountPercentage,
          },
          rating: parseFloat(productData.average_rating || "0"),
          relatedIds: productData.related_ids || [],
          attributes: productData.attributes.map((attr: any) => ({
            id: attr.id,
            name: attr.name,
            slug: attr.slug,
            options: attr.options,
            variation: attr.variation,
          })),
          variations: variations.map((varItem: any) => ({
            id: varItem.id,
            price: parseFloat(varItem.price || "0"),
            attributes: varItem.attributes.reduce(
              (acc: { [key: string]: string }, attr: any) => {
                acc[attr.name] = attr.option;
                return acc;
              },
              {}
            ),
          })),
        };

        return { data: transformedProduct };
      },
      providesTags: (result) =>
        result ? [{ type: "Products", id: result.id }] : [],
    }),

    createProduct: builder.mutation<Product, Partial<Product>>({
      query: (body) => ({
        url: "products",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Products", id: "LIST" }],
    }),
    updateProduct: builder.mutation<
      Product,
      { id: number; data: Partial<Product> }
    >({
      query: ({ id, data }) => ({
        url: `products/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: "Products", id }],
    }),
    deleteProduct: builder.mutation<
      { deleted: boolean; previous: Product },
      number
    >({
      query: (id) => ({
        url: `products/${id}`,
        method: "DELETE",
        params: { force: true },
      }),
      invalidatesTags: (_result, _error, id) => [{ type: "Products", id }],
    }),

    getAttributes: builder.query<any[], void>({
      query: () => ({
        url: "products/attributes",
      }),
      transformResponse: (response: any[]) =>
        response.map((attr: any) => ({
          id: attr.id,
          name: attr.name,
          slug: attr.slug,
        })),
      providesTags: [{ type: "Attributes", id: "LIST" }],
    }),
    getAttributeTerms: builder.query<any[], number>({
      query: (attributeId) => ({
        url: `products/attributes/${attributeId}/terms`,
        params: { per_page: 100 },
      }),
      transformResponse: (response: any[]) =>
        response.map((term: any) => ({
          id: term.id,
          name: term.name,
          slug: term.slug,
        })),
      providesTags: (result, error, attributeId) => [
        { type: "AttributeTerms", id: attributeId },
      ],
    }),
    getProductReviews: builder.query<
      PaginatedResponse<any>,
      { productId: number; per_page?: number; page?: number }
    >({
      query: ({ productId, per_page = 10, page = 1 }) => ({
        url: `products/reviews`,
        params: {
          product: productId,
          per_page,
          page,
        },
      }),
      transformResponse: (response: any[], meta): PaginatedResponse<any> => {
        const total = meta?.response?.headers.get("X-WP-Total");
        const totalPages = meta?.response?.headers.get("X-WP-TotalPages");
        return {
          data: response.map((review) => ({
            id: review.id,
            reviewer: review.reviewer,
            reviewer_email: review.reviewer_email,
            review: review.review,
            rating: review.rating,
            date_created: review.date_created,
          })),
          total: total ? parseInt(total, 10) : 0,
          totalPages: totalPages ? parseInt(totalPages, 10) : 0,
        };
      },
      providesTags: (result, _error, { productId }) =>
        result
          ? [
              ...result.data.map(({ id }) => ({
                type: "Reviews" as const,
                id,
              })),
              { type: "Reviews", id: `PRODUCT_${productId}` },
            ]
          : [{ type: "Reviews", id: `PRODUCT_${productId}` }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetAttributeTermsQuery,
  useGetAttributesQuery,
  useGetProductReviewsQuery,
} = productsApi;
