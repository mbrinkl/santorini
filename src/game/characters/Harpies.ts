import { Mortal } from './Mortal';
import { Character } from '../../types/CharacterTypes';
import { Board } from '../space';
import { getNextPosition } from '../utility';

export const Harpies: Character = {
  ...Mortal,
  desc: `Opponent’s Turn: Each time an opponent’s Worker moves, it is forced space by space in the same
    direction until the next space is at a higher level or it is obstructed.`,
  // banned ['Hermes', 'Triton']

  opponentPostMove: ({ G, playerID }, charState, pos) => {
    const worker = charState.workers[charState.selectedWorkerNum];

    let originalPos = pos;
    let newPos = charState.workers[charState.selectedWorkerNum].pos;
    let toPos = getNextPosition(originalPos, newPos);

    while (
      toPos !== -1
      && G.spaces[toPos].height <= worker.height
      && !G.spaces[toPos].inhabitant
      && !G.spaces[toPos].isDomed
    ) {
      Board.free(G, worker.pos);
      Board.place(G, toPos, playerID, charState.selectedWorkerNum);

      originalPos = newPos;
      newPos = toPos;
      toPos = getNextPosition(originalPos, newPos);
    }
  },
};
