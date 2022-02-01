import { getAdjacentPositions } from '../utility';
import { Character, CharacterState } from '../../types/CharacterTypes';
import { Mortal } from './Mortal';
import { Board } from '../space';

interface ArtemisAttrs {
  numMoves: number,
  prevPos: number,
}

export const Artemis: Character<ArtemisAttrs> = {
  ...Mortal,
  desc: `Your Move: Your worker may move one additional time, but not back to
      its initial space.`,
  buttonText: 'End Move',
  attrs: {
    numMoves: 0,
    prevPos: -1,
  },

  onTurnBegin: (context, charState) => {
    charState.attrs.numMoves = 0;
    charState.attrs.prevPos = -1;
  },

  validMove: ({ G }, charState: CharacterState<ArtemisAttrs>, originalPos) => {
    const valids = new Set<number>();

    if (charState.selectedWorkerNum !== -1 && charState.attrs.numMoves === 0) {
      charState.attrs.prevPos = charState.workers[charState.selectedWorkerNum].pos;
    }

    getAdjacentPositions(originalPos).forEach((pos) => {
      if (
        !G.spaces[pos].inhabitant
        && !G.spaces[pos].isDomed
        && G.spaces[pos].height - G.spaces[originalPos].height <= charState.moveUpHeight
        && charState.attrs.prevPos !== pos
      ) {
        valids.add(pos);
      }
    });

    return valids;
  },

  move: ({ G, playerID }, charState: CharacterState<ArtemisAttrs>, pos) => {
    charState.attrs.numMoves += 1;
    Board.free(G, charState.workers[charState.selectedWorkerNum].pos);
    Board.place(G, pos, playerID, charState.selectedWorkerNum);
  },

  getStageAfterMove: (context, charState: CharacterState<ArtemisAttrs>) => {
    if (charState.attrs.numMoves === 2) {
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
