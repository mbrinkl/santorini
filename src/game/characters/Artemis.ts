import { Ctx } from "boardgame.io";
import { getAdjacentPositions } from '../utility'
import { Mortal, Character } from '../character'
import { GameState, Player } from '../index'
import { Board } from '../space'

interface attrsType {
  numMoves: number,
  prevTile: number,
  newTile: number
}

export class Artemis extends Mortal {
  
  public static desc = `Your Move: Your worker may move one additional time, but not back to
      its initial space.`;

  public static attrs : attrsType = {
      numMoves: 0,
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

    let adjacents : number[] = getAdjacentPositions(originalPos);
    let valids : number[] = []
    
    if (char.selectedWorker !== -1)
      if (char.attrs.numMoves === 0)
        char.attrs.prevTile = char.workers[char.selectedWorker].pos;
      else if (char.selectedWorker !== -1)
        char.attrs.newTile = char.workers[char.selectedWorker].pos;
  
    adjacents.forEach( pos => {
      if (!G.spaces[pos].inhabited && !G.spaces[pos].is_domed &&
        G.spaces[pos].height - G.spaces[originalPos].height <= char.moveUpHeight
        )
      {
        valids.push(pos);

        if (char.attrs.prevTile !== -1 && valids.includes(char.attrs.prevTile))
        {
          const index: number = valids.indexOf(char.attrs.prevTile);
          valids.splice(index, 1);
        }

        if (char.attrs.newTile !== -1)
          valids.push(char.attrs.newTile)
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

      char.attrs.numMoves++;
  
      // free the space that is being moved from
      Board.free(G, char.workers[char.selectedWorker].pos);

      // place the worker on the selected space
      Board.place(G, pos, player.id, char.selectedWorker);

      if (char.attrs.numMoves === 2) {
        char.attrs.numMoves = 0;
        char.attrs.prevTile = -1;
        char.attrs.newTile = -1;
        return 'build';
      }
      else
          return 'move'
  }
}