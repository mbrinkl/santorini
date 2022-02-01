import { Character, CharacterState } from '../../types/CharacterTypes';
import { Mortal } from './Mortal';
import { getAdjacentPositions } from '../utility';
import { Board } from '../space';

interface HephaestusAttrs {
  numBuilds: number,
  firstBuildPos: number,
}

export const Hephaestus: Character<HephaestusAttrs> = {
  ...Mortal,
  desc: 'Your Build: Your Worker may build one additional block (not dome) on top of your first block.',
  buttonText: 'Skip 2nd Build',
  attrs: {
    numBuilds: 0,
    firstBuildPos: -1,
  },

  buttonPressed: (context, charState: CharacterState<HephaestusAttrs>) => {
    // reset stuff
    charState.attrs.numBuilds = 0;
    charState.buttonActive = false;

    // set game stage
    return 'end';
  },

  validBuild: ({ G }, charState: CharacterState<HephaestusAttrs>, originalPos) => {
    const adjacents: number[] = getAdjacentPositions(originalPos);
    const valids = new Set<number>();

    if (charState.attrs.numBuilds === 0) {
      adjacents.forEach((pos) => {
        if (!G.spaces[pos].inhabitant && !G.spaces[pos].isDomed) {
          valids.add(pos);
        }
      });
    } else {
      valids.add(charState.attrs.firstBuildPos);
    }

    return valids;
  },

  build: ({ G }, charState: CharacterState<HephaestusAttrs>, pos) => {
    charState.attrs.numBuilds += 1;

    if (charState.attrs.numBuilds === 1) {
      Board.build(G, pos);

      if (G.spaces[pos].height > 2) {
        charState.attrs.numBuilds = 0;
        return 'end';
      }

      charState.attrs.firstBuildPos = pos;
      charState.buttonActive = true;
      return 'build';
    }

    charState.attrs.numBuilds = 0;
    charState.buttonActive = false;
    Board.build(G, pos);
    return 'end';
  },
};
