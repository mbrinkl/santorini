import { Mortal } from './Mortal';
import { getAdjacentPositions } from '../utility';
import { Character } from '../../types/CharacterTypes';
import { Board } from '../space';

export const Apollo: Character = {
  ...Mortal,
  desc: `Your Move : Your worker may move into an opponent worker's space by 
      forcing their worker to the space you just vacated.`,

  validMove: ({ G, playerID }, charState, fromPos) => {
    const valids = new Set<number>();

    getAdjacentPositions(fromPos).forEach((pos) => {
      if (
        !G.spaces[pos].isDomed
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

  move: ({ G, playerID }, charState, pos) => {
    const originalPos = charState.workers[charState.selectedWorkerNum].pos;
    const { inhabitant } = G.spaces[pos];

    // if switching spaces with another worker
    if (inhabitant) {
      Board.place(G, originalPos, inhabitant.playerID, inhabitant.workerNum);
    } else {
      Board.free(G, originalPos);
    }

    Board.place(G, pos, playerID, charState.selectedWorkerNum);
  },
};
