import { GameContext, GameState, Token } from '../types/GameTypes';
import { getCharacter } from './characters';

export const Board = {
  place: (
    context: GameContext,
    pos: number,
    placedPlayerID: string,
    workerNum: number,
  ) => {
    const { G } = context;
    const { charState } = G.players[placedPlayerID];
    charState.workers[workerNum].pos = pos;
    charState.workers[workerNum].height = G.spaces[pos].height;
    G.spaces[pos].inhabitant = {
      playerID: placedPlayerID,
      workerNum,
    };
    Board.tokenEffects(context, pos);
  },

  free: ({ G }: GameContext, pos: number) => {
    G.spaces[pos].inhabitant = undefined;
  },

  isObstructed: (G: GameState, playerID: string, pos: number) => (
    G.spaces[pos].isDomed
    || G.spaces[pos].inhabitant
    || Board.tokenObstructing(G, playerID, pos)
  ),

  tokenObstructing: (G: GameState, playerID: string, pos: number) => (
    G.spaces[pos].tokens.filter((token) => (
      token.obstructing === 'all'
      || (token.obstructing === 'opponent' && token.playerID !== playerID)
    )).length > 0
  ),

  build: (G: GameState, pos: number) => {
    if (G.spaces[pos].height < 4) G.spaces[pos].height += 1;
    if (G.spaces[pos].height === 4) G.spaces[pos].isDomed = true;
  },

  placeToken: (G: GameState, pos: number, token: Token) => {
    G.spaces[pos].tokens.push(token);
  },

  removeTokens: (G: GameState, pos: number) => {
    G.spaces[pos].tokens = G.spaces[pos].tokens.filter((token) => (
      !token.removable
    ));
  },

  tokenEffects: (context: GameContext, pos: number) => {
    const { G } = context;
    G.spaces[pos].tokens.forEach((token) => {
      const { charState } = G.players[token.playerID];
      const character = getCharacter(charState);
      character.tokenEffects(context, charState, pos);
    });
  },
};
