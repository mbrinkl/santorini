import { Character, CharacterState } from '../../types/CharacterTypes';
import { Mortal } from './Mortal';
import { Board } from '../space';

interface AtlasAttrs {
  specialActive: boolean,
}

export const Atlas: Character<AtlasAttrs> = {
  ...Mortal,
  desc: 'Your Build: Your worker may build a dome at any level.',
  buttonText: 'Build Dome',
  attrs: {
    specialActive: false,
  },

  move: (context, char: CharacterState<AtlasAttrs>, pos) => {
    char.buttonActive = true;
    return Mortal.move(context, char, pos);
  },

  buttonPressed: (context, char: CharacterState<AtlasAttrs>) => {
    char.attrs.specialActive = !char.attrs.specialActive;
    char.buttonText = char.attrs.specialActive ? 'Cancel' : 'Build Dome';
    return Mortal.buttonPressed(context, char);
  },

  build: ({ G }, char, pos) => {
    if (char.attrs.specialActive) {
      G.spaces[pos].isDomed = true;
    } else {
      Board.build(G, pos);
    }

    char.attrs.specialActive = false;
    char.buttonActive = false;
    char.buttonText = 'Build Dome';
    return 'end';
  },
};
