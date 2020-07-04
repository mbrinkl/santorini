import { Ctx } from "boardgame.io";
import { getAdjacentPositions, getNextPosition } from '../utility'
import { Mortal, Character } from '.'
import { GameState, Player } from '../index'
import { Board } from '../space'

export class Minotaur extends Mortal {
  
  public static desc = `Your Move: Your Worker may move into an opponent Worker’s space, 
    if their Worker can be forced one space straight backwards to an 
    unoccupied space at any level.`;

  public static validMove(
    G: GameState,
    ctx: Ctx,
    player: Player,
    char: Character,
    originalPos: number
  ) : number[] {

    let adjacents : number[] = getAdjacentPositions(originalPos);
    let valids : number[] = []
  
    adjacents.forEach( pos => {

      if (!G.spaces[pos].is_domed && G.spaces[pos].height - G.spaces[originalPos].height <= char.moveUpHeight) {
        
        if (!G.spaces[pos].inhabited) {
          valids.push(pos);
        } 
        else if (G.spaces[pos].inhabitant.playerId !== player.id) {
          let posToPush = getNextPosition(originalPos, pos);
          let opponent = G.players[player.opponentId];
          if ( super.validMove(G, ctx, opponent, opponent.char, pos).includes(posToPush)) {
            valids.push(pos);
          }
        }
      }
    })
  
    return valids;
  }

  public static move (
    G: GameState, 
    ctx: Ctx,
    player: Player,
    char: Character, 
    pos: number
  ) : string {

    let posToPush = getNextPosition(char.workers[char.selectedWorker].pos, pos);

    if (G.spaces[pos].inhabited) {
      Board.place(G, posToPush, G.spaces[pos].inhabitant.playerId, G.spaces[pos].inhabitant.workerNum);
    }

    Board.free(G, char.workers[char.selectedWorker].pos);
    Board.place(G, pos, player.id, char.selectedWorker);

    return "build"
  }
}