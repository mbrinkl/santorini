import { Mortal } from '../character'
import { GameState } from '../index'

export class Pegasus extends Mortal {
  
  public static desc = `Your Move: Your Worker may move up more than one level, but cannot win the game by doing so.`;
  public static moveUpHeight = 3;

  public static check_win_by_move(G: GameState, beforeHeight: number, afterHeight: number) : boolean {
    return (beforeHeight === 2 && afterHeight === 3)
  }
}