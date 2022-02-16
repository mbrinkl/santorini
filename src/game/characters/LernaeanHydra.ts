import { Board } from '../boardUtil';
import { getAdjacentPositions, positionsAreAdjacent } from '../utility';
import { Mortal } from './Mortal';
import { Character } from '../../types/CharacterTypes';

type LernaeanHydraAttrs = {
  movingWorkerNum: number;
};

export const LernaeanHydra: Character<LernaeanHydraAttrs> = {
  ...Mortal,

  data: {
    ...Mortal.data,
    desc: ['Setup: Place four Workers.',
      `End of Turn: If any of your workers neighbour each other, force one such worker to an
        unoccupied space that doesn't. If not possible, remove one.`,
    ],
    numWorkersToPlace: 4,
    pack: 'custom',
    specialText: 'Select a Worker to Move',
    attrs: {
      movingWorkerNum: -1,
    },
  },

  getStageAfterBuild: (context, charState) => {
    if (LernaeanHydra.validSpecial(context, charState, -1).size > 0) {
      return 'special';
    }

    return 'end';
  },

  validSpecial: (context, charState) => {
    const { G, playerID } = context;
    let valids = new Set<number>();
    const workerPositions = charState.workers.map((w) => w.pos);

    if (charState.attrs.movingWorkerNum === -1) {
      // Iterate all unique pairs of positions, add each position that is
      // adjacent to another
      workerPositions.forEach((pos1) => {
        workerPositions.forEach((pos2) => {
          if (pos1 < pos2) {
            if (positionsAreAdjacent(pos1, pos2)) {
              valids.add(pos1);
              valids.add(pos2);
            }
          }
        });
      });

      // Check if there is any possible move, or if a worker must be killed
      if (valids.size > 0) {
        // If at least one worker has a valid special moved spot,
        // update the special text
        const validsCopy = new Set<number>();

        valids.forEach((pos) => {
          validsCopy.add(pos);

          const { inhabitant } = G.spaces[pos];
          if (inhabitant) {
            charState.attrs.movingWorkerNum = inhabitant.workerNum;

            if (LernaeanHydra.validSpecial(context, charState, -1).size === 0) {
              valids.delete(pos);
            }

            charState.attrs.movingWorkerNum = -1;
          }
        });

        if (valids.size === 0) {
          charState.specialText = 'Select a Worker to Kill';
          valids = validsCopy;
        } else {
          charState.specialText = 'Select a Worker to Move';
        }
      }
    } else {
      // Moving the worker
      workerPositions.splice(charState.attrs.movingWorkerNum, 1);
      G.spaces.forEach((space) => {
        if (!Board.isObstructed(G, playerID, space.pos)) {
          valids.add(space.pos);
        }
      });
      workerPositions.forEach((pos) => {
        getAdjacentPositions(pos).forEach(((adj) => {
          if (valids.has(adj)) {
            valids.delete(adj);
          }
        }));
      });
    }

    return valids;
  },

  special: (context, charState, pos) => {
    const { G, playerID } = context;
    if (charState.attrs.movingWorkerNum === -1) {
      const { inhabitant } = G.spaces[pos];
      if (inhabitant) {
        charState.attrs.movingWorkerNum = inhabitant.workerNum;

        if (LernaeanHydra.validSpecial(context, charState, -1).size === 0) {
          Board.killWorkerAtPos(context, pos);
          charState.attrs.movingWorkerNum = -1;
        }
      }
    } else {
      Board.free(context, charState.workers[charState.attrs.movingWorkerNum].pos);
      Board.place(context, pos, playerID, charState.attrs.movingWorkerNum);
      charState.attrs.movingWorkerNum = -1;
    }
  },

  getStageAfterSpecial: (context, charState) => {
    if (charState.attrs.movingWorkerNum !== -1) {
      return 'special';
    }

    return 'end';
  },
};
