import { GameState } from '../types/GameTypes';

export const Board = {
  place: (
    G: GameState,
    pos: number,
    playerID: string,
    workerNum: number,
  ) => {
    const { charState } = G.players[playerID];
    charState.workers[workerNum].pos = pos;
    charState.workers[workerNum].height = G.spaces[pos].height;
    G.spaces[pos].inhabitant = {
      playerID,
      workerNum,
    };
  },

  free: (G: GameState, pos: number) => {
    G.spaces[pos].inhabitant = undefined;
  },

  build: (G: GameState, pos: number) => {
    if (G.spaces[pos].height < 4) G.spaces[pos].height += 1;
    if (G.spaces[pos].height === 4) G.spaces[pos].isDomed = true;
  },
};
