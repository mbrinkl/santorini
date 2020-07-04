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

export class Board {
  public static place(
    G: GameState,
    pos: number,
    playerId: string,
    workerNum: number
  ): void {
    const char = G.players[playerId].char;
    char.workers[workerNum].pos = pos;
    char.workers[workerNum].height = G.spaces[pos].height;
    G.spaces[pos].inhabited = true;
    G.spaces[pos].inhabitant.playerId = playerId;
    G.spaces[pos].inhabitant.workerNum = workerNum;
  }

  public static free(G: GameState, pos: number): void {
    G.spaces[pos].inhabited = false;
    G.spaces[pos].inhabitant.playerId = "";
    G.spaces[pos].inhabitant.workerNum = -1;
  }

  public static build(G: GameState, pos: number): void {
    if (G.spaces[pos].height < 4) G.spaces[pos].height++;
    if (G.spaces[pos].height === 4) G.spaces[pos].is_domed = true;
  }
}
