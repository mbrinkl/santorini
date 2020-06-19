import { Ctx } from "boardgame.io";
import { get_adjacent_positions } from '../utility'
import { Mortal, Character } from '../character'
import { GameState, Player } from '../index'
import { Board } from '../space'

export class Minotaur extends Mortal {
  
  public static desc = `Your Move: Your Worker may move into an opponent Worker’s space, 
    if their Worker can be forced one space straight backwards to an 
    unoccupied space at any level.`;

  public static valid_move(
    G: GameState,
    ctx: Ctx,
    player: Player,
    char: Character,
    originalPos: number
  ) : number[] {

    let adjacents : number[] = get_adjacent_positions(originalPos);
    let valids : number[] = []
  
    adjacents.forEach( pos => {

      if (!G.spaces[pos].is_domed && G.spaces[pos].height - G.spaces[originalPos].height <= char.moveUpHeight) {
        
        if (!G.spaces[pos].inhabited) {
          valids.push(pos);
        } 
        else if (G.spaces[pos].inhabitant.playerId !== player.id && char.selectedWorker !== -1) {
          // TODO: potential wrong end game check if a block is detected [not checking by selected worker]
          let direction = char.workers[char.selectedWorker].pos - pos;
          let pos_to_push = pos - direction;
          let opponent = G.players[player.opponentId];
          if ( super.valid_move(G, ctx, opponent, opponent.char, pos).includes(pos_to_push)) {
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

    // subtract 2nd (moved to) value from 1st (moved from) value
    // directions = { 5 : 'N', 4 : 'NE', -1 : 'E', -6 : 'SE', -5 : 'S', -4 : 'SW', 1 : 'W', 6 : 'NW'}
    let direction = char.workers[char.selectedWorker].pos - pos;
    let pos_to_push = pos - direction;

    if (G.spaces[pos].inhabited) {
      Board.place(G, pos_to_push, G.spaces[pos].inhabitant.playerId, G.spaces[pos].inhabitant.workerNum);
    }

    Board.free(G, char.workers[char.selectedWorker].pos);
    Board.place(G, pos, player.id, char.selectedWorker);

    return "build"
  }
}