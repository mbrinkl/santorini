import { Mortal } from './Mortal';
import { Character } from '../../types/CharacterTypes';

export const Pan: Character = {
  ...Mortal,

  data: {
    ...Mortal.data,
    desc: ['Win Condition: You also win if your Worker moves down two or more levels.'],
    pack: 'simple',
  },

  checkWinByMove: ({ G }, charState, posBefore, posAfter) => (
    (G.spaces[posBefore].height < 3 && G.spaces[posAfter].height === 3)
    || ((G.spaces[posBefore].height - G.spaces[posAfter].height) > 1)
  ),
};
