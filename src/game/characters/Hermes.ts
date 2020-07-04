import { union } from "lodash"
import { Ctx } from "boardgame.io";
import { getAdjacentPositions } from '../utility'
import { Mortal, Character } from '.'
import { GameState, Player } from '../index'
import { Board } from '../space'

interface attrsType {
  movedUpOrDown: boolean,
  isMoving: boolean,
  canMoveUp: boolean
}

export class Hermes extends Mortal {
  
  public static desc = `Your Turn: If your Workers do not move up or down, they may 
    each move any number of times (even zero), and then either builds`;
  public static buttonText = 'End Move'

  public static attrs: attrsType = {
    movedUpOrDown: false,
    isMoving: false,
    canMoveUp: true
  };

  public static onTurnBegin(
    G: GameState, 
    ctx: Ctx,
    player: Player, 
    char: Character
  ) : void {
    char.buttonActive = true;
  }

  public static validMove(
    G: GameState,
    ctx: Ctx,
    player: Player,
    char: Character,
    originalPos: number
  ) : number[] {

    let adjacents : number[] = getAdjacentPositions(originalPos);
    let valids : number[] = []
        
    if (char.attrs.canMoveUp) {
      adjacents.forEach( pos => {
        if (!G.spaces[pos].inhabited && !G.spaces[pos].is_domed &&
          G.spaces[pos].height - G.spaces[originalPos].height <= char.moveUpHeight
        ) {
          valids.push(pos);
        }
      })
    }
    else {
      adjacents.forEach( pos => {
        if (!G.spaces[pos].inhabited && !G.spaces[pos].is_domed &&
          G.spaces[pos].height === G.spaces[originalPos].height
        ) {
          valids.push(pos);
        }
      })
    }
  
    return valids;
  }

  public static move (
    G: GameState, 
    ctx: Ctx,
    player: Player,
    char: Character, 
    pos: number
  ) : string {

    let returnStage = 'build';

    if (G.spaces[pos].height === char.workers[char.selectedWorker].height) {
      char.attrs.canMoveUp = false;
      char.attrs.isMoving = true;
      char.buttonText = 'Switch Workers';
      returnStage = 'move';
    }
    else {
      char.attrs.movedUpOrDown = true;
      char.buttonActive = false;
    }

    // free the space that is being moved from
    Board.free(G, char.workers[char.selectedWorker].pos);

    // place the worker on the selected space
    Board.place(G, pos, player.id, char.selectedWorker);

    return returnStage;
  }

  public static validBuild(
    G: GameState, 
    ctx: Ctx,
    player: Player, 
    char: Character,
    originalPos: number
  ) : number[] {
    let valids : number[] = []
    let adjacents : number[] = [];
    
    // normal build
    if (char.attrs.movedUpOrDown) {
      adjacents = getAdjacentPositions(originalPos);
    }

    // special build, within range of either worker
    else {
      for (let i = 0; i < char.numWorkers; i++) {
        // add on the adjacent positions of each worker
        adjacents = union(adjacents, getAdjacentPositions(char.workers[i].pos));
      }
    }
  
    adjacents.forEach( pos => {
      if (!G.spaces[pos].inhabited && !G.spaces[pos].is_domed) {
        valids.push(pos);
      }
    })

    return valids;
  }

  public static build (
    G: GameState,
    ctx: Ctx,
    player: Player, 
    char: Character,
    pos: number
  ) : string {

    char.attrs.isMoving = false;
    char.attrs.canMoveUp = true;
    char.attrs.movedUpOrDown = false;

    Board.build(G, pos);
    return 'end'
  }

  public static buttonPressed(
    G: GameState, 
    ctx: Ctx,
    player: Player,
    char: Character
  ) : void {

    if (char.attrs.isMoving) {
      char.attrs.isMoving = false;
      char.buttonText = 'End Move';
      // change the selected worker
      if (char.workers.length > 1)
        char.selectedWorker = (char.selectedWorker + 1) % 2;
    }
    else {
      char.buttonActive = false;
      if (char.selectedWorker === -1) {
        char.selectedWorker = 0;
      }
      G.stage = 'build';
    }
  }
}