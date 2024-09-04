import { createApi } from '@reduxjs/toolkit/query/react'
import { baseApiConfig } from '@/api/baseApiConfig';

const emptySplitApi = createApi({
    reducerPath: 'ordersApi',
    ...baseApiConfig
  });
const apiWithTag = emptySplitApi.enhanceEndpoints({addTagTypes: ['Orders']});
export const ordersApi = apiWithTag.injectEndpoints({
  
  endpoints: (builder) => ({
    getUserOrderDetail: builder.query({
      query: (id) => `order/detail/${id}`,
      providesTags: (id) => [{ type: 'Orders', id }],
    }),
    getUserOrder: builder.query({
      query: () => 'order/user',
      providesTags: (result) =>
      result
        ? [
            ...result?.data.map(({ id } : {id : number | string}) => ({ type: 'Orders' as const, id })),
            { type: 'Orders', id: 'LIST' },
          ]
        : [{ type: 'Orders', id: 'LIST' }],
    }),
    getOrders: builder.query({
      query: () => 'order',
      providesTags: (result) =>
      result
        ? [
            ...result?.data.map(({ id } : {id : number | string}) => ({ type: 'Orders' as const, id })),
            { type: 'Orders', id: 'LIST' },
          ]
        : [{ type: 'Orders', id: 'LIST' }],
    }),
    addOrder: builder.mutation({
      query: (payload) => ({
        url: 'order',
        method: 'POST',
        body: payload,
      
      }),
      invalidatesTags: [{ type: 'Orders', id: 'LIST' }],
    }),
    getOrder: builder.query({
      query: (id) => `order/${id}`,
      providesTags: (id) => [{ type: 'Orders', id }],
    }),
    changeStatusOrder: builder.mutation({
      query: (payload) => ({
        url: `order/update/status/${payload.id}`,
        method: 'PUT',
        body: {status : payload.status},
      }),
      invalidatesTags: (id) => [{ type: 'Orders', id },  { type: 'Orders', id: 'LIST' }],
    }),
    momoPayment: builder.mutation({
      query: (id) => ({
        url: `payment/momo/${id}`,
        method: 'POST',
      }),
      invalidatesTags: [{ type: 'Orders', id: 'LIST' }],
    }),
    stripePayment: builder.mutation({
      query: (payload) => ({
        url: `payment/stripe/${payload.id}`,
        method: 'POST',
        body: payload.data,
      }),
      invalidatesTags: [{ type: 'Orders', id: 'LIST' }],
    }),
    vnPayment: builder.mutation({
      query: (id) => ({
        url: `payment/${id}`,
        method: 'GET',
      }),
      invalidatesTags: [{ type: 'Orders', id: 'LIST' }],
    }),
    getOrderToDay: builder.query({
      query: () => 'order/today',
      providesTags: (result) =>
      result
        ? [
            ...result?.data.map(({ id } : {id : number | string}) => ({ type: 'Orders' as const, id })),
            { type: 'Orders', id: 'LIST' },
          ]
        : [{ type: 'Orders', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetOrderToDayQuery,
  useGetUserOrderDetailQuery,
  useGetUserOrderQuery,
  useAddOrderMutation,
  useGetOrdersQuery,
  usePrefetch,
  useGetOrderQuery,
  useChangeStatusOrderMutation,
  useMomoPaymentMutation,
  useStripePaymentMutation,
  useVnPaymentMutation
} = ordersApi;