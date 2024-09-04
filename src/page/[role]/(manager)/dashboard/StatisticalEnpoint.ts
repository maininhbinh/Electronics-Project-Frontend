import { createApi } from '@reduxjs/toolkit/query/react'
import { baseApiConfig } from '../../../../api/baseApiConfig';

const emptySplitApi = createApi({
    reducerPath: 'statisticalApi',
    ...baseApiConfig
  });
const apiWithTag = emptySplitApi.enhanceEndpoints({addTagTypes: ['statisticalApi']});
export const statisticalApi = apiWithTag.injectEndpoints({

  endpoints: (builder) => ({
    getStatisticalToday: builder.query({
        query: () => `statistical/today`,
        providesTags: (id) => [{ type: 'statisticalApi', id }],
    })
  })
});

export const {
    useGetStatisticalTodayQuery
} = statisticalApi;