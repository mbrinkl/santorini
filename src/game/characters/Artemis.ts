import { Ctx } from "boardgame.io";
import { get_adjacent_positions } from '../utility'
import { Mortal, Character } from '../character'
import { GameState, Player } from '../index'
import { Board } from '../space'

export class Artemis extends Mortal {
  
  public static desc = `Your Move: Your worker may move one additional time, but not back to
      its initial space.`;

  public static attributes = {
      numberOfMoves: 0,
      prevTile: -1,
      newTile: -1
  };

  public static valid_move(
    G: GameState,
    ctx: Ctx,
    player: Player,
    char: Character,
    originalPos: number
  ) : number[] {

    let adjacents : number[] = get_adjacent_positions(originalPos);
    let valids : number[] = []
    
    if (char.selectedWorker !== -1)
      if (char.attributes.numberOfMoves === 0)
        char.attributes.prevTile = char.workers[char.selectedWorker].pos;
      else if (char.selectedWorker !== -1)
        char.attributes.newTile = char.workers[char.selectedWorker].pos;
  
    adjacents.forEach( pos => {
      if (!G.spaces[pos].inhabited && !G.spaces[pos].is_domed &&
        G.spaces[pos].height - G.spaces[originalPos].height <= char.moveUpHeight
        )
      {
        valids.push(pos);

        if (char.attributes.prevTile !== -1 && valids.includes(char.attributes.prevTile))
        {
          const index: number = valids.indexOf(char.attributes.prevTile);
          valids.splice(index, 1);
        }

        if (char.attributes.newTile !== -1)
          valids.push(char.attributes.newTile)
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

      char.attributes.numberOfMoves++;
  
      // free the space that is being moved from
      Board.free(G, char.workers[char.selectedWorker].pos);

      // place the worker on the selected space
      Board.place(G, pos, player.id, char.selectedWorker);

      if (char.attributes.numberOfMoves === 2) {
        Artemis.reset(char);
        return 'build';
      }
      else
          return 'move'
  }

  private static reset(char: Character) {
    char.attributes.numberOfMoves = 0;
    char.attributes.prevTile = -1;
    char.attributes.newTile = -1;
  }
}