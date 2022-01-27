import { LobbyClient } from 'boardgame.io/client';
import { LobbyAPI } from 'boardgame.io';
import { SERVER_URL } from '../config/client';
import { GAME_ID } from '../config';
import {
  JoinRoomParams,
  UpdatePlayerParams,
  PlayAgainParams,
  CreateRoomParams,
  LeaveRoomParams,
} from '../types/ApiTypes';

export class LobbyService {
  lobbyClient: LobbyClient;

  constructor() {
    this.lobbyClient = new LobbyClient({ server: SERVER_URL });
  }

  async getMatch(matchID: string): Promise<LobbyAPI.Match> {
    return this.lobbyClient.getMatch(GAME_ID, matchID);
  }

  async getMatches(): Promise<LobbyAPI.Match[]> {
    const { matches } = await this.lobbyClient.listMatches(GAME_ID);
    return matches;
  }

  async createRoom({
    numPlayers,
    unlisted,
  } : CreateRoomParams): Promise<string> {
    const { matchID } = await this.lobbyClient.createMatch(GAME_ID, {
      numPlayers,
      unlisted,
    });
    return matchID;
  }

  async joinRoom({
    matchID,
    playerID,
    playerName,
  }: JoinRoomParams): Promise<{ playerCredentials: string }> {
    const { playerCredentials } = await this.lobbyClient.joinMatch(
      GAME_ID,
      matchID,
      {
        playerID: String(playerID),
        playerName,
      },
    );

    return { playerCredentials };
  }

  async leaveRoom({
    matchID, playerID, credential,
  }: LeaveRoomParams): Promise<void> {
    await this.lobbyClient.leaveMatch(
      GAME_ID,
      matchID,
      {
        playerID: String(playerID),
        credentials: credential,
      },
    );
  }

  async updatePlayer({
    matchID, playerID, credentials, newName,
  }: UpdatePlayerParams): Promise<void> {
    await this.lobbyClient.updatePlayer(GAME_ID, matchID, {
      playerID: String(playerID),
      credentials,
      newName,
    });
  }

  async playAgain({
    matchID, playerID, credential,
  }: PlayAgainParams): Promise<{ nextMatchID: string }> {
    const { nextMatchID } = await this.lobbyClient.playAgain(GAME_ID, matchID, {
      playerID: String(playerID),
      credentials: credential,
    });

    return { nextMatchID };
  }
}
