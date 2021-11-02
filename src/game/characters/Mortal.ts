import { GameState, Player } from '../../types/GameTypes';
import { Ctx } from "boardgame.io";
import { Character, CharacterState } from ".";
import { getAdjacentPositions } from "../utility";
import { Board } from '../space'

export const Mortal : Character = {

  name: "Mortal",
  workers: [],
  desc: "No ability",
  buttonText: "No ability",
  buttonActive: false,
  numWorkers: 2,
  numWorkersToPlace: 2,
  selectedWorker: -1,
  moveUpHeight: 1,
  attrs: undefined,

  initialize : (
    G: GameState,
    ctx: Ctx,
    player: Player,
    char: CharacterState
  ) => {},

  onTurnBegin : (
    G: GameState,
    ctx: Ctx,
    player: Player,
    char: CharacterState
  ) => {},

  onTurnEnd : (
    G: GameState,
    ctx: Ctx,
    player: Player,
    char: CharacterState
  ) => {},

  validPlace : (
    G: GameState, 
    ctx: Ctx, 
    player: Player, 
    char: CharacterState
  ) => {
    let valids: number[] = [];
    for (const space of G.spaces) {
      if (!space.inhabited && char.numWorkersToPlace > 0) {
        valids.push(space.pos);
      }
    }
    return valids;
  },

  validSelect : (
    G: GameState,
    ctx: Ctx,
    player: Player,
    char: CharacterState
  ) => {
    let valids: number[] = [];

    char.workers.forEach((worker) => {
      if (Mortal.validMove(G, ctx, player, char, worker.pos).length > 0) {
        valids.push(worker.pos);
      }
    });

    return valids;
  },

  select : (
    G: GameState,
    ctx: Ctx,
    player: Player,
    char: CharacterState,
    pos: number
  ) => {
    char.selectedWorker = G.spaces[pos].inhabitant.workerNum;
    return "move";
  },

  validMove : (
    G: GameState,
    ctx: Ctx,
    player: Player,
    char: CharacterState,
    originalPos: number
  ) => {
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
  },

  hasValidMoves : (
    G: GameState,
    ctx: Ctx,
    player: Player,
    char: CharacterState
  ) => {
    let hasMove: boolean = false;
    char.workers.forEach((worker) => {
      if (Mortal.validMove(G, ctx, player, char, worker.pos).length > 0) {
        hasMove = true;
      }
    });

    return hasMove;
  },

  move : (
    G: GameState,
    ctx: Ctx,
    player: Player,
    char: CharacterState,
    pos: number
  ) => {
    // free the space that is being moved from
    Board.free(G, char.workers[char.selectedWorker].pos);

    // place the worker on the selected space
    Board.place(G, pos, player.id, char.selectedWorker);

    return "build";
  },

  validBuild : (
    G: GameState,
    ctx: Ctx,
    player: Player,
    char: CharacterState,
    originalPos: number
  ) => {
    let adjacents: number[] = getAdjacentPositions(originalPos);
    let valids: number[] = [];

    adjacents.forEach((pos) => {
      if (!G.spaces[pos].inhabited && !G.spaces[pos].is_domed) {
        valids.push(pos);
      }
    });

    return valids;
  },

  hasValidBuild : (
    G: GameState,
    ctx: Ctx,
    player: Player,
    char: CharacterState
  ) => {
    let hasBuild = false;

    char.workers.forEach((worker) => {
      if (Mortal.validBuild(G, ctx, player, char, worker.pos).length > 0) {
        hasBuild = true;
      }
    });

    return hasBuild;
  },

  build : (
    G: GameState,
    ctx: Ctx,
    player: Player,
    char: CharacterState,
    pos: number
  ) => {
    Board.build(G, pos);
    return "end";
  },

  buttonPressed : (
    G: GameState,
    ctx: Ctx,
    player: Player,
    char: CharacterState
  ) => {
    return ctx.activePlayers![ctx.currentPlayer];
  },

  checkWinByMove : (
    G: GameState,
    char: CharacterState,
    heightBefore: number,
    heightAfter: number
  ) => {
    return heightBefore < 3 && heightAfter === 3;
  },
};