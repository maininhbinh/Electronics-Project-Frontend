import { createApi } from '@reduxjs/toolkit/query/react'
import { baseApiConfig } from '@/api/baseApiConfig';

const emptySplitApi = createApi({
    reducerPath: 'DetailApi',
    ...baseApiConfig
  });
const apiWithTag = emptySplitApi.enhanceEndpoints({addTagTypes: ['DetailApi']});
export const detailApi = apiWithTag.injectEndpoints({
  
  endpoints: (builder) => ({
    getDetails: builder.query({
      query: () => `detail`,
      providesTags: (result) =>
        result
          ? [
              ...result?.data.map(({ id } : {id : number | string}) => ({ type: 'DetailApi' as const, id })),
              { type: 'DetailApi', id: 'LIST' },
            ]
          : [{ type: 'DetailApi', id: 'LIST' }],
    })
  }),
});

export const {
    useGetDetailsQuery
} = detailApi;