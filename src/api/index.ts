import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { LobbyAPI } from 'boardgame.io';
import { GAME_ID } from '../config';
import { SERVER_URL } from '../config/client';
import {
  CreateMatchParams,
  JoinMatchParams,
  LeaveMatchParams,
  PlayAgainParams,
  UpdatePlayerParams,
} from '../types/apiTypes';

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: `${SERVER_URL}/games/${GAME_ID}` }),
  endpoints: (builder) => ({
    getMatch: builder.query<LobbyAPI.Match, string>({
      query: (matchID) => `/${matchID}`,
    }),
    getMatches: builder.query<LobbyAPI.Match[], void>({
      query: () => '/',
      transformResponse: (response: LobbyAPI.MatchList) => response.matches,
    }),
    createMatch: builder.mutation<string, CreateMatchParams>({
      query: (body) => ({
        url: '/create',
        method: 'POST',
        body,
      }),
      transformResponse: (response: LobbyAPI.CreatedMatch) => response.matchID,
    }),
    joinMatch: builder.query<LobbyAPI.JoinedMatch, JoinMatchParams>({
      query: ({ matchID, ...body }) => ({
        url: `${matchID}/join`,
        method: 'POST',
        body,
      }),
    }),
    leaveMatch: builder.mutation<void, LeaveMatchParams>({
      query: ({ matchID, ...body }) => ({
        url: `/${matchID}/leave`,
        method: 'POST',
        body,
      }),
    }),
    updatePlayer: builder.mutation<void, UpdatePlayerParams>({
      query: ({ matchID, ...body }) => ({
        url: `/${matchID}/update`,
        method: 'POST',
        body,
      }),
    }),
    playAgain: builder.mutation<string, PlayAgainParams>({
      query: ({ matchID, ...body }) => ({
        url: `/${matchID}/playAgain`,
        method: 'POST',
        body,
      }),
      transformResponse: (response: LobbyAPI.NextMatch) => response.nextMatchID,
    }),
  }),
});

export const {
  useGetMatchQuery,
  useGetMatchesQuery,
  useCreateMatchMutation,
  useJoinMatchQuery,
  useLeaveMatchMutation,
  useUpdatePlayerMutation,
  usePlayAgainMutation,
} = api;
