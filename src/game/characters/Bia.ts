import { tryEndGame } from '../winConditions';
import { Character } from '../../types/CharacterTypes';
import { Mortal } from './Mortal';
import { Board } from '../space';
import { getNextPosition, getPerimeterPositions } from '../utility';

export const Bia: Character = {
  ...Mortal,
  desc: `Setup: Place your Workers first. Your Workers must be placed in perimeter spaces.
    Your Move: If your Worker moves into a space and the next space in the same direction is 
    occupied by an opponent Worker, the opponent’s Worker is removed from the game.`,
  firstTurnRequired: true,

  validPlace: ({ G }, charState) => {
    const valids = new Set<number>();

    getPerimeterPositions().forEach((pos) => {
      if (!G.spaces[pos].inhabitant && charState.numWorkersToPlace > 0) {
        valids.add(pos);
      }
    });

    return valids;
  },

  move: (context, charState, pos) => {
    const { G, playerID } = context;
    const { opponentID } = G.players[playerID];
    const opponentCharState = G.players[opponentID].charState;
    const posToKill = getNextPosition(charState.workers[charState.selectedWorkerNum].pos, pos);

    if (posToKill !== -1
      && G.spaces[posToKill].inhabitant
      && G.spaces[posToKill].inhabitant?.playerID === opponentID
    ) {
      // Find the opponent worker to remove from their worker array
      const worker = opponentCharState.workers.find((w) => w.pos === posToKill);

      if (worker) {
        // Free the space
        Board.free(G, posToKill);

        // Remove the worker from opponent character's state
        const index = opponentCharState.workers.indexOf(worker);
        if (index > -1) {
          opponentCharState.workers.splice(index, 1);
        }

        // Check if no workers left and end game if none
        if (opponentCharState.workers.length === 0) {
          tryEndGame(context, playerID);
        } else {
          // Otherwise, iterate opponent workers and update worker numbers
          let workerNum = 0;
          G.players[opponentID].charState.workers.forEach((w) => {
            G.spaces[w.pos].inhabitant = {
              playerID: opponentID,
              workerNum,
            };
            workerNum += 1;
          });
        }
      }
    }

    Mortal.move(context, charState, pos);
  },
};
