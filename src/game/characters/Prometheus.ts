import { Character } from '../../types/characterTypes';
import { Mortal } from './Mortal';

type PrometheusAttrs = {
  specialUsed: boolean;
};

export const Prometheus: Character<PrometheusAttrs> = {
  ...Mortal,

  data: {
    ...Mortal.data,
    desc: [
      `Your Turn: If your Worker does not move up, 
        it may build both before and after moving.`,
    ],
    pack: 'simple',
    buttonText: 'Bulid Before Move',
    attrs: {
      specialUsed: false,
    },
  },

  onTurnEnd: (context, charState) => {
    charState.attrs.specialUsed = false;
    charState.moveUpHeight = 1;
  },

  select: (context, charState, pos) => {
    charState.attrs.specialUsed = false;
    charState.buttonActive = true;
    Mortal.select(context, charState, pos);
  },

  move: (context, charState, pos) => {
    charState.buttonActive = false;
    charState.attrs.specialUsed = false;
    Mortal.move(context, charState, pos);
  },

  getStageAfterBuild: (context, charState) =>
    charState.attrs.specialUsed ? 'move' : 'end',

  buttonPressed: (context, charState) => {
    charState.buttonActive = false;
    charState.attrs.specialUsed = true;
    charState.moveUpHeight = 0;
    return 'build';
  },
};
