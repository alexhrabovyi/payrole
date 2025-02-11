import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { CollectedPaidAndPending } from '@/server/utils';

export const queryAPI = createApi({
  reducerPath: 'globalData',
  baseQuery: fetchBaseQuery({ baseUrl: '/fakeAPI' }),
  endpoints: (builder) => ({
    getCollectedPaidAndPending: builder.query<CollectedPaidAndPending, void>({
      query: () => 'getCollectedPaidAndPending',
    }),
  }),
});

export const { useGetCollectedPaidAndPendingQuery } = queryAPI;
