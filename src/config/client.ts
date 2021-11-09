import { isProduction, DEFAULT_PORT } from '.';

const { origin, protocol, hostname } = window.location;
export const SERVER_URL = isProduction
  ? origin
  : `${protocol}//${hostname}:${DEFAULT_PORT}`;

// nickname is used between games to simplify room user creation
export const NICKNAME_STORAGE_KEY = 'santorini_nickname';

// 'player' refers to users player in the game room
export const PLAYER_STORAGE_KEY = 'santorini_player';
