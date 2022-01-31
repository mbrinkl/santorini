import { Character, CharacterState } from '../../types/CharacterTypes';
import { Mortal } from './Mortal';
import { getAdjacentPositions } from '../utility';
import { Board } from '../space';

interface DemeterAttrs {
  numBuilds: number,
  firstBuildPos: number,
}

export const Demeter: Character<DemeterAttrs> = {
  ...Mortal,
  desc: 'Your Build: Your worker may build one additional time, but not on the same space.',
  buttonText: 'Skip 2nd Build',
  attrs: {
    numBuilds: 0,
    firstBuildPos: 0,
  },

  buttonPressed: (context, charState: CharacterState<DemeterAttrs>) => {
    // reset stuff
    charState.attrs.numBuilds = 0;
    charState.buttonActive = false;

    // set game stage
    return 'end';
  },

  validBuild: ({ G }, charState: CharacterState<DemeterAttrs>, originalPos) => {
    const adjacents: number[] = getAdjacentPositions(originalPos);
    const valids: number[] = [];

    if (charState.attrs.numBuilds === 0) {
      adjacents.forEach((pos) => {
        if (!G.spaces[pos].inhabitant && !G.spaces[pos].isDomed) {
          valids.push(pos);
        }
      });
    } else {
      adjacents.forEach((pos) => {
        if (
          !G.spaces[pos].inhabitant
          && !G.spaces[pos].isDomed
          && pos !== charState.attrs.firstBuildPos
        ) {
          valids.push(pos);
        }
      });
    }

    return valids;
  },

  build: ({ G }, charState: CharacterState<DemeterAttrs>, pos) => {
    charState.attrs.numBuilds += 1;

    if (charState.attrs.numBuilds === 1) {
      charState.attrs.firstBuildPos = pos;
      Board.build(G, pos);
      charState.buttonActive = true;
      return 'build';
    }

    charState.attrs.numBuilds = 0;
    charState.buttonActive = false;
    Board.build(G, pos);
    return 'end';
  },
};
