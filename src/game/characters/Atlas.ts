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

  move: (context, charState: CharacterState<AtlasAttrs>, pos) => {
    charState.buttonActive = true;
    return Mortal.move(context, charState, pos);
  },

  buttonPressed: (context, charState: CharacterState<AtlasAttrs>) => {
    charState.attrs.specialActive = !charState.attrs.specialActive;
    charState.buttonText = charState.attrs.specialActive ? 'Cancel' : 'Build Dome';
    return Mortal.buttonPressed(context, charState);
  },

  build: ({ G }, charState, pos) => {
    if (charState.attrs.specialActive) {
      G.spaces[pos].isDomed = true;
    } else {
      Board.build(G, pos);
    }

    charState.attrs.specialActive = false;
    charState.buttonActive = false;
    charState.buttonText = 'Build Dome';
    return 'end';
  },
};
