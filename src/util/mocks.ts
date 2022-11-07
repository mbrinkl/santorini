import { BoardProps } from 'boardgame.io/react';
import { _ClientImpl } from 'boardgame.io/dist/types/src/client/client';
import { Ctx } from 'boardgame.io';
import { initBoard, initPlayers } from '../game';
import { GameState } from '../types/gameTypes';

export const mockCtx: Ctx = {
  numPlayers: 2,
  activePlayers: {},
  currentPlayer: '0',
  phase: 'selectCharacters',
  playOrder: ['0', '1'],
  playOrderPos: 0,
  turn: 0,
};

export const mockBoardProps: BoardProps<GameState> = {
  _undo: [],
  _redo: [],
  _stateID: 0,
  chatMessages: [],
  log: [],
  deltalog: [],
  isActive: false,
  events: {},
  G: {
    isDummy: false,
    offBoardTokens: [],
    valids: [],
    players: initPlayers(mockCtx),
    spaces: initBoard(),
  },
  ctx: mockCtx,
  isConnected: true,
  isMultiplayer: true,
  matchID: 'default',
  moves: {},
  playerID: '0',
  plugins: {},
  redo: () => {},
  reset: () => {},
  undo: () => {},
  sendChatMessage: () => {},
  credentials: 'defaultCredentials',
  debug: false,
  matchData: undefined,
};
