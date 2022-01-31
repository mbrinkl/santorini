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

  buttonPressed: (context, char: CharacterState<HeraclesAttrs>) => {
    char.attrs.specialActive = !char.attrs.specialActive;

    if (char.attrs.specialUsed) {
      // reset stuff
      char.buttonActive = false;
      char.attrs.specialActive = false;
      char.buttonText = 'Build Domes';

      // set game stage
      return 'end';
    }
    if (char.attrs.specialActive) {
      char.buttonText = 'Cancel';
    } else {
      char.buttonText = 'Build Domes';
    }

    return Mortal.buttonPressed(context, char);
  },

  move: (context, char: CharacterState<HeraclesAttrs>, pos) => {
    if (!char.attrs.specialUsed) {
      char.attrs.numBuilds = 0;
      char.buttonActive = true;
    }
    return Mortal.move(context, char, pos);
  },

  validBuild: (context, char: CharacterState<HeraclesAttrs>, originalPos: number) => {
    const { G } = context;

    if (!char.attrs.specialActive) {
      return Mortal.validBuild(context, char, originalPos);
    }

    const valids: number[] = [];
    let adjacents: number[] = [];

    for (let i = 0; i < char.workers.length; i++) {
      // add on the adjacent positions of each worker
      adjacents = adjacents.concat(getAdjacentPositions(char.workers[i].pos));
    }

    adjacents.forEach((pos) => {
      if (!G.spaces[pos].inhabitant && !G.spaces[pos].isDomed) {
        valids.push(pos);
      }
    });

    return valids;
  },

  build: (context, char: CharacterState<HeraclesAttrs>, pos: number) => {
    const { G } = context;

    if (char.attrs.specialActive) {
      char.attrs.specialUsed = true;
      char.buttonText = 'End Build';
      char.attrs.numBuilds += 1;
      G.spaces[pos].isDomed = true;

      if (Mortal.hasValidBuild(context, char)) {
        return 'build';
      }
    } else {
      Board.build(G, pos);
    }

    char.buttonActive = false;
    char.attrs.specialActive = false;
    char.buttonText = 'Build Domes';
    return 'end';
  },
};
