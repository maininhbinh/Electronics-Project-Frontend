import { createApi } from '@reduxjs/toolkit/query/react'
import { baseApiConfig } from '../../../../api/baseApiConfig';

const emptySplitApi = createApi({
    reducerPath: 'categoriesApi',
    ...baseApiConfig
  });
const apiWithTag = emptySplitApi.enhanceEndpoints({addTagTypes: ['Categories']});


export const categoriesApi = apiWithTag.injectEndpoints({
  
  endpoints: (builder) => ({
    getCategories: builder.query({
      query: () => 'category',
      providesTags: (result) =>
      result
        ? [
            ...result.data.map(({ id } : {id : number | string}) => ({ type: 'Categories' as const, id })),
            { type: 'Categories', id: 'LIST' },
          ]
        : [{ type: 'Categories', id: 'LIST' }],
    }),
    getCategory: builder.query({
      query: (id) => `category/${id}`,
      providesTags: (id) => [{ type: 'Categories', id }],
    }),
    getDetailCategory: builder.query({
      query: (id) => `category/show/${id}`,
    }),
    createCategory: builder.mutation({
      query: (newCategory) => ({
        
        url: 'category',
        method: 'POST',
        body: newCategory,
        formData: true,
      }),
      invalidatesTags: [{ type: 'Categories', id: 'LIST' }],
    }),
    createAttribute: builder.mutation({
      query: (newAttribute) => ({
        url: 'attribute',
        method: 'POST',
        body: newAttribute,
      }),
     // invalidatesTags: [{ type: 'Categories', id: 'LIST' }],
    }),
    createDetail: builder.mutation({
      query: (newDetail) => ({
        url: 'detail',
        method: 'POST',
        body: newDetail,
      }),
     // invalidatesTags: [{ type: 'Categories', id: 'LIST' }],
    }),
    updateCategory: builder.mutation({
      query: (updatedCategory) => ({
        url: `category/${updatedCategory.id}`,
        method: 'POST',
        body: updatedCategory.payload,
        formData: true,
      }),
     invalidatesTags: (id) => [{ type: 'Categories', id },  { type: 'Categories', id: 'LIST' }],
    }),
    updateDetail: builder.mutation({
      query: (updatedCategory) => ({
        url: `detail/${updatedCategory.id}`,
        method: 'POST',
        body: updatedCategory,
      }),
    //  invalidatesTags: (id) => [{ type: 'Categories', id },  { type: 'Categories', id: 'LIST' }],
    }),
    updateAttribute: builder.mutation({
      query: (updatedAtribute) => ({
        url: `attribute/${updatedAtribute.id}`,
        method: 'POST',
        body: updatedAtribute,
      }),
     // invalidatesTags: (id) => [{ type: 'Categories', id },  { type: 'Categories', id: 'LIST' }],
    }),
    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `category/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Categories', id: 'LIST' }],
    }),
    deleteDetail: builder.mutation({
      query: (id) => ({
        url: `detail/${id}`,
        method: 'DELETE',
      }),
      //invalidatesTags: [{ type: 'Categories', id: 'LIST' }],
    }),
    deleteAttribute: builder.mutation({
      query: (id) => ({
        url: `attribute/${id}`,
        method: 'DELETE',
      }),
     
    }),
  }),
});

export const {
  useGetDetailCategoryQuery,
  useGetCategoriesQuery,
  useGetCategoryQuery,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useCreateCategoryMutation,
  useUpdateDetailMutation,
  useUpdateAttributeMutation,
  useDeleteAttributeMutation,
  useCreateAttributeMutation,
  useCreateDetailMutation,
  useDeleteDetailMutation,
  useLazyGetCategoryQuery
  
} = categoriesApi;