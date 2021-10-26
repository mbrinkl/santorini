import { SERVER_URL } from "../config/client";
import { GAME_ID } from "../config";
import { LobbyClient } from 'boardgame.io/client';

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
  lobbyClient: LobbyClient;

  constructor() {
    this.lobbyClient = new LobbyClient({server: SERVER_URL});
  }

  async getMatches() {
    await this.lobbyClient.listMatches(GAME_ID);
  }

  async createRoom(numPlayers: number): Promise<string> {
    const { matchID } = await this.lobbyClient.createMatch(GAME_ID, {numPlayers: numPlayers});
    return matchID;
  }

  async joinRoom({
    matchID,
    ...json
  }: JoinRoomParams): Promise<{ playerCredentials: string }> {
    const { playerCredentials } = await this.lobbyClient.joinMatch(
      GAME_ID,
      matchID,
      {
        playerID: String(json.playerID),
        playerName: json.playerName,
      }
    );

    return { playerCredentials };
  }

  async updatePlayer({
    matchID,
    ...json
  }: UpdatePlayerParams) : Promise<void> {

    await this.lobbyClient.updatePlayer(GAME_ID, matchID, {
      playerID: String(json.playerID),
      credentials: json.credentials,
      newName: json.newName,
    });
  }

  async getRoomMetadata(matchID: string): Promise<RoomMetadata> {
    return await this.lobbyClient.getMatch(GAME_ID, matchID);
  }
}
