import { getWrappedAdjacents } from '../posUtil';
import { Character } from '../../types/characterTypes';
import { Mortal } from './Mortal';
import { Board } from '../boardUtil';

export const Urania: Character = {
  ...Mortal,

  data: {
    ...Mortal.data,
    desc: [
      `Your Turn: When your Worker moves or builds, treat opposite edges and 
      corners as if they are adjacent so that every space has 8 neighbors.`,
    ],
    pack: 'gf',
  },

  validMove: ({ G, playerID }, charState, originalPos) => {
    const valids = new Set<number>();

    getWrappedAdjacents(originalPos).forEach((pos) => {
      if (
        !Board.isObstructed(G, playerID, pos) &&
        G.spaces[pos].height - G.spaces[originalPos].height <=
          charState.moveUpHeight
      ) {
        valids.add(pos);
      }
    });

    return valids;
  },

  validBuild: ({ G, playerID }, charState, fromPos) => {
    const valids = new Set<number>();

    getWrappedAdjacents(fromPos).forEach((pos) => {
      if (!Board.isObstructed(G, playerID, pos)) {
        valids.add(pos);
      }
    });

    return valids;
  },
};
