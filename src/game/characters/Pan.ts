import { Mortal } from '.'
import { GameState } from '../index'

export class Pan extends Mortal {
  
  public static desc = `Win Condition: You also win if your Worker moves down two or more levels.`;

  public static checkWinByMove(G: GameState, heightBefore: number, heightAfter: number) : boolean {
    return (heightBefore < 3 && heightAfter === 3) ||
      (heightBefore - heightAfter > 1)
  }
}