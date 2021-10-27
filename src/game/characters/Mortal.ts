import { GameState, Player } from "../../game";
import { Ctx } from "boardgame.io";
import { Character } from ".";
import { getAdjacentPositions } from "../utility";
import { Board } from '../space'

export class Mortal {
  public static desc = "No ability";
  public static buttonText = "No ability";
  public static buttonActive = false;
  public static numWorkers = 2;
  public static moveUpHeight = 1;
  public static attrs: any = undefined;

  public static onTurnBegin(
    G: GameState,
    ctx: Ctx,
    player: Player,
    char: Character
  ): void {}

  public static onTurnEnd(
    G: GameState,
    ctx: Ctx,
    player: Player,
    char: Character
  ): void {}

  public static validSelect(
    G: GameState,
    ctx: Ctx,
    player: Player,
    char: Character
  ): number[] {
    let valids: number[] = [];

    char.workers.forEach((worker) => {
      if (this.validMove(G, ctx, player, char, worker.pos).length > 0) {
        valids.push(worker.pos);
      }
    });

    return valids;
  }

  public static select(
    G: GameState,
    ctx: Ctx,
    player: Player,
    char: Character,
    pos: number
  ): string {
    char.selectedWorker = G.spaces[pos].inhabitant.workerNum;
    return "move";
  }

  public static validMove(
    G: GameState,
    ctx: Ctx,
    player: Player,
    char: Character,
    originalPos: number
  ): number[] {
    let adjacents: number[] = getAdjacentPositions(originalPos);
    let valids: number[] = [];

    adjacents.forEach((pos) => {
      if (
        !G.spaces[pos].inhabited &&
        !G.spaces[pos].is_domed &&
        G.spaces[pos].height - G.spaces[originalPos].height <= char.moveUpHeight
      ) {
        valids.push(pos);
      }
    });

    return valids;
  }

  public static hasValidMoves(
    G: GameState,
    ctx: Ctx,
    player: Player,
    char: Character
  ): boolean {
    let hasMove: boolean = false;
    char.workers.forEach((worker) => {
      if (this.validMove(G, ctx, player, char, worker.pos).length > 0) {
        hasMove = true;
      }
    });

    return hasMove;
  }

  public static move(
    G: GameState,
    ctx: Ctx,
    player: Player,
    char: Character,
    pos: number
  ): string {
    // free the space that is being moved from
    Board.free(G, char.workers[char.selectedWorker].pos);

    // place the worker on the selected space
    Board.place(G, pos, player.id, char.selectedWorker);

    return "build";
  }

  public static validBuild(
    G: GameState,
    ctx: Ctx,
    player: Player,
    char: Character,
    originalPos: number
  ): number[] {
    let adjacents: number[] = getAdjacentPositions(originalPos);
    let valids: number[] = [];

    adjacents.forEach((pos) => {
      if (!G.spaces[pos].inhabited && !G.spaces[pos].is_domed) {
        valids.push(pos);
      }
    });

    return valids;
  }

  public static hasValidBuild(
    G: GameState,
    ctx: Ctx,
    player: Player,
    char: Character
  ): boolean {
    let hasBuild = false;

    char.workers.forEach((worker) => {
      if (this.validBuild(G, ctx, player, char, worker.pos).length > 0) {
        hasBuild = true;
      }
    });

    return hasBuild;
  }

  public static build(
    G: GameState,
    ctx: Ctx,
    player: Player,
    char: Character,
    pos: number
  ): string {
    Board.build(G, pos);
    return "end";
  }

  public static buttonPressed(
    G: GameState,
    ctx: Ctx,
    player: Player,
    char: Character
  ): void {}

  public static checkWinByMove(
    G: GameState,
    heightBefore: number,
    heightAfter: number
  ): boolean {
    return heightBefore < 3 && heightAfter === 3;
  }
}