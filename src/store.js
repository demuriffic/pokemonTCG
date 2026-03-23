import { configureStore } from '@reduxjs/toolkit';
import { pokemonTcgApi } from './services/pokemonTcgApi';

export const store = configureStore({
  reducer: {
    [pokemonTcgApi.reducerPath]: pokemonTcgApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(pokemonTcgApi.middleware),
});