import { remove } from 'lodash'
import { Mortal, Character } from '.'
import { GameState, Player } from '../index'
import { Board } from '../space'
import { Ctx } from 'boardgame.io';
import { getNextPosition } from '../utility';

export class Bia extends Mortal {

  public static desc = `Setup: Place your Workers first.\n Your Move: If your Worker moves into a space and the next space in the same direction is 
    occupied by an opponent Worker, the opponent’s Worker is removed from the game.`;

  public static move (
    G: GameState, 
    ctx: Ctx,
    player: Player,
    char: Character, 
    pos: number
  ) : string {

    const posToKill = getNextPosition(char.workers[char.selectedWorker].pos, pos);

    if (posToKill !== -1) {
      if (G.spaces[posToKill].inhabited) {
        if (G.spaces[posToKill].inhabitant.playerId === player.opponentId) {

          // find the opponent worker to remove from their worker array
          G.players[player.opponentId].char.workers.forEach( worker => {
            if (worker.pos === posToKill) {
              // free the space
              Board.free(G, posToKill);
              remove(G.players[player.opponentId].char.workers, worker);
              G.players[player.opponentId].char.numWorkers--;

              // check if no workers left and end game if none
              if (G.players[player.opponentId].char.workers.length === 0) {
                ctx.events!.endGame!({
                  winner: player.id
                })
              }
              // otherwise, check to make sure values referring to the worker array are still correct
              else {
                let index = 0;
                G.players[player.opponentId].char.workers.forEach( worker => {
                  G.spaces[worker.pos].inhabitant.workerNum = index++;
                });
              }
            }
          });
        }
      }
    }

    return super.move(G, ctx, player, char, pos);
  }
}