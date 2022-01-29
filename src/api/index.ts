import { LobbyAPI } from 'boardgame.io';
import axios from 'axios';
import { JoinRoomParams, LeaveRoomParams } from '../types/StoreTypes';
import { SERVER_URL } from '../config/client';
import { GAME_ID } from '../config';

axios.defaults.baseURL = `${SERVER_URL}/games/${GAME_ID}`;

export async function getMatch(matchID: string): Promise<LobbyAPI.Match | undefined> {
  try {
    const response = await axios.get<LobbyAPI.Match>(`/${matchID}`);
    return response.data;
  } catch {
    return undefined;
  }
}

export async function getMatches(): Promise<LobbyAPI.Match[]> {
  const response = await axios.get<{ matches: LobbyAPI.Match[] }>('/');
  return response.data.matches;
}

export async function createMatch(numPlayers: number, unlisted: boolean): Promise<string> {
  const response = await axios.post<{ matchID: string }>('/create', {
    numPlayers,
    unlisted,
  });

  return response.data.matchID;
}

export async function joinMatch({
  matchID,
  playerID,
  playerName,
}: JoinRoomParams): Promise<string> {
  const response = await axios.post<{ playerCredentials: string }>(`/${matchID}/join`, {
    playerID,
    playerName,
  });

  return response.data.playerCredentials;
}

export async function leaveMatch({
  matchID,
  playerID,
  credentials,
}: LeaveRoomParams): Promise<void> {
  try {
    await axios.post<{ playerCredentials: string }>(`/${matchID}/leave`, {
      playerID,
      credentials,
    });
  // eslint-disable-next-line no-empty
  } catch {

  }
}

export async function updatePlayer(
  matchID: string,
  playerID: string,
  credentials: string,
  newName: string,
): Promise<void> {
  try {
    await axios.post(`/${matchID}/update`, {
      playerID,
      credentials,
      newName,
    });
  // eslint-disable-next-line no-empty
  } catch {

  }
}

export async function playAgain(
  matchID: string,
  playerID: string,
  credentials: string,
): Promise<string> {
  const response = await axios.post<{ nextMatchID: string }>(`/${matchID}/playAgain`, {
    playerID,
    credentials,
  });
  return response.data.nextMatchID;
}
