import { Ctx } from 'boardgame.io';
import { GameStage, GameState, Player } from '../../types/GameTypes';
import { Character, CharacterState } from '../../types/CharacterTypes';
import { getAdjacentPositions } from '../utility';
import { Board } from '../space';

export const Mortal: Character = {

  workers: [],
  desc: 'No ability',
  buttonText: 'No ability',
  buttonActive: false,
  numWorkers: 2,
  numWorkersToPlace: 2,
  selectedWorker: -1,
  moveUpHeight: 1,
  attrs: null,

  initialize: (
    G: GameState,
    ctx: Ctx,
    player: Player,
    char: CharacterState,
  ) => {},

  onTurnBegin: (
    G: GameState,
    ctx: Ctx,
    player: Player,
    char: CharacterState,
  ) => {},

  onTurnEnd: (
    G: GameState,
    ctx: Ctx,
    player: Player,
    char: CharacterState,
  ) => {},

  validPlace: (
    G: GameState,
    ctx: Ctx,
    player: Player,
    char: CharacterState,
  ) => {
    const valids: number[] = [];
    G.spaces.forEach((space) => {
      if (!space.inhabitant && char.numWorkersToPlace > 0) {
        valids.push(space.pos);
      }
    });
    return valids;
  },

  validSelect: (
    G: GameState,
    ctx: Ctx,
    player: Player,
    char: CharacterState,
  ) => {
    const valids: number[] = [];

    char.workers.forEach((worker) => {
      if (Mortal.validMove(G, ctx, player, char, worker.pos).length > 0) {
        valids.push(worker.pos);
      }
    });

    return valids;
  },

  select: (
    G: GameState,
    ctx: Ctx,
    player: Player,
    char: CharacterState,
    pos: number,
  ) => {
    char.selectedWorker = G.spaces[pos].inhabitant?.workerNum || -1;
    return 'move';
  },

  validMove: (
    G: GameState,
    ctx: Ctx,
    player: Player,
    char: CharacterState,
    originalPos: number,
  ) => {
    const valids: number[] = [];

    getAdjacentPositions(originalPos).forEach((pos) => {
      if (
        !G.spaces[pos].inhabitant
        && !G.spaces[pos].isDomed
        && G.spaces[pos].height - G.spaces[originalPos].height <= char.moveUpHeight
      ) {
        valids.push(pos);
      }
    });

    return valids;
  },

  hasValidMoves: (
    G: GameState,
    ctx: Ctx,
    player: Player,
    char: CharacterState,
  ) => {
    let hasMove = false;
    char.workers.forEach((worker) => {
      if (Mortal.validMove(G, ctx, player, char, worker.pos).length > 0) {
        hasMove = true;
      }
    });

    return hasMove;
  },

  move: (
    G: GameState,
    ctx: Ctx,
    player: Player,
    char: CharacterState,
    pos: number,
  ) => {
    // free the space that is being moved from
    Board.free(G, char.workers[char.selectedWorker].pos);

    // place the worker on the selected space
    Board.place(G, pos, player.id, char.selectedWorker);

    return 'build';
  },

  validBuild: (
    G: GameState,
    ctx: Ctx,
    player: Player,
    char: CharacterState,
    originalPos: number,
  ) => {
    const adjacents: number[] = getAdjacentPositions(originalPos);
    const valids: number[] = [];

    adjacents.forEach((pos) => {
      if (!G.spaces[pos].inhabitant && !G.spaces[pos].isDomed) {
        valids.push(pos);
      }
    });

    return valids;
  },

  hasValidBuild: (
    G: GameState,
    ctx: Ctx,
    player: Player,
    char: CharacterState,
  ) => {
    let hasBuild = false;

    char.workers.forEach((worker) => {
      if (Mortal.validBuild(G, ctx, player, char, worker.pos).length > 0) {
        hasBuild = true;
      }
    });

    return hasBuild;
  },

  build: (
    G: GameState,
    ctx: Ctx,
    player: Player,
    char: CharacterState,
    pos: number,
  ) => {
    Board.build(G, pos);
    return 'end';
  },

  buttonPressed: (
    G: GameState,
    ctx: Ctx,
    player: Player,
    char: CharacterState,
  ) => (ctx.activePlayers && ctx.activePlayers[ctx.currentPlayer]) as GameStage,

  checkWinByMove: (
    G: GameState,
    char: CharacterState,
    heightBefore: number,
    heightAfter: number,
  ) => heightBefore < 3 && heightAfter === 3,
};
