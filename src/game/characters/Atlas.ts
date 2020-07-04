import { Mortal, Character } from '.'
import { GameState, Player } from '../index'
import { Board } from '../space'
import { Ctx } from 'boardgame.io';

interface attrsType {
  specialActive: boolean
}

export class Atlas extends Mortal {

  public static desc = `Your Build: Your worker may build a dome at any level.`;
  public static buttonText = 'Build Dome';
  public static attrs: attrsType = {
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
    char.attrs.specialActive = !char.attrs.specialActive;
    char.buttonText = char.attrs.specialActive ?  'Cancel' : 'Build Dome';
  }

  public static build (
    G: GameState,
    ctx: Ctx,
    player: Player, 
    char: Character,
    pos: number
  ) : string { 

    if (char.attrs.specialActive)
      G.spaces[pos].is_domed = true;
    else
      Board.build(G, pos);

    char.attrs.specialActive = false;
    char.buttonActive = false;
    char.buttonText = 'Build Dome'
    return 'end'
  }
}