import { Character } from '../../types/gameTypes';
import { Mortal } from './Mortal';
import { posIsPerimeter } from '../util/posUtil';

export const Triton: Character = {
  ...Mortal,

  data: {
    ...Mortal.data,
    desc: [
      `Your Move: Each time your Worker moves into a perimeter space, 
        it may immediately move again.`,
    ],
    pack: 'advanced',
    buttonText: 'End Move',
  },

  getStageAfterMove: (context, charState) => {
    const { pos } = charState.workers[charState.selectedWorkerNum];
    if (posIsPerimeter(pos)) {
      charState.buttonActive = true;
      return 'move';
    }

    charState.buttonActive = false;
    return 'build';
  },

  buttonPressed: (context, charState) => {
    charState.buttonActive = false;
    return 'build';
  },
};
