import { Mortal, Character } from '.'
import { getAdjacentPositions } from '../utility'
import { GameState, Player } from '../index'
import { Board } from '../space'
import { Ctx } from 'boardgame.io';

interface attrsType {
  numBuilds: number,
  firstBuildPos: number,
}

export class Demeter extends Mortal {

  public static desc = `Your Build: Your worker may build one additional time, but not on the same space.`;
  public static buttonText = 'Skip 2nd Build';
  public static attrs: attrsType = {
    numBuilds: 0,
    firstBuildPos: -1,
  };

  public static buttonPressed(
    G: GameState, 
    ctx: Ctx,
    player: Player,
    char: Character
  ) : void {
    // reset stuff
    char.attrs.numBuilds = 0;
    char.buttonActive = false;
  
    // set game stage
    G.stage = 'end';
    G.canEndTurn = true;
  }


  public static validBuild(
    G: GameState, 
    ctx: Ctx,
    player: Player, 
    char: Character,
    originalPos: number
  ) : number[] {
    let adjacents : number[] = getAdjacentPositions(originalPos);
    let valids : number[] = []
  
    if (char.attrs.numBuilds === 0) {
      adjacents.forEach( pos => {
        if (!G.spaces[pos].inhabited && !G.spaces[pos].is_domed) {
          valids.push(pos);
        }
      })
    }
    else {
      adjacents.forEach( pos => {
        if (!G.spaces[pos].inhabited && !G.spaces[pos].is_domed && pos !== char.attrs.firstBuildPos) {
          valids.push(pos);
        }
      })
    }
  
    return valids;
  }

  public static build (
    G: GameState,
    ctx: Ctx,
    player: Player, 
    char: Character,
    pos: number
  ) : string { 

    char.attrs.numBuilds++;

    if (char.attrs.numBuilds === 1) {
      char.attrs.firstBuildPos = pos;
      Board.build(G, pos);
      char.buttonActive = true;
      return 'build'
    }
    else {
      char.attrs.numBuilds = 0;
      char.buttonActive = false;
      Board.build(G, pos);
      return 'end'
    }
  }
}
