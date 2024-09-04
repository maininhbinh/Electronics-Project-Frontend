import { createApi } from '@reduxjs/toolkit/query/react'
import { baseApiConfig } from '../../../../api/baseApiConfig';

const emptySplitApi = createApi({
    reducerPath: 'usersApi',
    ...baseApiConfig
  });
const apiWithTag = emptySplitApi.enhanceEndpoints({addTagTypes: ['Users']});
export const usersApi = apiWithTag.injectEndpoints({
  
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => 'user/list',
      providesTags: (result) =>
      result
        ? [
            ...result?.data?.map(({ id } : {id : number | string}) => ({ type: 'Users' as const, id })),
            { type: 'Users', id: 'LIST' },
          ]
        : [{ type: 'Users', id: 'LIST' }],
    }),
    getUser: builder.query({
      query: (id) => `user/${id}`,
      providesTags: (id) => [{ type: 'Users', id }],
    }),
    getProfileUser: builder.query({
      query: () => `user/profile`,
      providesTags: (id) => [{ type: 'Users', id }],
    }),
    createUser: builder.mutation({
      query: (newUser) => ({
        url: 'user',
        method: 'POST',
        body: newUser,
        formData: true,
      }),
      invalidatesTags: [{ type: 'Users', id: 'LIST' }],
    }),
    updateUser: builder.mutation({
      query: (payload) => ({
        url: `user/${payload.id}`,
        method: 'POST',
        body: payload.data,
        formData: true,
      }),
      invalidatesTags: (id) => [{ type: 'Users', id },  { type: 'Users', id: 'LIST' }],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `user/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Users', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useGetProfileUserQuery
} = usersApi;