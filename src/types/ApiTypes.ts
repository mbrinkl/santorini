export interface Player {
  id: number;
  name?: string;
}

export interface ActiveRoomPlayer {
  playerID: number;
  credential: string;
}

export interface CreateRoomParams {
  numPlayers: number,
  unlisted: boolean
}

export interface JoinRoomParams {
  matchID: string;
  playerID: number;
  playerName: string;
}

export interface LeaveRoomParams {
  matchID: string;
  playerID: number;
  credential: string;
}

export interface UpdatePlayerParams {
  matchID: string;
  playerID: number;
  credentials: string;
  newName: string;
}

export interface PlayAgainParams {
  matchID: string;
  playerID: number;
  credential: string;
}
