import { Mortal } from './Mortal';
import { Character } from '../../types/CharacterTypes';
import { Board } from '../space';
import { getNextPosition } from '../utility';

export const Harpies: Character = {
  ...Mortal,
  desc: `Opponent’s Turn: Each time an opponent’s Worker moves, it is forced space by space in the same
    direction until the next space is at a higher level or it is obstructed.`,

  afterOpponentMove: ({ G, playerID }, charState, oppCharState, fromPos) => {
    const worker = oppCharState.workers[oppCharState.selectedWorkerNum];

    let newPos = oppCharState.workers[oppCharState.selectedWorkerNum].pos;
    let toPos = getNextPosition(fromPos, newPos);

    while (
      toPos !== -1
      && G.spaces[toPos].height <= worker.height
      && !G.spaces[toPos].inhabitant
      && !G.spaces[toPos].isDomed
    ) {
      Board.free(G, worker.pos);
      Board.place(G, toPos, playerID, oppCharState.selectedWorkerNum);

      fromPos = newPos;
      newPos = toPos;
      toPos = getNextPosition(fromPos, newPos);
    }
  },
};
