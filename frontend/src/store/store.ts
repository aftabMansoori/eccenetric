import { configureStore } from '@reduxjs/toolkit';
import { assetApi } from './api/assetApi';
import { authApi } from './api/authApi';
import uploadReducer from './slices/uploadSlice';
import filterReducer from './slices/filterSlice';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    [assetApi.reducerPath]: assetApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    upload: uploadReducer,
    filters: filterReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(assetApi.middleware, authApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
