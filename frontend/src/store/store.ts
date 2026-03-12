import { configureStore } from '@reduxjs/toolkit';
import { assetApi } from './api/assetApi';
import uploadReducer from './slices/uploadSlice';
import filterReducer from './slices/filterSlice';

export const store = configureStore({
  reducer: {
    [assetApi.reducerPath]: assetApi.reducer,
    upload: uploadReducer,
    filters: filterReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(assetApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
