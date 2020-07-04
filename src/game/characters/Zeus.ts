import { Mortal } from '.'
import { Ctx } from 'boardgame.io';
import { Character } from '.'
import { GameState, Player } from '../index'

export class Zeus extends Mortal {
  
  public static desc = `Your Build: Your Worker may build a block under itself.`;

  public static checkWinByMove(G: GameState, heightBefore: number, heightAfter: number) : boolean {
    return (heightBefore < 3 && heightAfter === 3) ||
      (heightBefore - heightAfter > 1)
  }

  public static validBuild(
    G: GameState, 
    ctx: Ctx,
    player: Player, 
    char: Character,
    originalPos: number
  ) : number[] {

    let valids: number[] = super.validBuild(G, ctx, player, char, originalPos);

    if (char.workers[char.selectedWorker].height < 3)
      valids.push(char.workers[char.selectedWorker].pos);
  
    return valids;
  }

  public static build (
    G: GameState,
    ctx: Ctx,
    player: Player, 
    char: Character,
    pos: number
  ) : string {
    
    if (pos === char.workers[char.selectedWorker].pos)
      char.workers[char.selectedWorker].height++;
    return super.build(G, ctx, player, char, pos);
  }

}