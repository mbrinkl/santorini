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

  buttonPressed: (context, char: CharacterState<DemeterAttrs>) => {
    // reset stuff
    char.attrs.numBuilds = 0;
    char.buttonActive = false;

    // set game stage
    return 'end';
  },

  validBuild: ({ G }, char: CharacterState<DemeterAttrs>, originalPos) => {
    const adjacents: number[] = getAdjacentPositions(originalPos);
    const valids: number[] = [];

    if (char.attrs.numBuilds === 0) {
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
          && pos !== char.attrs.firstBuildPos
        ) {
          valids.push(pos);
        }
      });
    }

    return valids;
  },

  build: ({ G }, char: CharacterState<DemeterAttrs>, pos) => {
    char.attrs.numBuilds += 1;

    if (char.attrs.numBuilds === 1) {
      char.attrs.firstBuildPos = pos;
      Board.build(G, pos);
      char.buttonActive = true;
      return 'build';
    }

    char.attrs.numBuilds = 0;
    char.buttonActive = false;
    Board.build(G, pos);
    return 'end';
  },
};
