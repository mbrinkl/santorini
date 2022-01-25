import { Action, Thunk } from 'easy-peasy';
import { LobbyAPI } from 'boardgame.io';
import {
  JoinRoomParams,
  UpdatePlayerParams,
  PlayAgainParams,
  ActiveRoomPlayer,
  CreateRoomParams,
  LeaveRoomParams,
} from './ApiTypes';
import { LobbyService } from '../api/lobbyService';

export interface StoreInjections {
  lobbyApi: LobbyService;
}

export interface StoreModel {
  nickname: string | null;
  setNickname: Action<StoreModel, string>;
  matchID: string | null;
  setMatchID: Action<StoreModel, string | null>;
  createGameRoom: Thunk<StoreModel, CreateRoomParams, StoreInjections>;
  roomMetadata: LobbyAPI.Match | null;
  setRoomMetadata: Action<StoreModel, LobbyAPI.Match | null>;
  loadRoomMetadata: Thunk<StoreModel, string, StoreInjections>;
  activeRoomPlayer: ActiveRoomPlayer | null;
  setActiveRoomPlayer: Action<StoreModel, ActiveRoomPlayer | null>;
  joinRoom: Thunk<StoreModel, JoinRoomParams, StoreInjections>;
  leaveRoom: Thunk<StoreModel, LeaveRoomParams, StoreInjections>;
  availableMatches: LobbyAPI.Match[],
  setAvailableMatches: Action<StoreModel, LobbyAPI.Match[]>,
  listMatches: Thunk<StoreModel, null, StoreInjections>,
  updatePlayer: Thunk<StoreModel, UpdatePlayerParams, StoreInjections>;
  playAgain: Thunk<StoreModel, PlayAgainParams, StoreInjections>;
  reset: Action<StoreModel, string>;
}
