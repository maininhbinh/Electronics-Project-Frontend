import { baseApiConfig } from "@/api/baseApiConfig";
import { createApi } from '@reduxjs/toolkit/query/react'

const emptySplitApi = createApi({
  reducerPath: 'detailsApi',
  ...baseApiConfig
});

const apiWithTag = emptySplitApi.enhanceEndpoints({ addTagTypes: ['Details'] });
export const detailsApi = apiWithTag.injectEndpoints({

  endpoints: (builder) => ({
    getDetails: builder.query({

      query: () => ({
        url: 'detail',
      }),
      providesTags: (result) =>
        result
          ? [
            ...result.map(({ id }: { id: number | string }) => ({ type: 'Details' as const, id })),
            { type: 'Details', id: 'LIST' }
          ]
          : [{ type: 'Details', id: 'LIST' }]
    }),
    getDetail: builder.query({
      query: (id) => `detail/${id}`,
      providesTags: (id) => [{ type: 'Details', id }]
    }),
    createDetail: builder.mutation({
      query: (newDetail) => ({
        url: 'detail',
        method: 'POST',
        body: newDetail
      }),
      invalidatesTags: [{ type: 'Details', id: 'LIST' }]
    }),

    updateDetail: builder.mutation({
      query: (updatedDetail) => ({
        url: `detail/${updatedDetail.id}`,
        method: 'POST',
        body: updatedDetail,
      }),
      invalidatesTags: (id) => [
        { type: 'Details', id },
        { type: 'Details', id: 'LIST' }
      ],
    }),

    deleteDetail: builder.mutation({
      query: (id) => ({
        url: `detail/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: [{ type: 'Details', id: 'LIST' }]
    })
  })
})

export const {
  useGetDetailsQuery,
  useGetDetailQuery,
  useCreateDetailMutation,
  useDeleteDetailMutation,
  useUpdateDetailMutation
} =
  detailsApi