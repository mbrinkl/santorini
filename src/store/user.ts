import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NICKNAME_STORAGE_KEY, PLAYER_STORAGE_KEY } from '../config/client';
import { api } from '../api';
import { ActiveRoomPlayer } from '../types/storeTypes';

interface State {
  nickname: string | null;
  activeRoomPlayer: ActiveRoomPlayer | null;
}

const localRoomData = localStorage.getItem(PLAYER_STORAGE_KEY);

const initialState: State = {
  nickname: localStorage.getItem(NICKNAME_STORAGE_KEY),
  activeRoomPlayer: localRoomData && JSON.parse(localRoomData),
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setNickname: (state, action: PayloadAction<string | null>) => {
      const nickname = action.payload;
      state.nickname = action.payload;
      if (nickname != null) {
        localStorage.setItem(NICKNAME_STORAGE_KEY, nickname);
      } else {
        localStorage.removeItem(NICKNAME_STORAGE_KEY);
      }
    },
    setActiveRoomPlayer: (
      state,
      action: PayloadAction<ActiveRoomPlayer | null>,
    ) => {
      const activeRoomPlayer = action.payload;
      state.activeRoomPlayer = action.payload;
      if (activeRoomPlayer != null) {
        localStorage.setItem(
          PLAYER_STORAGE_KEY,
          JSON.stringify(activeRoomPlayer),
        );
      } else {
        localStorage.removeItem(PLAYER_STORAGE_KEY);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(api.endpoints.joinMatch.matchFulfilled, (state, action) => {
        const activeRoomPlayer: ActiveRoomPlayer = {
          matchID: action.meta.arg.originalArgs.matchID,
          playerID: action.payload.playerID,
          credentials: action.payload.playerCredentials,
        };
        state.activeRoomPlayer = activeRoomPlayer;
        localStorage.setItem(
          PLAYER_STORAGE_KEY,
          JSON.stringify(activeRoomPlayer),
        );
      })
      .addMatcher(api.endpoints.leaveMatch.matchFulfilled, (state) => {
        state.activeRoomPlayer = null;
        localStorage.removeItem(PLAYER_STORAGE_KEY);
      });
  },
});
