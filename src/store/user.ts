import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NICKNAME_STORAGE_KEY, PLAYER_STORAGE_KEY } from '../config/client';
import { joinMatch, leaveMatch } from '../api';
import {
  ActiveRoomPlayer,
  JoinRoomParams,
  LeaveRoomParams,
} from '../types/storeTypes';
import { RootState } from '.';

interface State {
  nickname: string | null;
  activeRoomPlayer: ActiveRoomPlayer | null;
  isJoining: boolean;
  currentJoiningRequestID?: string;
}

const localRoomData = localStorage.getItem(PLAYER_STORAGE_KEY);

const initialState: State = {
  nickname: localStorage.getItem(NICKNAME_STORAGE_KEY),
  activeRoomPlayer: localRoomData && JSON.parse(localRoomData),
  isJoining: false,
  currentJoiningRequestID: undefined,
};

export const joinMatchThunk = createAsyncThunk<
  ActiveRoomPlayer | null,
  JoinRoomParams,
  {
    state: RootState;
  }
>('user/joinMatch', async (params, { getState, requestId }) => {
  const {
    user: { isJoining, currentJoiningRequestID },
  } = getState();

  if (isJoining && requestId !== currentJoiningRequestID) {
    return null;
  }

  const [playerID, credentials] = await joinMatch(params);
  return {
    matchID: params.matchID,
    playerID,
    credentials,
  };
});

export const leaveMatchThunk = createAsyncThunk<void, LeaveRoomParams>(
  'user/leaveMatch',
  async (params) => {
    await leaveMatch(params);
  },
);

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
      .addCase(joinMatchThunk.pending, (state, action) => {
        if (!state.isJoining) {
          state.isJoining = true;
          state.currentJoiningRequestID = action.meta.requestId;
        }
      })
      .addCase(joinMatchThunk.fulfilled, (state, action) => {
        state.isJoining = false;
        state.currentJoiningRequestID = undefined;
        state.activeRoomPlayer = action.payload;
        localStorage.setItem(
          PLAYER_STORAGE_KEY,
          JSON.stringify(action.payload),
        );
      })
      .addCase(leaveMatchThunk.fulfilled, (state) => {
        state.activeRoomPlayer = null;
        localStorage.removeItem(PLAYER_STORAGE_KEY);
      });
  },
});
