import { Mortal } from './Mortal';
import { Character } from '../../types/characterTypes';

export const Hades: Character = {
  ...Mortal,

  data: {
    ...Mortal.data,
    desc: ['Opponent’s Turn: Opponent Workers cannot move down.'],
    pack: 'gf',
  },

  restrictOpponentMove: ({ G }, charState, opponentCharState, fromPos) => {
    const valids = new Set(G.valids);

    const fromPosHeight = G.spaces[fromPos].height;

    valids.forEach((pos) => {
      if (G.spaces[pos].height < fromPosHeight) {
        valids.delete(pos);
      }
    });

    return valids;
  },
};
