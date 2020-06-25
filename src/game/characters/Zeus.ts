import { Mortal } from '../character'
import { Ctx } from 'boardgame.io';
import { Character } from '../character'
import { GameState, Player } from '../index'

export class Zeus extends Mortal {
  
  public static desc = `Your Build: Your Worker may build a block under itself.`;

  public static check_win_by_move(G: GameState, beforeHeight: number, afterHeight: number) : boolean {
    return (beforeHeight < 3 && afterHeight === 3) ||
      (beforeHeight - afterHeight > 1)
  }

  public static valid_build(
    G: GameState, 
    ctx: Ctx,
    player: Player, 
    char: Character,
    originalPos: number
  ) : number[] {

    let valids: number[] = super.valid_build(G, ctx, player, char, originalPos);

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