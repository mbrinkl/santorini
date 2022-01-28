import { action, thunk } from 'easy-peasy';
import { StoreModel } from '../types/StoreTypes';
import { NICKNAME_STORAGE_KEY, PLAYER_STORAGE_KEY } from '../config/client';

export let initState: any = {};
export const setInitState = (state?: StoreModel) => {
  if (state) initState = state;
};

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
    const { playerCredentials } = await injections.lobbyApi.joinRoom(payload);
    actions.setActiveRoomPlayer({
      matchID: payload.matchID,
      credential: playerCredentials,
      playerID: payload.playerID,
    });
  }),
  leaveRoom: thunk(async (actions, payload, { injections }) => {
    await injections.lobbyApi.leaveRoom(payload);
    actions.setActiveRoomPlayer(null);
  }),

  reset: action((state, payload) => initState),
};
