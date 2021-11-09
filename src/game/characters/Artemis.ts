import { Ctx } from 'boardgame.io';
import { getAdjacentPositions } from '../utility';
import { Character, CharacterState } from '../../types/CharacterTypes';
import { Mortal } from './Mortal';
import { GameState, Player } from '../../types/GameTypes';
import { Board } from '../space';

// interface Arty extends Omit<Character, 'attrs'> {
//   attrs: {
//     numMoves: number,
//     prevTile: number
//   }
// }

interface ArtemisAttrs {
  numMoves: number,
  prevTile: number,
}

const initialAttrs: ArtemisAttrs = {
  numMoves: 0,
  prevTile: -1,
};

export const Artemis: Character = {
  ...Mortal,
  desc: `Your Move: Your worker may move one additional time, but not back to
      its initial space.`,
  buttonText: 'End Move',
  attrs: initialAttrs,

  validMove: (
    G: GameState,
    ctx: Ctx,
    player: Player,
    char: CharacterState,
    originalPos: number,
  ) => {
    const attrs: ArtemisAttrs = char.attrs as ArtemisAttrs;
    const valids: number[] = [];

    if (char.selectedWorker !== -1 && attrs.numMoves === 0) {
      attrs.prevTile = char.workers[char.selectedWorker].pos;
    }

    getAdjacentPositions(originalPos).forEach((pos) => {
      if (
        !G.spaces[pos].inhabited
        && !G.spaces[pos].isDomed
        && G.spaces[pos].height - G.spaces[originalPos].height <= char.moveUpHeight
        && attrs.prevTile !== pos
      ) {
        valids.push(pos);
      }
    });

    return valids;
  },

  move: (
    G: GameState,
    ctx: Ctx,
    player: Player,
    char: CharacterState,
    pos: number,
  ) => {
    const attrs: ArtemisAttrs = char.attrs as ArtemisAttrs;

    attrs.numMoves += 1;

    // free the space that is being moved from
    Board.free(G, char.workers[char.selectedWorker].pos);

    // place the worker on the selected space
    Board.place(G, pos, player.id, char.selectedWorker);

    if (attrs.numMoves === 2) {
      attrs.numMoves = 0;
      attrs.prevTile = -1;
      char.buttonActive = false;
      return 'build';
    }

    char.buttonActive = true;
    return 'move';
  },

  buttonPressed: (
    G: GameState,
    ctx: Ctx,
    player: Player,
    char: CharacterState,
  ) => {
    char.buttonActive = false;
    return 'build';
  },
};
