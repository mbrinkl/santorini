import { Mortal } from '../character'
import { Ctx } from 'boardgame.io';
import { Board } from '../space'
import { posIsPerimeter } from '../utility';
import { Character } from '../character'
import { GameState, Player } from '../index'

export class Triton extends Mortal {
  
  public static desc = `Your Move: Each time your Worker moves into a perimeter space, it may immediately move again.`;
  public static buttonText = 'End Move';

  public static move (
    G: GameState, 
    ctx: Ctx,
    player: Player,
    char: Character, 
    pos: number
  ) : string {

    let returnStage = 'build';

    if (posIsPerimeter(pos)) {
      char.buttonActive = true;
      returnStage = 'move';
    }
    else {
      char.buttonActive = false;
    }

    // free the space that is being moved from
    Board.free(G, char.workers[char.selectedWorker].pos);

    // place the worker on the selected space
    Board.place(G, pos, player.id, char.selectedWorker);

    return returnStage;
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