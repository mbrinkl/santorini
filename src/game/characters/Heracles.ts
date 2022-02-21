import { getAdjacentPositions } from '../utility';
import { Character } from '../../types/CharacterTypes';
import { Mortal } from './Mortal';
import { Board } from '../boardUtil';

type HeraclesAttrs = {
  specialUsed: boolean;
};

export const Heracles: Character<HeraclesAttrs> = {
  ...Mortal,

  data: {
    ...Mortal.data,
    desc: [
      'Instead of Your Build: Once, both your Workers build any number of domes (even zero) at any level',
    ],
    pack: 'heroes',
    buttonText: 'Build Domes',
    attrs: {
      specialUsed: false,
    },
  },

  buttonPressed: (context, charState) => {
    if (!charState.attrs.specialUsed) {
      charState.attrs.specialUsed = true;
      charState.buttonText = 'Build Nothing';
      return 'special';
    }

    charState.buttonText = 'Bulid Domes';
    charState.buttonActive = false;
    return 'end';
  },

  move: (context, charState, pos) => {
    if (!charState.attrs.specialUsed) {
      charState.buttonActive = true;
    }
    return Mortal.move(context, charState, pos);
  },

  build: (context, charState, pos) => {
    charState.buttonActive = false;
    return Mortal.build(context, charState, pos);
  },

  validSpecial: ({ G, playerID }, charState, fromPos) => {
    const valids = new Set<number>();

    charState.workers.forEach((worker) => {
      getAdjacentPositions(worker.pos).forEach((pos) => {
        if (!Board.isObstructed(G, playerID, pos)) {
          valids.add(pos);
        }
      });
    });

    return valids;
  },

  special: ({ G }, charState, pos) => {
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
