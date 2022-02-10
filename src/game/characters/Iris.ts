import { Board } from '../boardUtil';
import { Character } from '../../types/CharacterTypes';
import { Mortal } from './Mortal';
import { getAdjacentPositions, getNextPosition } from '../utility';

export const Iris: Character = {
  ...Mortal,
  desc: [`Your Move: If there is a Worker neighboring your Worker and the space directly on the 
      other side of it is unoccupied, your worker may move to that space regardless of its level.`],
  pack: 'promo',

  validMove: ({ G, playerID }, charState, fromPos) => {
    const valids = new Set<number>();

    getAdjacentPositions(fromPos).forEach((pos) => {
      // If the space is in valid range and height and not domed
      if (
        !G.spaces[pos].isDomed && !Board.tokenObstructing(G, playerID, pos)
        && G.spaces[pos].height - G.spaces[fromPos].height <= charState.moveUpHeight
      ) {
        // If the space is not inhabited
        if (!G.spaces[pos].inhabitant) {
        // Add the space to the valid list
          valids.add(pos);
        } else {
          // Or if the space is inhabited
          const nextPos = getNextPosition(fromPos, pos);

          if (nextPos !== -1) {
            if (!G.spaces[nextPos].inhabitant && !G.spaces[nextPos].isDomed) {
            // Add the space to the valid list
              valids.add(nextPos);
            }
          }
        }
      }
    });

    return valids;
  },
};
