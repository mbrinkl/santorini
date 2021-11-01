import { GameState } from "./index";

export interface Space {
  pos: number;
  height: number;
  inhabited: boolean;
  inhabitant: {
    playerId: string;
    workerNum: number;
  };
  is_domed: boolean;
}

export const Board = {
  place: (
    G: GameState,
    pos: number,
    playerId: string,
    workerNum: number
  ) => {
    const char = G.players[playerId].char;
    char.workers[workerNum].pos = pos;
    char.workers[workerNum].height = G.spaces[pos].height;
    G.spaces[pos].inhabited = true;
    G.spaces[pos].inhabitant.playerId = playerId;
    G.spaces[pos].inhabitant.workerNum = workerNum;
  },

  free: (G: GameState, pos: number) => {
    G.spaces[pos].inhabited = false;
    G.spaces[pos].inhabitant.playerId = "";
    G.spaces[pos].inhabitant.workerNum = -1;
  },

  build: (G: GameState, pos: number) => {
    if (G.spaces[pos].height < 4) G.spaces[pos].height++;
    if (G.spaces[pos].height === 4) G.spaces[pos].is_domed = true;
  }
}
