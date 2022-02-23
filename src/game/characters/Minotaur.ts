import { GameContext } from '../../types/gameTypesTemp';
import { getAdjacentPositions, getNextPosition } from '../posUtil';
import { Character } from '../../types/characterTypesTemp';
import { Mortal } from './Mortal';
import { Board } from '../boardUtil';

export const Minotaur: Character = {
  ...Mortal,

  data: {
    ...Mortal.data,
    desc: [
      `Your Move: Your Worker may move into an opponent Worker’s space, 
        if their Worker can be forced one space straight backwards to an 
        unoccupied space at any level.`,
    ],
    pack: 'simple',
  },

  validMove: (context, charState, originalPos) => {
    const { G, playerID } = context;
    const { opponentID } = G.players[playerID];

    const adjacents: number[] = getAdjacentPositions(originalPos);
    const valids = new Set<number>();

    adjacents.forEach((pos) => {
      if (
        !G.spaces[pos].isDomed &&
        !Board.tokenObstructing(G, playerID, pos) &&
        G.spaces[pos].height - G.spaces[originalPos].height <=
          charState.moveUpHeight
      ) {
        if (!G.spaces[pos].inhabitant) {
          valids.add(pos);
        } else if (G.spaces[pos].inhabitant?.playerID !== playerID) {
          const posToPush = getNextPosition(originalPos, pos);
          const opponent = G.players[opponentID];
          const oppContext: GameContext = { ...context, playerID: opponentID };
          if (
            Mortal.validMove(oppContext, opponent.charState, pos).has(posToPush)
          ) {
            valids.add(pos);
          }
        }
      }
    });

    return valids;
  },

  move: (context, charState, pos) => {
    const { G, playerID } = context;
    const posToPush = getNextPosition(
      charState.workers[charState.selectedWorkerNum].pos,
      pos,
    );
    const { inhabitant } = G.spaces[pos];

    if (inhabitant) {
      Board.place(
        context,
        posToPush,
        inhabitant.playerID,
        inhabitant.workerNum,
      );
    }

    Board.free(context, charState.workers[charState.selectedWorkerNum].pos);
    Board.place(context, pos, playerID, charState.selectedWorkerNum);
  },
};
