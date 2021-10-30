import { Ctx } from "boardgame.io";
import { getAdjacentPositions } from '../utility'
import { Character } from ".";
import { Mortal } from "./Mortal";
import { GameState, Player } from '../index'
import { Board } from '../space'

interface attrsType {
  specialActive: boolean,
  specialUsed: boolean,
  originalPos: number
}

export class Prometheus extends Mortal {
  
  public static desc = `Your Turn: If your Worker does not move up, it may build both before and after moving.`;
  public static buttonText = 'Bulid Before Move'
  // public static buttonActive = true;

  public static attrs: attrsType = {
      specialActive: false,
      specialUsed: false,
      originalPos: -1,
  };

  public static onTurnBegin(
    G: GameState, 
    ctx: Ctx,
    player: Player, 
    char: Character
  ) : void {
    char.buttonActive = true;
  }

  public static select(
    G: GameState, 
    ctx: Ctx,
    player: Player, 
    char: Character,
    pos: number
  ) : string {
    char.selectedWorker = G.spaces[pos].inhabitant.workerNum;
    if (char.attrs.specialActive)
      return 'build';
    else
      return 'move';
  }

  public static validMove(
    G: GameState,
    ctx: Ctx,
    player: Player,
    char: Character,
    originalPos: number
  ) : number[] {
        
    let height = (char.attrs.specialUsed ? 0 : char.moveUpHeight)
    if (char.attrs.specialUsed) {
      originalPos = char.attrs.originalPos;
    }

    let adjacents : number[] = getAdjacentPositions(originalPos);
    let valids : number[] = []

    adjacents.forEach( pos => {
      if (!G.spaces[pos].inhabited &&
        !G.spaces[pos].is_domed &&
        G.spaces[pos].height - G.spaces[originalPos].height <= height
        )
      {
        valids.push(pos);
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

      char.buttonActive = false;
  
      // free the space that is being moved from
      Board.free(G, char.workers[char.selectedWorker].pos);

      // place the worker on the selected space
      Board.place(G, pos, player.id, char.selectedWorker);

      return 'build';
  }

  public static build (
    G: GameState,
    ctx: Ctx,
    player: Player, 
    char: Character,
    pos: number
  ) : string {
    Board.build(G, pos);

    if (char.attrs.specialActive) {
      char.attrs.specialUsed = true;
      char.attrs.originalPos = char.workers[char.selectedWorker].pos;

      char.buttonActive = false;
      char.attrs.specialActive = false;
      char.buttonText = 'Build Before Move';

      return 'move';
    }
    else {
      char.attrs.specialUsed = false;
      char.attrs.originalPos = -1;
      return 'end';
    }
  }

  public static buttonPressed(
    G: GameState, 
    ctx: Ctx,
    player: Player,
    char: Character
  ) : string {
    char.attrs.specialActive = !char.attrs.specialActive;

    const stage = ctx.activePlayers![ctx.currentPlayer];

    if (char.attrs.specialActive) {
      char.buttonText = 'Cancel';
      if (stage === 'move')
        return 'build';
    }
    else {
      char.buttonText = 'Build Before Move';
      if (stage === 'build')
        return 'move';
    }

    return super.buttonPressed(G, ctx, player, char);
  }
}