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

  validMove: (context, char, originalPos) => {
    const { G, playerID } = context;
    const opponentID = G.players[playerID].opponentId;

    const adjacents: number[] = getAdjacentPositions(originalPos);
    const valids: number[] = [];

    adjacents.forEach((pos) => {
      if (
        !G.spaces[pos].isDomed
        && G.spaces[pos].height - G.spaces[originalPos].height <= char.moveUpHeight
      ) {
        if (!G.spaces[pos].inhabitant) {
          valids.push(pos);
        } else if (G.spaces[pos].inhabitant?.playerId !== playerID) {
          const posToPush = getNextPosition(originalPos, pos);
          const opponent = G.players[opponentID];
          const oppContext: GameContext = { ...context, playerID: opponentID };
          if (Mortal.validMove(oppContext, opponent.char, pos).includes(posToPush)) {
            valids.push(pos);
          }
        }
      }
    });

    return valids;
  },

  move: ({ G, playerID }, char, pos) => {
    const posToPush = getNextPosition(char.workers[char.selectedWorkerNum].pos, pos);
    const { inhabitant } = G.spaces[pos];

    if (inhabitant) {
      Board.place(G, posToPush, inhabitant.playerId, inhabitant.workerNum);
    }

    Board.free(G, char.workers[char.selectedWorkerNum].pos);
    Board.place(G, pos, playerID, char.selectedWorkerNum);

    return 'build';
  },
};
