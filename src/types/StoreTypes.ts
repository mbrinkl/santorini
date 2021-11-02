import { Action, Thunk } from "easy-peasy";
import { 
  JoinRoomParams, 
  UpdatePlayerParams, 
  RoomMetadata,
  PlayAgainParams,
  ActiveRoomPlayer
} from "../types/ApiTypes";
import { LobbyService } from "../api/lobbyService";

export interface StoreInjections {
  lobbyApi: LobbyService;
}

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
  playAgain: Thunk<StoreModel, PlayAgainParams, StoreInjections>;
  reset: Action<StoreModel, string>;
}