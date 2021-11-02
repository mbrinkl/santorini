export interface Player {
  id: number;
  name?: string;
}

export interface RoomMetadata {
  players: Player[];
}

export interface ActiveRoomPlayer {
  playerID: number;
  credential: string;
}

export interface JoinRoomParams {
  matchID: string;
  playerID: number;
  playerName: string;
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