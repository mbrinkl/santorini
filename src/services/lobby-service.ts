import ky from "ky";
import { SERVER_URL } from "../config/client";
import { GAME_ID } from "../config";

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

export class LobbyService {
  api: typeof ky;

  constructor() {
    this.api = ky.create({ prefixUrl: `${SERVER_URL}/games/${GAME_ID}` });
  }

  async createRoom(numPlayers: number): Promise<string> {
    const data = await this.api
      .post("create", { json: { numPlayers } })
      .json<{ matchID: string }>();

    return data.matchID;
  }

  async joinRoom({
    matchID,
    ...json
  }: JoinRoomParams): Promise<{ playerCredentials: string }> {
    const { playerCredentials } = await this.api
      .post(matchID + "/join", {
        json: json
      })
      .json<{ playerCredentials: string }>();

    return {
      playerCredentials
    };
  }

  async updatePlayer({
    matchID,
    ...json
  }: UpdatePlayerParams) : Promise<void> {
    await this.api
    .post(matchID + "/update", {
      json: json
    });
  }

  async getRoomMetadata(matchID: string): Promise<RoomMetadata> {
    return await this.api.get(matchID).json<{ players: Player[] }>();
  }
}
