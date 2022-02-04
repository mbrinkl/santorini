import { Mortal } from './Mortal';
import { Character } from '../../types/CharacterTypes';

export const Hades: Character = {
  ...Mortal,
  desc: 'Opponent’s Turn: Opponent Workers cannot move down.',

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
