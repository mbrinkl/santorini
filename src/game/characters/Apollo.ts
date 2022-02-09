import { Mortal } from './Mortal';
import { getAdjacentPositions } from '../utility';
import { Character } from '../../types/CharacterTypes';
import { Board } from '../boardUtil';

export const Apollo: Character = {
  ...Mortal,
  desc: [`Your Move : Your worker may move into an opponent worker's space by 
      forcing their worker to the space you just vacated.`],

  validMove: ({ G, playerID }, charState, fromPos) => {
    const valids = new Set<number>();

    getAdjacentPositions(fromPos).forEach((pos) => {
      if (
        !G.spaces[pos].isDomed && !Board.tokenObstructing(G, playerID, pos)
        && G.spaces[pos].height - G.spaces[fromPos].height <= charState.moveUpHeight
      ) {
        if (!G.spaces[pos].inhabitant) {
          valids.add(pos);
        } else if (G.spaces[pos].inhabitant?.playerID !== playerID) {
          valids.add(pos);
        }
      }
    });

    return valids;
  },

  move: (context, charState, pos) => {
    const { G, playerID } = context;
    const originalPos = charState.workers[charState.selectedWorkerNum].pos;
    const { inhabitant } = G.spaces[pos];

    // if switching spaces with another worker
    if (inhabitant) {
      Board.place(context, originalPos, inhabitant.playerID, inhabitant.workerNum);
    } else {
      Board.free(context, originalPos);
    }

    Board.place(context, pos, playerID, charState.selectedWorkerNum);
  },
};
