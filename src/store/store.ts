import { action, thunk } from 'easy-peasy';
import { StoreModel } from '../types/StoreTypes';
import { NICKNAME_STORAGE_KEY, PLAYER_STORAGE_KEY } from '../config/client';
import { joinMatch, leaveMatch } from '../api';

export const store: StoreModel = {
  nickname: null,
  setNickname: action((state, nickname) => {
    localStorage.setItem(NICKNAME_STORAGE_KEY, nickname);
    state.nickname = nickname;
  }),

  // Metadata for a player's most recently joined game
  activeRoomPlayer: null,
  setActiveRoomPlayer: action((state, payload) => {
    localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(payload));
    state.activeRoomPlayer = payload;
  }),
  joinRoom: thunk(async (actions, payload, { injections }) => {
    const playerCredentials = await joinMatch(payload);
    actions.setActiveRoomPlayer({
      matchID: payload.matchID,
      credential: playerCredentials,
      playerID: payload.playerID,
    });
  }),
  leaveRoom: thunk(async (actions, payload) => {
    await leaveMatch(payload);
    actions.setActiveRoomPlayer(null);
  }),
};
