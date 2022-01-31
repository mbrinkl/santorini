import { getAdjacentPositions } from '../utility';
import { Character, CharacterState } from '../../types/CharacterTypes';
import { Mortal } from './Mortal';
import { Board } from '../space';

interface HeraclesAttrs {
  specialActive: boolean,
  specialUsed: boolean,
  numBuilds: number
}

export const Heracles: Character<HeraclesAttrs> = {
  ...Mortal,
  desc: `End of Your Turn: Once, both your Workers build any number 
    of domes (even zero) at any level.`,
  buttonText: 'Build Domes',
  attrs: {
    specialActive: false,
    specialUsed: false,
    numBuilds: 0,
  },

  buttonPressed: (context, charState: CharacterState<HeraclesAttrs>) => {
    charState.attrs.specialActive = !charState.attrs.specialActive;

    if (charState.attrs.specialUsed) {
      // reset stuff
      charState.buttonActive = false;
      charState.attrs.specialActive = false;
      charState.buttonText = 'Build Domes';

      // set game stage
      return 'end';
    }
    if (charState.attrs.specialActive) {
      charState.buttonText = 'Cancel';
    } else {
      charState.buttonText = 'Build Domes';
    }

    return Mortal.buttonPressed(context, charState);
  },

  move: (context, charState: CharacterState<HeraclesAttrs>, pos) => {
    if (!charState.attrs.specialUsed) {
      charState.attrs.numBuilds = 0;
      charState.buttonActive = true;
    }
    return Mortal.move(context, charState, pos);
  },

  validBuild: (context, charState: CharacterState<HeraclesAttrs>, originalPos: number) => {
    const { G } = context;

    if (!charState.attrs.specialActive) {
      return Mortal.validBuild(context, charState, originalPos);
    }

    const valids: number[] = [];
    let adjacents: number[] = [];

    for (let i = 0; i < charState.workers.length; i++) {
      // add on the adjacent positions of each worker
      adjacents = adjacents.concat(getAdjacentPositions(charState.workers[i].pos));
    }

    adjacents.forEach((pos) => {
      if (!G.spaces[pos].inhabitant && !G.spaces[pos].isDomed) {
        valids.push(pos);
      }
    });

    return valids;
  },

  build: (context, charState: CharacterState<HeraclesAttrs>, pos: number) => {
    const { G } = context;

    if (charState.attrs.specialActive) {
      charState.attrs.specialUsed = true;
      charState.buttonText = 'End Build';
      charState.attrs.numBuilds += 1;
      G.spaces[pos].isDomed = true;

      if (Mortal.hasValidBuild(context, charState)) {
        return 'build';
      }
    } else {
      Board.build(G, pos);
    }

    charState.buttonActive = false;
    charState.attrs.specialActive = false;
    charState.buttonText = 'Build Domes';
    return 'end';
  },
};
