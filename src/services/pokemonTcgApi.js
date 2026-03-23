import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const pokemonTcgApi = createApi({
  reducerPath: 'pokemonTcgApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: 'https://api.pokemontcg.io/v2/',
    prepareHeaders: (headers) => {
      const apiKey = import.meta.env.VITE_POKEMON_API_KEY;
      if (apiKey) {
        headers.set('X-Api-Key', apiKey);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getCards: builder.query({
      query: ({ page = 1, pageSize = 20, q = '' } = {}) => {
        let queryString = `cards?page=${page}&pageSize=${pageSize}`;
        if (q) queryString += `&q=${q}`;
        return queryString;
      },
    }),
    getCardById: builder.query({
      query: (id) => `cards/${id}`,
    }),
  }),
});

export const { useGetCardsQuery, useGetCardByIdQuery } = pokemonTcgApi;