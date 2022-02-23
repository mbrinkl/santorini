import { posIsPerimeter } from '../posUtil';
import { Mortal } from './Mortal';
import { Character } from '../../types/CharacterTypes';

type HestiaAttrs = {
  numBuilds: number;
};

export const Hestia: Character<HestiaAttrs> = {
  ...Mortal,

  data: {
    ...Mortal.data,
    desc: [
      `Your Build: Your Worker may build one additional time, 
        but this cannot be on a perimeter space.`,
    ],
    pack: 'simple',
    buttonText: 'Stop Building',
    attrs: {
      numBuilds: 0,
    },
  },

  buttonPressed: (context, charState) => {
    charState.buttonActive = false;
    return 'end';
  },

  validBuild: (context, charState, fromPos) => {
    const valids = Mortal.validBuild(context, charState, fromPos);
    if (charState.attrs.numBuilds === 1) {
      valids.forEach((pos) => {
        if (posIsPerimeter(pos)) {
          valids.delete(pos);
        }
      });
    }
    return valids;
  },

  getStageAfterBuild: (context, charState) => {
    charState.attrs.numBuilds += 1;
    if (
      charState.attrs.numBuilds === 1 &&
      Hestia.validBuild(
        context,
        charState,
        charState.workers[charState.selectedWorkerNum].pos,
      ).size > 0
    ) {
      charState.buttonActive = true;
      return 'build';
    }

    charState.buttonActive = false;
    return 'end';
  },

  onTurnEnd: (context, charState) => {
    charState.attrs.numBuilds = 0;
  },
};
