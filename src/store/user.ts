import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NICKNAME_STORAGE_KEY, PLAYER_STORAGE_KEY } from '../config/client';
import { api } from '../api';
import { RoomData } from '../types/userTypes';

interface State {
  nickname: string | null;
  roomData: RoomData | null;
}

const localRoomData = localStorage.getItem(PLAYER_STORAGE_KEY);

const initialState: State = {
  nickname: localStorage.getItem(NICKNAME_STORAGE_KEY),
  roomData: localRoomData && JSON.parse(localRoomData),
};

const userSlice = createSlice({
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
    setRoomData: (state, action: PayloadAction<RoomData | null>) => {
      const roomData = action.payload;
      state.roomData = action.payload;
      if (roomData != null) {
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(roomData));
      } else {
        localStorage.removeItem(PLAYER_STORAGE_KEY);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(api.endpoints.joinMatch.matchFulfilled, (state, action) => {
        const roomData: RoomData = {
          matchID: action.meta.arg.originalArgs.matchID,
          playerID: action.payload.playerID,
          credentials: action.payload.playerCredentials,
        };
        state.roomData = roomData;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(roomData));
      })
      .addMatcher(api.endpoints.leaveMatch.matchFulfilled, (state) => {
        state.roomData = null;
        localStorage.removeItem(PLAYER_STORAGE_KEY);
      });
  },
});

export default userSlice;
