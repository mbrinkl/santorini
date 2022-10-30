import { Character } from '../../types/characterTypes';
import Mortal from './Mortal';

const Atlas: Character = {
  ...Mortal,

  data: {
    ...Mortal.data,
    desc: ['Your Build: Your worker may build a dome at any level.'],
    pack: 'simple',
    buttonText: 'Build Dome',
  },

  move: (context, charState, pos) => {
    charState.buttonActive = true;
    Mortal.move(context, charState, pos);
  },

  build: (context, charState, pos) => {
    charState.buttonActive = false;
    Mortal.build(context, charState, pos);
  },

  validSpecial: (context, charState, fromPos) =>
    Mortal.validBuild(context, charState, fromPos),

  special: ({ G }, charState, pos) => {
    G.spaces[pos].isDomed = true;
  },

  buttonPressed: (context, charState) => {
    charState.buttonActive = false;
    return 'special';
  },
};

export default Atlas;
