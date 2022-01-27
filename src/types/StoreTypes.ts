import { Action, Thunk } from 'easy-peasy';
import {
  JoinRoomParams,
  ActiveRoomPlayer,
  LeaveRoomParams,
} from './ApiTypes';
import { LobbyService } from '../api/lobbyService';

export interface StoreInjections {
  lobbyApi: LobbyService;
}

export interface StoreModel {
  nickname: string | null;
  setNickname: Action<StoreModel, string>;
  activeRoomPlayer: ActiveRoomPlayer | null;
  setActiveRoomPlayer: Action<StoreModel, ActiveRoomPlayer | null>;
  joinRoom: Thunk<StoreModel, JoinRoomParams, StoreInjections>;
  leaveRoom: Thunk<StoreModel, LeaveRoomParams, StoreInjections>;
  reset: Action<StoreModel, string>;
}
