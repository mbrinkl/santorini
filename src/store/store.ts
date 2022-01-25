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

  matchID: null,
  setMatchID: action((state, payload) => {
    state.matchID = payload;
  }),
  createGameRoom: thunk(async (actions, payload, { injections }) => {
    const matchID = await injections.lobbyApi.createRoom(payload);
    actions.setMatchID(matchID);
  }),

  roomMetadata: null,
  setRoomMetadata: action((state, payload) => {
    state.roomMetadata = payload;
  }),
  loadRoomMetadata: thunk(async (actions, payload, { injections }) => {
    const metadata = await injections.lobbyApi.getRoomMetadata(payload);
    actions.setRoomMetadata(metadata);
  }),

  activeRoomPlayer: null,
  setActiveRoomPlayer: action((state, payload) => {
    localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(payload));
    state.activeRoomPlayer = payload;
  }),
  joinRoom: thunk(async (actions, payload, { injections }) => {
    const { playerCredentials } = await injections.lobbyApi.joinRoom(payload);
    actions.setActiveRoomPlayer({
      credential: playerCredentials,
      playerID: payload.playerID,
    });
    actions.setMatchID(payload.matchID);
  }),
  leaveRoom: thunk(async (actions, payload, { injections }) => {
    await injections.lobbyApi.leaveRoom(payload);
    actions.setMatchID(null);
    actions.setActiveRoomPlayer(null);
    actions.setRoomMetadata(null);
  }),

  availableMatches: [],
  setAvailableMatches: action((state, payload) => {
    state.availableMatches = payload;
  }),
  listMatches: thunk(async (actions, payload, { injections }) => {
    const matches = await injections.lobbyApi.getMatches();
    actions.setAvailableMatches(matches);
  }),

  updatePlayer: thunk(async (actions, payload, { injections }) => {
    await injections.lobbyApi.updatePlayer(payload);
  }),

  playAgain: thunk(async (actions, payload, { injections }) => {
    const { nextMatchID } = await injections.lobbyApi.playAgain(payload);
    actions.setMatchID(nextMatchID);
  }),

  reset: action((state, payload) => initState),
};
