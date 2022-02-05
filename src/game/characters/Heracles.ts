import { getAdjacentPositions } from '../utility';
import { Character, CharacterState } from '../../types/CharacterTypes';
import { Mortal } from './Mortal';

interface HeraclesAttrs {
  specialUsed: boolean,
}

export const Heracles: Character<HeraclesAttrs> = {
  ...Mortal,
  desc: 'Instead of Your Build: Once, both your Workers build any number of domes (even zero) at any level',
  buttonText: 'Build Domes',
  attrs: {
    specialUsed: false,
  },

  buttonPressed: (context, charState: CharacterState<HeraclesAttrs>) => {
    if (!charState.attrs.specialUsed) {
      charState.attrs.specialUsed = true;
      charState.buttonText = 'Build Nothing';
      return 'special';
    }

    charState.buttonText = 'Bulid Domes';
    charState.buttonActive = false;
    return 'end';
  },

  move: (context, charState: CharacterState<HeraclesAttrs>, pos) => {
    if (!charState.attrs.specialUsed) {
      charState.buttonActive = true;
    }
    return Mortal.move(context, charState, pos);
  },

  build: (context, charState: CharacterState<HeraclesAttrs>, pos) => {
    charState.buttonActive = false;
    return Mortal.build(context, charState, pos);
  },

  validSpecial: ({ G }, charState, fromPos) => {
    const valids = new Set<number>();

    charState.workers.forEach((worker) => {
      getAdjacentPositions(worker.pos).forEach((pos) => {
        if (!G.spaces[pos].inhabitant && !G.spaces[pos].isDomed) {
          valids.add(pos);
        }
      });
    });

    return valids;
  },

  special: ({ G }, charState: CharacterState<HeraclesAttrs>, pos) => {
    G.spaces[pos].isDomed = true;
  },

  getStageAfterSpecial: (context, charState) => {
    if (Heracles.validSpecial(context, charState, -1).size > 0) {
      return 'special';
    }

    charState.buttonText = 'Bulid Domes';
    charState.buttonActive = false;
    return 'end';
  },
};
