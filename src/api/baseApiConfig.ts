import { fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query'

export const baseApiConfig = {
  baseQuery: async (args: string | FetchArgs, api: any, extraOptions: any) => {
    const baseQuery = fetchBaseQuery({
      baseUrl: 'http://127.0.0.1:8000/api',
      prepareHeaders: (headers, { getState }) => {
        headers.set('authorization', `Bearer ${localStorage.getItem('access_token')}`)
        return headers
      }
    })

    const result = await baseQuery(args, api, extraOptions)
    if (result.error) {
      const { status } = result.error as FetchBaseQueryError
      if (status === 401 || status === 403) {
        window.location.href = '/'
      }
    }

    return result
  },
  endpoints: () => ({})
}
