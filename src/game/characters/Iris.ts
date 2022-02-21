import { Board } from '../boardUtil';
import { Character } from '../../types/CharacterTypes';
import { Mortal } from './Mortal';
import { getAdjacentPositions, getNextPosition } from '../utility';

export const Iris: Character = {
  ...Mortal,

  data: {
    ...Mortal.data,
    desc: [
      `Your Move: If there is a Worker neighboring your Worker and the
        space directly on the other side of it is unoccupied, your worker
        may move to that space regardless of its level.`,
    ],
    pack: 'promo',
  },

  validMove: (context, charState, fromPos) => {
    const { G, playerID } = context;
    const valids = Mortal.validMove(context, charState, fromPos);

    getAdjacentPositions(fromPos).forEach((pos) => {
      if (G.spaces[pos].inhabitant) {
        const nextPos = getNextPosition(fromPos, pos);
        if (nextPos !== -1 && !Board.isObstructed(G, playerID, nextPos)) {
          valids.add(nextPos);
        }
      }
    });

    return valids;
  },
};
