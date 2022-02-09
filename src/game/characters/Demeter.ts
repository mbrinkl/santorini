import { Character, CharacterState } from '../../types/CharacterTypes';
import { Mortal } from './Mortal';
import { Board } from '../boardUtil';

interface DemeterAttrs {
  firstBuildPos: number,
}

export const Demeter: Character<DemeterAttrs> = {
  ...Mortal,
  desc: ['Your Build: Your worker may build one additional time, but not on the same space.'],
  buttonText: 'Skip 2nd Build',
  attrs: {
    firstBuildPos: -1,
  },

  buttonPressed: (context, charState: CharacterState<DemeterAttrs>) => {
    charState.attrs.firstBuildPos = -1;
    charState.buttonActive = false;
    return 'end';
  },

  validBuild: (context, charState: CharacterState<DemeterAttrs>, fromPos) => {
    const valids = Mortal.validBuild(context, charState, fromPos);

    if (charState.attrs.firstBuildPos !== -1) {
      if (valids.has(charState.attrs.firstBuildPos)) {
        valids.delete(charState.attrs.firstBuildPos);
      }
    }

    return valids;
  },

  build: ({ G }, charState: CharacterState<DemeterAttrs>, pos) => {
    Board.build(G, pos);

    if (charState.attrs.firstBuildPos === -1) {
      charState.attrs.firstBuildPos = pos;
      charState.buttonActive = true;
    } else {
      charState.attrs.firstBuildPos = -1;
      charState.buttonActive = false;
    }
  },

  getStageAfterBuild: (context, charState: CharacterState<DemeterAttrs>) => {
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
