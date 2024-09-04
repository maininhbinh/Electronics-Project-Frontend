import { createApi } from '@reduxjs/toolkit/query/react'
import { baseApiConfig } from '@/api/baseApiConfig';

const emptySplitApi = createApi({
    reducerPath: 'GalleryApi',
    ...baseApiConfig
  });
const apiWithTag = emptySplitApi.enhanceEndpoints({addTagTypes: ['GalleryApi']});
export const galleryApi = apiWithTag.injectEndpoints({
  
  endpoints: (builder) => ({
    getGallery: builder.query({
        query: (id) => `gallery/${id}`
    })
  }),
});

export const {
    useGetGalleryQuery
} = galleryApi;