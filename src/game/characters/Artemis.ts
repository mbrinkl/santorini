import { Character } from '../../types/CharacterTypes';
import { Mortal } from './Mortal';

type ArtemisAttrs = {
  prevPos: number,
};

export const Artemis: Character<ArtemisAttrs> = {
  ...Mortal,

  data: {
    ...Mortal.data,
    desc: [`Your Move: Your worker may move one additional time, but not back to
    its initial space.`],
    pack: 'simple',
    buttonText: 'End Move',
    attrs: {
      prevPos: -1,
    },
  },

  buttonPressed: (context, charState) => {
    charState.buttonActive = false;
    charState.attrs.prevPos = -1;
    return 'build';
  },

  validMove: (context, charState, fromPos) => {
    const valids = Mortal.validMove(context, charState, fromPos);

    if (valids.has(charState.attrs.prevPos)) {
      valids.delete(charState.attrs.prevPos);
    }

    return valids;
  },

  move: (context, charState, pos) => {
    if (charState.attrs.prevPos === -1) {
      charState.attrs.prevPos = charState.workers[charState.selectedWorkerNum].pos;
    } else {
      charState.attrs.prevPos = -1;
    }
    Mortal.move(context, charState, pos);
  },

  getStageAfterMove: (context, charState) => {
    if (charState.attrs.prevPos !== -1) {
      charState.buttonActive = true;
      return 'move';
    }

    charState.buttonActive = false;
    return 'build';
  },
};
