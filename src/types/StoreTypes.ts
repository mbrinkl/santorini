import { Action, Thunk } from 'easy-peasy';

interface ActiveRoomPlayer {
  matchID: string;
  playerID: number;
  credential: string;
}

export interface JoinRoomParams {
  matchID: string;
  playerID: string;
  playerName: string;
}

export interface LeaveRoomParams {
  matchID: string;
  playerID: string;
  credentials: string,
}

export interface StoreModel {
  nickname: string | null;
  setNickname: Action<StoreModel, string>;
  activeRoomPlayer: ActiveRoomPlayer | null;
  setActiveRoomPlayer: Action<StoreModel, ActiveRoomPlayer | null>;
  joinRoom: Thunk<StoreModel, JoinRoomParams>;
  leaveRoom: Thunk<StoreModel, LeaveRoomParams>;
  reset: Action<StoreModel, string>;
}
