export interface JoinMatchParams {
  matchID: string;
  playerName: string;
}

export interface LeaveMatchParams {
  matchID: string;
  playerID: string;
  credentials: string;
}

export interface CreateMatchParams {
  numPlayers: number;
  unlisted: boolean;
}

export interface UpdatePlayerParams {
  matchID: string;
  playerID: string;
  credentials: string;
  newName: string;
}

export interface PlayAgainParams {
  matchID: string;
  playerID: string;
  credentials: string;
}
