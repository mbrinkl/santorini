import { getAdjacentPositions } from '../utility';
import { Character, CharacterState } from '../../types/CharacterTypes';
import { Mortal } from './Mortal';
import { Board } from '../space';

interface ArtemisAttrs {
  numMoves: number,
  prevTile: number,
}

export const Artemis: Character<ArtemisAttrs> = {
  ...Mortal,
  desc: `Your Move: Your worker may move one additional time, but not back to
      its initial space.`,
  buttonText: 'End Move',
  attrs: {
    numMoves: 0,
    prevTile: -1,
  },

  validMove: ({ G }, char: CharacterState<ArtemisAttrs>, originalPos) => {
    const valids: number[] = [];

    if (char.selectedWorkerNum !== -1 && char.attrs.numMoves === 0) {
      char.attrs.prevTile = char.workers[char.selectedWorkerNum].pos;
    }

    getAdjacentPositions(originalPos).forEach((pos) => {
      if (
        !G.spaces[pos].inhabitant
        && !G.spaces[pos].isDomed
        && G.spaces[pos].height - G.spaces[originalPos].height <= char.moveUpHeight
        && char.attrs.prevTile !== pos
      ) {
        valids.push(pos);
      }
    });

    return valids;
  },

  move: ({ G, playerID }, char: CharacterState<ArtemisAttrs>, pos) => {
    char.attrs.numMoves += 1;

    // free the space that is being moved from
    Board.free(G, char.workers[char.selectedWorkerNum].pos);

    // place the worker on the selected space
    Board.place(G, pos, playerID, char.selectedWorkerNum);

    if (char.attrs.numMoves === 2) {
      char.attrs.numMoves = 0;
      char.attrs.prevTile = -1;
      char.buttonActive = false;
      return 'build';
    }

    char.buttonActive = true;
    return 'move';
  },

  buttonPressed: (context, char: CharacterState) => {
    char.buttonActive = false;
    return 'build';
  },
};
