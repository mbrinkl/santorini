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

export const Hermes: Character<HermesAttrs> = {
  ...Mortal,
  desc: `Your Turn: If your Workers do not move up or down, they may 
    each move any number of times (even zero), and then either builds`,
  buttonText: 'End Move',

  attrs: {
    movedUpOrDown: false,
    isMoving: false,
    canMoveUp: true,
  },

  onTurnBegin: (
    G: GameState,
    ctx: Ctx,
    player: Player,
    char: CharacterState<HermesAttrs>,
  ) => {
    char.buttonActive = true;
  },

  validMove: (
    G: GameState,
    ctx: Ctx,
    player: Player,
    char: CharacterState<HermesAttrs>,
    originalPos: number,
  ) => {
    const adjacents: number[] = getAdjacentPositions(originalPos);
    const valids: number[] = [];

    if (char.attrs.canMoveUp) {
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
    char: CharacterState<HermesAttrs>,
    pos: number,
  ) => {
    let returnStage: GameStage = 'build';

    if (G.spaces[pos].height === char.workers[char.selectedWorker].height) {
      char.attrs.canMoveUp = false;
      char.attrs.isMoving = true;
      char.buttonText = 'Switch Workers';
      returnStage = 'move';
    } else {
      char.attrs.movedUpOrDown = true;
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
    char: CharacterState<HermesAttrs>,
    originalPos: number,
  ) => {
    const valids: number[] = [];
    let adjacents: number[] = [];

    // normal build
    if (char.attrs.movedUpOrDown) {
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
    char: CharacterState<HermesAttrs>,
    pos: number,
  ) => {
    char.attrs.isMoving = false;
    char.attrs.canMoveUp = true;
    char.attrs.movedUpOrDown = false;

    Board.build(G, pos);
    return 'end';
  },

  buttonPressed: (
    G: GameState,
    ctx: Ctx,
    player: Player,
    char: CharacterState<HermesAttrs>,
  ) => {
    if (char.attrs.isMoving) {
      char.attrs.isMoving = false;
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
