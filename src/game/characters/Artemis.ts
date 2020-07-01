import { Ctx } from "boardgame.io";
import { getAdjacentPositions } from '../utility'
import { Mortal, Character } from '../character'
import { GameState, Player } from '../index'
import { Board } from '../space'

interface attrsType {
  numMoves: number,
  prevTile: number,
}

export class Artemis extends Mortal {
  
  public static desc = `Your Move: Your worker may move one additional time, but not back to
      its initial space.`;
  public static buttonText = 'End Move';

  public static attrs : attrsType = {
      numMoves: 0,
      prevTile: -1,
  };

  public static valid_move(
    G: GameState,
    ctx: Ctx,
    player: Player,
    char: Character,
    originalPos: number
  ) : number[] {

    let adjacents : number[] = getAdjacentPositions(originalPos);
    let valids : number[] = [];
    
    if (char.selectedWorker !== -1 && char.attrs.numMoves === 0)
      char.attrs.prevTile = char.workers[char.selectedWorker].pos;
  
    adjacents.forEach( pos => {
      if (!G.spaces[pos].inhabited && !G.spaces[pos].is_domed &&
        G.spaces[pos].height - G.spaces[originalPos].height <= char.moveUpHeight
        )
      {
        if (char.attrs.prevTile !== pos)
          valids.push(pos);
      }
    });
  
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
      char.buttonActive = false;
      return 'build';
    }
    else {
      char.buttonActive = true;
      return 'move'
    }
  }

  public static buttonPressed(
    G: GameState, 
    ctx: Ctx,
    player: Player,
    char: Character
  ) : void {
    G.stage = 'build';
    char.buttonActive = false;
  }
}