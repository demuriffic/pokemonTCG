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
  tagTypes: ['Cards'],
  keepUnusedDataFor: 300, // Keep unused data for 5 minutes
  endpoints: (builder) => ({
    getCards: builder.query({
      query: ({ page = 1, pageSize = 20, q = '' } = {}) => {
        let queryString = `cards?page=${page}&pageSize=${pageSize}`;
        if (q) queryString += `&q=${q}`;
        return queryString;
      },
      // Separate cache for each page/query combination
      serializeQueryArgs: ({ queryArgs }) => {
        return `${queryArgs.page}-${queryArgs.pageSize}-${queryArgs.q || 'all'}`;
      },
      merge: (currentCache, newResults) => {
        return newResults;
      },
      forceRefetch: ({ currentArg, previousArg }) => {
        return currentArg !== previousArg;
      },
      provideTags: ['Cards'],
    }),
    getCardById: builder.query({
      query: (id) => `cards/${id}`,
      provideTags: (result, error, id) => [{ type: 'Cards', id }],
    }),
  }),
});

export const { useGetCardsQuery, useGetCardByIdQuery } = pokemonTcgApi;