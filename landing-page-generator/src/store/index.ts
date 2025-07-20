import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import pagesSlice from './slices/pagesSlice';
import templatesSlice from './slices/templatesSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    pages: pagesSlice,
    templates: templatesSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['auth/loginSuccess', 'pages/addPage', 'pages/updatePage'],
        ignoredPaths: ['auth.user.createdAt', 'pages.pages.createdAt', 'pages.pages.updatedAt'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;