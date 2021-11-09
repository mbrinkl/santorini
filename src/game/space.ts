import { GameState } from '../types/GameTypes';

export const Board = {
  place: (
    G: GameState,
    pos: number,
    playerId: string,
    workerNum: number,
  ) => {
    const { char } = G.players[playerId];
    char.workers[workerNum].pos = pos;
    char.workers[workerNum].height = G.spaces[pos].height;
    G.spaces[pos].inhabitant = {
      playerId,
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
