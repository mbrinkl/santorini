import { union } from 'lodash';
import { getAdjacentPositions } from '../utility';
import { Character } from ".";
import { Mortal } from "./Mortal";
import { GameState, Player } from '../index';
import { Board } from '../space';
import { Ctx } from 'boardgame.io';

interface attrsType {
  specialActive: boolean,
  specialUsed: boolean,
  numBuilds: number
}

export class Heracles extends Mortal {

  public static desc = `End of Your Turn: Once, both your Workers build any number 
    of domes (even zero) at any level.`;
  public static buttonText = `Build Domes`;
  public static attrs: attrsType = {
    specialActive: false,
    specialUsed: false,
    numBuilds: 0
  };

  public static buttonPressed(
    G: GameState, 
    ctx: Ctx,
    player: Player,
    char: Character
  ) : void {
    char.attrs.specialActive = !char.attrs.specialActive;
    
    if (char.attrs.specialUsed) {
      // reset stuff
      char.buttonActive = false;
      char.attrs.specialActive = false;
      char.buttonText = 'Build Domes';

      //set game stage
      G.stage = 'end'
      G.canEndTurn = true;
    }
    else if (char.attrs.specialActive) {
      char.buttonText = 'Cancel';
    }
    else {
      char.buttonText = 'Build Domes';
    }
  }

  public static move (
    G: GameState, 
    ctx: Ctx,
    player: Player, 
    char: Character, 
    pos: number
  ) : string {

    if (!char.attrs.specialUsed) {
      char.attrs.numBuilds = 0;
      char.buttonActive = true;
    }
    return super.move(G, ctx, player, char, pos);
  }

  public static validBuild(
    G: GameState, 
    ctx: Ctx,
    player: Player, 
    char: Character,
    originalPos: number
  ) : number[] {

    if (!char.attrs.specialActive) {
      return super.validBuild(G, ctx, player, char, originalPos);
    }
    else {
      let valids: number[] = [];
      let adjacents: number[] = [];

      for (let i = 0; i < char.numWorkers; i++) {
        // add on the adjacent positions of each worker
        adjacents = union(adjacents, getAdjacentPositions(char.workers[i].pos));
      }

      adjacents.forEach( pos => {
        if (!G.spaces[pos].inhabited && !G.spaces[pos].is_domed) {
          valids.push(pos);
        }
      })
  
      return valids;
    }  
  }

  public static build (
    G: GameState,
    ctx: Ctx,
    player: Player, 
    char: Character,
    pos: number
  ) : string {

    if (char.attrs.specialActive) {
      char.attrs.specialUsed = true;
      char.buttonText = 'End Build';
      char.attrs.numBuilds++;
      G.spaces[pos].is_domed = true;

      if (super.hasValidBuild(G, ctx, player, char)) {
        return 'build';
      }
    } 
    else {
      Board.build(G, pos);
    }

    char.buttonActive = false;
    char.attrs.specialActive = false;
    char.buttonText = 'Build Domes';
    return 'end';
  }
}