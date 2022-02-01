import { Character, CharacterState } from '../../types/CharacterTypes';
import { Mortal } from './Mortal';
import { Board } from '../space';

interface HephaestusAttrs {
  firstBuildPos: number,
}

export const Hephaestus: Character<HephaestusAttrs> = {
  ...Mortal,
  desc: 'Your Build: Your Worker may build one additional block (not dome) on top of your first block.',
  buttonText: 'Skip 2nd Build',
  attrs: {
    firstBuildPos: -1,
  },

  buttonPressed: (context, charState: CharacterState<HephaestusAttrs>) => {
    charState.attrs.firstBuildPos = -1;
    charState.buttonActive = false;
    return 'end';
  },

  validBuild: (context, charState: CharacterState<HephaestusAttrs>, fromPos) => {
    if (charState.attrs.firstBuildPos === -1) {
      return Mortal.validBuild(context, charState, fromPos);
    }

    const { G } = context;
    const valids = new Set<number>();

    if (G.spaces[charState.attrs.firstBuildPos].height < 3) {
      valids.add(charState.attrs.firstBuildPos);
    }

    return valids;
  },

  build: ({ G }, charState: CharacterState<HephaestusAttrs>, pos) => {
    Board.build(G, pos);

    if (charState.attrs.firstBuildPos === -1) {
      charState.buttonActive = true;
      charState.attrs.firstBuildPos = pos;
    } else {
      charState.buttonActive = false;
      charState.attrs.firstBuildPos = -1;
    }
  },

  getStageAfterBuild: (context, charState: CharacterState<HephaestusAttrs>) => {
    if (
      charState.attrs.firstBuildPos !== -1
      && Hephaestus.validBuild(context, charState, charState.attrs.firstBuildPos).size > 0
    ) {
      return 'build';
    }

    charState.attrs.firstBuildPos = -1;
    charState.buttonActive = false;
    return 'end';
  },
};
