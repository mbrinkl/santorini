import { Mortal } from '.'
import { GameState } from '../index'

export class Pegasus extends Mortal {
  
  public static desc = `Your Move: Your Worker may move up more than one level, but cannot win the game by doing so.`;
  public static moveUpHeight = 3;

  public static checkWinByMove(G: GameState, heightBefore: number, heightAfter: number) : boolean {
    return (heightBefore === 2 && heightAfter === 3)
  }
}