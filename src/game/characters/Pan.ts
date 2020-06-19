import { Mortal } from '../character'
import { GameState } from '../index'

export class Pan extends Mortal {
  
  public static desc = `Win Condition: You also win if your Worker moves down two or more levels.`;

  public static check_win_by_move(G: GameState, beforeHeight: number, afterHeight: number) : boolean {
    return (beforeHeight < 3 && afterHeight === 3) ||
      (beforeHeight - afterHeight > 1)
  }
}