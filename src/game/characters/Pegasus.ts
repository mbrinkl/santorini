import Mortal from './Mortal';
import { Character } from '../../types/characterTypes';

const Pegasus: Character = {
  ...Mortal,

  data: {
    ...Mortal.data,
    desc: [
      `Your Move: Your Worker may move up more than one level, 
        but cannot win the game by doing so.`,
    ],
    pack: 'promo',
    moveUpHeight: 3,
  },

  checkWinByMove: ({ G }, charState, posBefore, posAfter) =>
    G.spaces[posBefore].height === 2 && G.spaces[posAfter].height === 3,
};

export default Pegasus;
