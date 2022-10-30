import Mortal from './Mortal';
import { Character } from '../../types/characterTypes';
import { Board } from '../boardUtil';
import { getNextPosition } from '../posUtil';

const Harpies: Character = {
  ...Mortal,
  data: {
    ...Mortal.data,
    desc: [
      `Opponent’s Turn: Each time an opponent’s Worker moves,
        it is forced space by space in the same direction until
        the next space is at a higher level or it is obstructed.`,
    ],
    pack: 'gf',
  },

  afterOpponentMove: (context, charState, oppCharState, fromPos) => {
    const { G, playerID } = context;
    const worker = oppCharState.workers[oppCharState.selectedWorkerNum];

    let newPos = oppCharState.workers[oppCharState.selectedWorkerNum].pos;
    let toPos = getNextPosition(fromPos, newPos);

    while (
      toPos !== -1 &&
      G.spaces[toPos].height <= worker.height &&
      !Board.isObstructed(G, playerID, toPos)
    ) {
      Board.free(context, worker.pos);
      Board.place(context, toPos, playerID, oppCharState.selectedWorkerNum);

      fromPos = newPos;
      newPos = toPos;
      toPos = getNextPosition(fromPos, newPos);
    }
  },
};

export default Harpies;
