import { Ctx } from 'boardgame.io';
import { getAdjacentPositions } from '../utility';
import { Character, CharacterState } from '../../types/CharacterTypes';
import { Mortal } from './Mortal';
import { GameStage, GameState, Player } from '../../types/GameTypes';
import { Board } from '../space';

interface HermesAttrs {
  movedUpOrDown: boolean,
  isMoving: boolean,
  canMoveUp: boolean
}

const initialAttrs: HermesAttrs = {
  movedUpOrDown: false,
  isMoving: false,
  canMoveUp: true,
};

export const Hermes: Character = {
  ...Mortal,
  desc: `Your Turn: If your Workers do not move up or down, they may 
    each move any number of times (even zero), and then either builds`,
  buttonText: 'End Move',

  attrs: initialAttrs,

  onTurnBegin: (
    G: GameState,
    ctx: Ctx,
    player: Player,
    char: CharacterState,
  ) => {
    char.buttonActive = true;
  },

  validMove: (
    G: GameState,
    ctx: Ctx,
    player: Player,
    char: CharacterState,
    originalPos: number,
  ) => {
    const attrs: HermesAttrs = char.attrs as HermesAttrs;

    const adjacents: number[] = getAdjacentPositions(originalPos);
    const valids: number[] = [];

    if (attrs.canMoveUp) {
      adjacents.forEach((pos) => {
        if (!G.spaces[pos].inhabited && !G.spaces[pos].isDomed
          && G.spaces[pos].height - G.spaces[originalPos].height <= char.moveUpHeight
        ) {
          valids.push(pos);
        }
      });
    } else {
      adjacents.forEach((pos) => {
        if (!G.spaces[pos].inhabited && !G.spaces[pos].isDomed
          && G.spaces[pos].height === G.spaces[originalPos].height
        ) {
          valids.push(pos);
        }
      });
    }

    return valids;
  },

  move: (
    G: GameState,
    ctx: Ctx,
    player: Player,
    char: CharacterState,
    pos: number,
  ) => {
    const attrs: HermesAttrs = char.attrs as HermesAttrs;

    let returnStage: GameStage = 'build';

    if (G.spaces[pos].height === char.workers[char.selectedWorker].height) {
      attrs.canMoveUp = false;
      attrs.isMoving = true;
      char.buttonText = 'Switch Workers';
      returnStage = 'move';
    } else {
      attrs.movedUpOrDown = true;
      char.buttonActive = false;
    }

    // free the space that is being moved from
    Board.free(G, char.workers[char.selectedWorker].pos);

    // place the worker on the selected space
    Board.place(G, pos, player.id, char.selectedWorker);

    return returnStage;
  },

  validBuild: (
    G: GameState,
    ctx: Ctx,
    player: Player,
    char: CharacterState,
    originalPos: number,
  ) => {
    const attrs: HermesAttrs = char.attrs as HermesAttrs;

    const valids: number[] = [];
    let adjacents: number[] = [];

    // normal build
    if (attrs.movedUpOrDown) {
      adjacents = getAdjacentPositions(originalPos);
    } else {
      // special build, within range of either worker
      for (let i = 0; i < char.numWorkers; i++) {
        // add on the adjacent positions of each worker
        adjacents = adjacents.concat(getAdjacentPositions(char.workers[i].pos));
      }
    }

    adjacents.forEach((pos) => {
      if (!G.spaces[pos].inhabited && !G.spaces[pos].isDomed) {
        valids.push(pos);
      }
    });

    return valids;
  },

  build: (
    G: GameState,
    ctx: Ctx,
    player: Player,
    char: CharacterState,
    pos: number,
  ) => {
    const attrs: HermesAttrs = char.attrs as HermesAttrs;

    attrs.isMoving = false;
    attrs.canMoveUp = true;
    attrs.movedUpOrDown = false;

    Board.build(G, pos);
    return 'end';
  },

  buttonPressed: (
    G: GameState,
    ctx: Ctx,
    player: Player,
    char: CharacterState,
  ) => {
    const attrs: HermesAttrs = char.attrs as HermesAttrs;

    if (attrs.isMoving) {
      attrs.isMoving = false;
      char.buttonText = 'End Move';
      // change the selected worker
      if (char.workers.length > 1) char.selectedWorker = (char.selectedWorker + 1) % 2;
    } else {
      char.buttonActive = false;
      if (char.selectedWorker === -1) {
        char.selectedWorker = 0;
      }
      return 'build';
    }

    return Mortal.buttonPressed(G, ctx, player, char);
  },
};
