import { isProduction, DEFAULT_PORT } from '.';

const { origin, protocol, hostname } = window.location;
export const SERVER_URL = isProduction
  ? origin
  : `${protocol}//${hostname}:${DEFAULT_PORT}`;

export const NICKNAME_STORAGE_KEY = 'santorini_nickname';
export const PLAYER_STORAGE_KEY = 'santorini_player';
