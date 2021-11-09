import { Ctx } from 'boardgame.io';
import { Character, CharacterState } from '../../types/CharacterTypes';
import { Mortal } from './Mortal';
import { GameState, Player } from '../../types/GameTypes';
import { Board } from '../space';
import { getNextPosition } from '../utility';

export const Bia: Character = {
  ...Mortal,
  desc: `Setup: Place your Workers first.\n Your Move: If your Worker moves into a space and the next space in the same direction is 
    occupied by an opponent Worker, the opponent’s Worker is removed from the game.`,

  move: (
    G: GameState,
    ctx: Ctx,
    player: Player,
    char: CharacterState,
    pos: number,
  ) => {
    const posToKill = getNextPosition(char.workers[char.selectedWorker].pos, pos);

    if (posToKill !== -1) {
      if (G.spaces[posToKill].inhabited) {
        if (G.spaces[posToKill].inhabitant.playerId === player.opponentId) {
          // find the opponent worker to remove from their worker array
          G.players[player.opponentId].char.workers.forEach((worker) => {
            if (worker.pos === posToKill) {
              // free the space
              Board.free(G, posToKill);
              const index = G.players[player.opponentId].char.workers.indexOf(worker);
              if (index > -1) {
                G.players[player.opponentId].char.workers.splice(index, 1);
              }
              G.players[player.opponentId].char.numWorkers -= 1;

              // check if no workers left and end game if none
              if (G.players[player.opponentId].char.workers.length === 0) {
                ctx.events?.endGame({
                  winner: player.id,
                });
              } else {
                // otherwise, make sure values referring to the worker array are still correct
                let workerNum = 0;
                G.players[player.opponentId].char.workers.forEach((w) => {
                  G.spaces[w.pos].inhabitant.workerNum = workerNum;
                  workerNum += 1;
                });
              }
            }
          });
        }
      }
    }

    return Mortal.move(G, ctx, player, char, pos);
  },
};
