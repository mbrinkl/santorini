import { GameContext } from '../../types/GameTypes';
import { getAdjacentPositions, getNextPosition } from '../utility';
import { Character } from '../../types/CharacterTypes';
import { Mortal } from './Mortal';
import { Board } from '../space';

export const Minotaur: Character = {

  ...Mortal,
  desc: `Your Move: Your Worker may move into an opponent Worker’s space, 
    if their Worker can be forced one space straight backwards to an 
    unoccupied space at any level.`,

  validMove: (context, charState, originalPos) => {
    const { G, playerID } = context;
    const { opponentID } = G.players[playerID];

    const adjacents: number[] = getAdjacentPositions(originalPos);
    const valids: number[] = [];

    adjacents.forEach((pos) => {
      if (
        !G.spaces[pos].isDomed
        && G.spaces[pos].height - G.spaces[originalPos].height <= charState.moveUpHeight
      ) {
        if (!G.spaces[pos].inhabitant) {
          valids.push(pos);
        } else if (G.spaces[pos].inhabitant?.playerID !== playerID) {
          const posToPush = getNextPosition(originalPos, pos);
          const opponent = G.players[opponentID];
          const oppContext: GameContext = { ...context, playerID: opponentID };
          if (Mortal.validMove(oppContext, opponent.charState, pos).includes(posToPush)) {
            valids.push(pos);
          }
        }
      }
    });

    return valids;
  },

  move: ({ G, playerID }, charState, pos) => {
    const posToPush = getNextPosition(charState.workers[charState.selectedWorkerNum].pos, pos);
    const { inhabitant } = G.spaces[pos];

    if (inhabitant) {
      Board.place(G, posToPush, inhabitant.playerID, inhabitant.workerNum);
    }

    Board.free(G, charState.workers[charState.selectedWorkerNum].pos);
    Board.place(G, pos, playerID, charState.selectedWorkerNum);

    return 'build';
  },
};
