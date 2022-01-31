import { Character } from '../../types/CharacterTypes';
import { Mortal } from './Mortal';
import { Board } from '../space';
import { getNextPosition } from '../utility';

export const Bia: Character = {
  ...Mortal,
  desc: `Setup: Place your Workers first.\n Your Move: If your Worker moves into a space and the next space in the same direction is 
    occupied by an opponent Worker, the opponent’s Worker is removed from the game.`,

  move: (context, char, pos) => {
    const { G, playerID, events } = context;
    const opponentID = G.players[playerID].opponentId;
    const posToKill = getNextPosition(char.workers[char.selectedWorkerNum].pos, pos);

    if (posToKill !== -1) {
      if (G.spaces[posToKill].inhabitant) {
        if (G.spaces[posToKill].inhabitant?.playerId === opponentID) {
          // find the opponent worker to remove from their worker array
          G.players[opponentID].char.workers.forEach((worker) => {
            if (worker.pos === posToKill) {
              // free the space
              Board.free(G, posToKill);
              const index = G.players[opponentID].char.workers.indexOf(worker);
              if (index > -1) {
                G.players[opponentID].char.workers.splice(index, 1);
              }

              // check if no workers left and end game if none
              if (G.players[opponentID].char.workers.length === 0) {
                events.endGame({
                  winner: playerID,
                });
              } else {
                // otherwise, make sure values referring to the worker array are still correct
                let workerNum = 0;
                G.players[opponentID].char.workers.forEach((w) => {
                  G.spaces[w.pos].inhabitant = {
                    playerId: opponentID,
                    workerNum,
                  };
                  workerNum += 1;
                });
              }
            }
          });
        }
      }
    }

    return Mortal.move(context, char, pos);
  },
};
