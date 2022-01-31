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

  validMove: ({ G }, charState: CharacterState<ArtemisAttrs>, originalPos) => {
    const valids: number[] = [];

    if (charState.selectedWorkerNum !== -1 && charState.attrs.numMoves === 0) {
      charState.attrs.prevTile = charState.workers[charState.selectedWorkerNum].pos;
    }

    getAdjacentPositions(originalPos).forEach((pos) => {
      if (
        !G.spaces[pos].inhabitant
        && !G.spaces[pos].isDomed
        && G.spaces[pos].height - G.spaces[originalPos].height <= charState.moveUpHeight
        && charState.attrs.prevTile !== pos
      ) {
        valids.push(pos);
      }
    });

    return valids;
  },

  move: ({ G, playerID }, charState: CharacterState<ArtemisAttrs>, pos) => {
    charState.attrs.numMoves += 1;

    // free the space that is being moved from
    Board.free(G, charState.workers[charState.selectedWorkerNum].pos);

    // place the worker on the selected space
    Board.place(G, pos, playerID, charState.selectedWorkerNum);

    if (charState.attrs.numMoves === 2) {
      charState.attrs.numMoves = 0;
      charState.attrs.prevTile = -1;
      charState.buttonActive = false;
      return 'build';
    }

    charState.buttonActive = true;
    return 'move';
  },

  buttonPressed: (context, charState: CharacterState) => {
    charState.buttonActive = false;
    return 'build';
  },
};
