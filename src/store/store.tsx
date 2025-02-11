import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { queryAPI } from './queryAPI';

export const store = configureStore({
  reducer: {
    [queryAPI.reducerPath]: queryAPI.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(queryAPI.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
