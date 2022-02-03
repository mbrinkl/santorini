import { Character, CharacterState } from '../../types/CharacterTypes';
import { Mortal } from './Mortal';

interface PrometheusAttrs {
  specialUsed: boolean,
}

export const Prometheus: Character<PrometheusAttrs> = {
  ...Mortal,
  desc: 'Your Turn: If your Worker does not move up, it may build both before and after moving.',
  buttonText: 'Bulid Before Move',
  attrs: {
    specialUsed: false,
  },

  select: (context, charState, pos) => {
    charState.attrs.specialUsed = false;
    charState.buttonActive = true;
    Mortal.select(context, charState, pos);
  },

  move: (context, charState: CharacterState<PrometheusAttrs>, pos) => {
    charState.buttonActive = false;
    charState.attrs.specialUsed = false;
    Mortal.move(context, charState, pos);
  },

  getStageAfterBuild: (context, charState) => (charState.attrs.specialUsed ? 'move' : 'end'),

  buttonPressed: (context, charState: CharacterState<PrometheusAttrs>) => {
    charState.buttonActive = false;
    charState.attrs.specialUsed = true;
    charState.moveUpHeight = 0;
    return 'build';
  },
};
