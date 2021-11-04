import { SERVER_URL } from "../config/client";
import { GAME_ID } from "../config";
import { LobbyClient } from 'boardgame.io/client';
import { 
  JoinRoomParams, 
  UpdatePlayerParams, 
  RoomMetadata,
  PlayAgainParams 
} from "../types/ApiTypes";

export class LobbyService {
  lobbyClient: LobbyClient;

  constructor() {
    this.lobbyClient = new LobbyClient({server: SERVER_URL});
  }

  // TODO: to add public games
  // async getMatches() {
  //   await this.lobbyClient.listMatches(GAME_ID);
  // }

  async createRoom(numPlayers: number): Promise<string> {
    const { matchID } = await this.lobbyClient.createMatch(GAME_ID, {numPlayers: numPlayers});
    return matchID;
  }

  async joinRoom({
    matchID,
    playerID,
    playerName
  }: JoinRoomParams): Promise<{ playerCredentials: string }> {
    const { playerCredentials } = await this.lobbyClient.joinMatch(
      GAME_ID,
      matchID,
      {
        playerID: String(playerID),
        playerName: playerName,
      }
    );

    return { playerCredentials };
  }

  async updatePlayer({matchID, playerID, credentials, newName}: UpdatePlayerParams): Promise<void> {

    await this.lobbyClient.updatePlayer(GAME_ID, matchID, {
      playerID: String(playerID),
      credentials: credentials,
      newName: newName,
    });
  }

  async getRoomMetadata(matchID: string): Promise<RoomMetadata> {
    return await this.lobbyClient.getMatch(GAME_ID, matchID);
  }

  async playAgain({matchID, playerID, credential}: PlayAgainParams): Promise<{nextMatchID: string}> {
    const { nextMatchID } = await this.lobbyClient.playAgain(GAME_ID, matchID, {
      playerID: String(playerID),
      credentials: credential,
    });

    return { nextMatchID };
  }
}
