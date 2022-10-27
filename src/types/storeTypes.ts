export interface ActiveRoomPlayer {
  matchID: string;
  playerID: string;
  credentials: string;
}

export interface JoinRoomParams {
  matchID: string;
  playerName: string;
}

export interface LeaveRoomParams {
  matchID: string;
  playerID: string;
  credentials: string;
}
