import { Character } from '../../types/CharacterTypes';
import { Mortal } from './Mortal';
import { getAdjacentPositions } from '../utility';

export const Graeae: Character = {
  ...Mortal,
  desc: `Setup: When placing your Workers, place 3 of your color.\n
    Your Build: Build with a Worker that did not Move.\n
    Banned VS: Nemesis`,
  numWorkersToPlace: 3,

  validBuild: ({ G }, char, originalPos) => {
    let adjacents: number[] = [];
    const valids: number[] = [];

    for (let i = 0; i < char.workers.length; i++) {
      if (i !== char.selectedWorkerNum) {
        // add on the adjacent positions of each worker
        adjacents = adjacents.concat(getAdjacentPositions(char.workers[i].pos));
      }
    }

    adjacents.forEach((pos) => {
      if (!G.spaces[pos].inhabitant && !G.spaces[pos].isDomed) {
        valids.push(pos);
      }
    });

    return valids;
  },
};
