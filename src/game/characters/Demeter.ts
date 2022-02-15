import { Character } from '../../types/CharacterTypes';
import { Mortal } from './Mortal';
import { Board } from '../boardUtil';

type DemeterAttrs = {
  firstBuildPos: number,
};

export const Demeter: Character<DemeterAttrs> = {
  ...Mortal,

  data: {
    ...Mortal.data,
    desc: ['Your Build: Your worker may build one additional time, but not on the same space.'],
    pack: 'simple',
    buttonText: 'Skip 2nd Build',
    attrs: {
      firstBuildPos: -1,
    },
  },

  onTurnEnd: (context, charState) => {
    charState.attrs.firstBuildPos = -1;
  },

  buttonPressed: (context, charState) => {
    charState.attrs.firstBuildPos = -1;
    charState.buttonActive = false;
    return 'end';
  },

  validBuild: (context, charState, fromPos) => {
    const valids = Mortal.validBuild(context, charState, fromPos);

    if (charState.attrs.firstBuildPos !== -1) {
      if (valids.has(charState.attrs.firstBuildPos)) {
        valids.delete(charState.attrs.firstBuildPos);
      }
    }

    return valids;
  },

  build: ({ G }, charState, pos) => {
    Board.build(G, pos);

    if (charState.attrs.firstBuildPos === -1) {
      charState.attrs.firstBuildPos = pos;
      charState.buttonActive = true;
    } else {
      charState.attrs.firstBuildPos = -1;
      charState.buttonActive = false;
    }
  },

  getStageAfterBuild: (context, charState) => {
    if (
      charState.attrs.firstBuildPos !== -1
      && Demeter.validBuild(context, charState, charState.attrs.firstBuildPos).size > 0
    ) {
      return 'build';
    }

    charState.attrs.firstBuildPos = -1;
    charState.buttonActive = false;
    return 'end';
  },
};
