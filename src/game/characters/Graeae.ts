import { Character } from '../../types/CharacterTypes';
import { Mortal } from './Mortal';
import { getAdjacentPositions } from '../posUtil';
import { Board } from '../boardUtil';

export const Graeae: Character = {
  ...Mortal,

  data: {
    ...Mortal.data,
    desc: [
      'Setup: When placing your Workers, place 3 of your color.',
      'Your Build: Build with a Worker that did not Move.',
    ],
    pack: 'gf',
    numWorkersToPlace: 3,
  },

  validBuild: ({ G, playerID }, charState, fromPos) => {
    let adjacents: number[] = [];
    const valids = new Set<number>();

    for (let i = 0; i < charState.workers.length; i++) {
      if (i !== charState.selectedWorkerNum) {
        // add on the adjacent positions of each worker
        adjacents = adjacents.concat(
          getAdjacentPositions(charState.workers[i].pos),
        );
      }
    }

    adjacents.forEach((pos) => {
      if (!Board.isObstructed(G, playerID, pos)) {
        valids.add(pos);
      }
    });

    return valids;
  },
};
