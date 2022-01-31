import { Mortal } from './Mortal';
import { Character } from '../../types/CharacterTypes';
import { Board } from '../space';
import { getNextPosition } from '../utility';

export const Harpies: Character = {
  ...Mortal,
  desc: `Opponent’s Turn: Each time an opponent’s Worker moves, it is forced space by space in the same
    direction until the next space is at a higher level or it is obstructed.`,
  // banned ['Hermes', 'Triton']

  opponentPostMove: ({ G, playerID }, char, pos) => {
    const worker = char.workers[char.selectedWorkerNum];

    let originalPos = pos;
    let newPos = char.workers[char.selectedWorkerNum].pos;
    let toPos = getNextPosition(originalPos, newPos);

    while (
      toPos !== -1
      && G.spaces[toPos].height <= worker.height
      && !G.spaces[toPos].inhabitant
      && !G.spaces[toPos].isDomed
    ) {
      Board.free(G, worker.pos);
      Board.place(G, toPos, playerID, char.selectedWorkerNum);

      originalPos = newPos;
      newPos = toPos;
      toPos = getNextPosition(originalPos, newPos);
    }
  },
};
