import { Character } from '../../types/CharacterTypes';
import { Mortal } from './Mortal';

export const Atlas: Character = {
  ...Mortal,
  desc: 'Your Build: Your worker may build a dome at any level.',
  buttonText: 'Build Dome',

  move: (context, charState, pos) => {
    charState.buttonActive = true;
    Mortal.move(context, charState, pos);
  },

  build: (context, charState, pos) => {
    charState.buttonActive = false;
    Mortal.build(context, charState, pos);
  },

  validSpecial: (context, charState, fromPos) => Mortal.validBuild(context, charState, fromPos),

  special: ({ G }, charState, pos) => {
    G.spaces[pos].isDomed = true;
  },

  buttonPressed: (context, charState) => {
    charState.buttonActive = false;
    return 'special';
  },
};
