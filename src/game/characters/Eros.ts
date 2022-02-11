import { getAdjacentPositions, getOppositePerimeterPositions, posIsPerimeter } from '../utility';
import { Character } from '../../types/CharacterTypes';
import { Mortal } from './Mortal';

export const Eros: Character = {
  ...Mortal,
  desc: [
    'Setup: Place your Workers anywhere along opposite edges of the board.',
    `Win Condition: You also win if one of your Workers moves to a space neighboring your
    other Worker and both are on the first level.`,
  ],
  pack: 'advanced',

  validPlace: ({ G }, charState) => {
    const valids = new Set<number>();
    G.spaces.forEach((space) => {
      if (!space.inhabitant && posIsPerimeter(space.pos)) {
        if (charState.numWorkersToPlace === 2) {
          valids.add(space.pos);
        } else if (getOppositePerimeterPositions(charState.workers[0].pos).includes(space.pos)) {
          valids.add(space.pos);
        }
      }
    });
    return valids;
  },

  checkWinByMove: (G, charState, posBefore, posAfter) => {
    const normalWin = Mortal.checkWinByMove(G, charState, posBefore, posAfter);

    if (charState.workers.length === 2) {
      const selectedWorker = charState.workers[charState.selectedWorkerNum];
      const otherWorker = charState.workers[(charState.selectedWorkerNum + 1) % 2];
      return (
        normalWin
        || (getAdjacentPositions(selectedWorker.pos).includes(otherWorker.pos)
        && selectedWorker.height === 1 && otherWorker.height === 1)
      );
    }

    return normalWin;
  },
};
