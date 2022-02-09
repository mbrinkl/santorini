import { Character } from '../../types/CharacterTypes';
import { Mortal } from './Mortal';
import { posIsPerimeter } from '../utility';

export const Triton: Character = {
  ...Mortal,
  desc: [
    'Your Move: Each time your Worker moves into a perimeter space, it may immediately move again.',
  ],
  buttonText: 'End Move',

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
