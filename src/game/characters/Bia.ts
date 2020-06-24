import { remove } from 'lodash'
import { Mortal, Character } from '../character'
import { GameState, Player } from '../index'
import { Board } from '../space'
import { Ctx } from 'boardgame.io';

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

    const direction = char.workers[char.selectedWorker].pos - pos
    const pos_to_kill = pos - direction;

    if (pos_to_kill >= 0 || pos_to_kill < 25) {
      if (G.spaces[pos_to_kill].inhabited) {
        if (G.spaces[pos_to_kill].inhabitant.playerId === player.opponentId) {

          // find the opponent worker to remove from their worker array
          G.players[player.opponentId].char.workers.forEach( worker => {
            if (worker.pos === pos_to_kill) {
              // free the space
              Board.free(G, pos_to_kill);
              remove(G.players[player.opponentId].char.workers, worker);

              // check if no workers left and end game if none
              if (G.players[player.opponentId].char.workers.length === 0) {
                ctx.events!.endPhase!();
                G.winner = player.id;
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