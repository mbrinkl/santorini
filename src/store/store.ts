import { Action, action, thunk, Thunk } from "easy-peasy";
import { StoreInjections } from ".";
import {
  RoomMetadata,
  JoinRoomParams,
  UpdatePlayerParams,
  ActiveRoomPlayer,
} from "../services/lobby-service";

export interface StoreModel {
  nickname: string | null;
  setNickname: Action<StoreModel, string>;
  matchID: string | null;
  setMatchID: Action<StoreModel, string>;
  createGameRoom: Thunk<StoreModel, number, StoreInjections>;
  roomMetadata: RoomMetadata | null;
  setRoomMetadata: Action<StoreModel, RoomMetadata>;
  loadRoomMetadata: Thunk<StoreModel, string, StoreInjections>;
  activeRoomPlayer: ActiveRoomPlayer | null;
  setActiveRoomPlayer: Action<StoreModel, ActiveRoomPlayer>;
  joinRoom: Thunk<StoreModel, JoinRoomParams, StoreInjections>;
  updatePlayer: Thunk<StoreModel, UpdatePlayerParams, StoreInjections>;
  reset: Action;
}

// nickname is used between games to simplify room user creation
export const NICKNAME_STORAGE_KEY = "santorini_nickname";

// 'player' refers to users player in the game room
export const PLAYER_STORAGE_KEY = "santorini_player";

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
  }),

  updatePlayer: thunk(async (actions, payload, { injections }) => {
    await injections.lobbyApi.updatePlayer(payload);
  }),

  reset: action(() => initState),
};
