import { union } from "lodash"
import { Ctx } from "boardgame.io";
import { get_adjacent_positions } from '../utility'
import { Mortal, Character } from '../character'
import { GameState, Player } from '../index'
import { Board } from '../space'

export class Hermes extends Mortal {
  
  public static desc = `Your Turn: If your Workers do not move up or down, they may 
    each move any number of times (even zero), and then either builds`;
  public static buttonText = 'End Move'

  public static attributes = {
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

  public static valid_move(
    G: GameState,
    ctx: Ctx,
    player: Player,
    char: Character,
    originalPos: number
  ) : number[] {

    let adjacents : number[] = get_adjacent_positions(originalPos);
    let valids : number[] = []
        
    if (char.attributes.canMoveUp) {
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
      char.attributes.canMoveUp = false;
      char.attributes.isMoving = true;
      char.buttonText = 'Switch Workers';
      returnStage = 'move';
    }
    else {
      char.attributes.movedUpOrDown = true;
      char.buttonActive = false;
    }

    // free the space that is being moved from
    Board.free(G, char.workers[char.selectedWorker].pos);

    // place the worker on the selected space
    Board.place(G, pos, player.id, char.selectedWorker);

    return returnStage;
  }

  public static valid_build(
    G: GameState, 
    ctx: Ctx,
    player: Player, 
    char: Character,
    originalPos: number
  ) : number[] {
    let valids : number[] = []
    let adjacents : number[] = [];
    
    // normal build
    if (char.attributes.movedUpOrDown) {
      adjacents = get_adjacent_positions(originalPos);
    }

    // special build, within range of either worker
    else {
      for (let i = 0; i < char.numWorkers; i++) {
        // add on the adjacent positions of each worker
        adjacents = union(adjacents, get_adjacent_positions(char.workers[i].pos));
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

    char.attributes.isMoving = false;
    char.attributes.canMoveUp = true;
    char.attributes.movedUpOrDown = false;

    Board.build(G, pos);
    return 'end'
  }

  public static buttonPressed(
    G: GameState, 
    ctx: Ctx,
    player: Player,
    char: Character
  ) : void {

    if (char.attributes.isMoving) {
      char.attributes.isMoving = false;
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