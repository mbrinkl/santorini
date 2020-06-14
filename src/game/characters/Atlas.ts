import { Mortal, Character } from '../character'
import { GameState, Player } from '../index'
import { Board } from '../space'
import { Ctx } from 'boardgame.io';

export class Atlas extends Mortal {

  public static desc = `Your Build: Your worker may build a dome at any level.`;
  public static buttonText = 'Build Dome';
  public static attributes: any = {
    specialActive: false
  };

  public static move (
    G: GameState, 
    ctx: Ctx,
    player: Player,
    char: Character, 
    pos: number
  ) : string {
    char.buttonActive = true;
    return super.move(G, ctx, player, char, pos);
  }

  public static buttonPressed(
    G: GameState, 
    ctx: Ctx,
    player: Player,
    char: Character
  ) : void {
    char.attributes.specialActive = !char.attributes.specialActive;
    char.buttonText = char.attributes.specialActive ?  'Cancel' : 'Build Dome';
  }

  public static build (
    G: GameState,
    ctx: Ctx,
    player: Player, 
    char: Character,
    pos: number
  ) : string { 

    if (char.attributes.specialActive)
      G.spaces[pos].is_domed = true;
    else
      Board.build(G, pos);

    char.attributes.specialActive = false;
    char.buttonActive = false;
    char.buttonText = 'Build Dome'
    return 'end'
  }
}