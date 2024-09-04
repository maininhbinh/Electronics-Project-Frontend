import { createApi } from '@reduxjs/toolkit/query/react'
import { baseApiConfig } from '../../../../api/baseApiConfig';

const emptySplitApi = createApi({
    reducerPath: 'productsApi',
    ...baseApiConfig
  });
const apiWithTag = emptySplitApi.enhanceEndpoints({addTagTypes: ['Products']});


export const productsApi = apiWithTag.injectEndpoints({
  
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: () => 'product',
      providesTags: (result) =>
        result
        ? [
            ...result?.data?.map(({ id } : {id : number | string}) => ({ type: 'Products' as const, id })),
            { type: 'Products', id: 'LIST' },
          ]
        : [{ type: 'Products', id: 'LIST' }],
    }),
    getProductByCategory: builder.query({
      query: (slug) => `product/${slug}/category`,
      providesTags: (result) =>
      result
        ? [
            ...result?.data?.map(({ id } : {id : number | string}) => ({ type: 'Products' as const, id })),
            { type: 'Products', id: 'LIST' },
          ]
        : [{ type: 'Products', id: 'LIST' }],
    }),
    getProduct: builder.query({
      query: (slug) => `product/${slug}`,
      providesTags: (slug) => [{ type: 'Products', slug }],
    }),
    editProduct: builder.query({
      query: (id) => `product/edit/${id}`,
      providesTags: (id) => [{ type: 'Products', id }],
    }),
    filterProduct: builder.query({
      query: (feat) => `product/home/${feat}`,
      providesTags: () => [{ type: 'Products', id: 'FEAT' }],
    }),
    searchProduct: builder.mutation({
      query: (params) => ({
        url: 'product/filter',
        method: 'POST',
        params: params,
        
      }),
      invalidatesTags: [{ type: 'Products', id: 'LIST' }],
    }),
    createProduct: builder.mutation({
      query: (newProduct) => ({
        url: 'product',
        method: 'POST',
        body: newProduct,
        formData: true,
      }),
      invalidatesTags: [{ type: 'Products', id: 'LIST' }],
    }),
    updateProduct: builder.mutation({
      query: (updatedProduct) => ({
        url: `products/${updatedProduct.id}`,
        method: 'PUT',
        body: updatedProduct,
      }),
      invalidatesTags: (id) => [{ type: 'Products', id },  { type: 'Products', id: 'LIST' }],
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `products/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Products', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductQuery,
  useFilterProductQuery,
  useSearchProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useEditProductQuery,
  useCreateProductMutation,
  useGetProductByCategoryQuery
} = productsApi;