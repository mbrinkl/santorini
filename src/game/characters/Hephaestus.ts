import { Character } from '../../types/CharacterTypes';
import { Mortal } from './Mortal';
import { Board } from '../boardUtil';

type HephaestusAttrs = {
  firstBuildPos: number;
};

export const Hephaestus: Character<HephaestusAttrs> = {
  ...Mortal,

  data: {
    ...Mortal.data,
    desc: [
      'Your Build: Your Worker may build one additional block (not dome) on top of your first block.',
    ],
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

  build: ({ G }, charState, pos) => {
    Board.build(G, pos);

    if (charState.attrs.firstBuildPos === -1) {
      charState.buttonActive = true;
      charState.attrs.firstBuildPos = pos;
    } else {
      charState.buttonActive = false;
      charState.attrs.firstBuildPos = -1;
    }
  },

  getStageAfterBuild: (context, charState) => {
    if (
      charState.attrs.firstBuildPos !== -1 &&
      Hephaestus.validBuild(context, charState, charState.attrs.firstBuildPos)
        .size > 0
    ) {
      return 'build';
    }

    charState.attrs.firstBuildPos = -1;
    charState.buttonActive = false;
    return 'end';
  },
};
