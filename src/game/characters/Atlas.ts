import { CharacterState, Character } from ".";
import { Mortal } from "./Mortal";
import { GameState, Player } from '../index'
import { Board } from '../space'
import { Ctx } from 'boardgame.io';

// interface attrsType {
//   specialActive: boolean
// }

export const Atlas: Character = {
  ...Mortal,
  name: 'Atlas',
  desc: `Your Build: Your worker may build a dome at any level.`,
  buttonText: 'Build Dome',
  attrs: {
    specialActive: false
  },

  move: (
    G: GameState,
    ctx: Ctx,
    player: Player,
    char: CharacterState,
    pos: number
  ) => {
    char.buttonActive = true;
    return Mortal.move(G, ctx, player, char, pos);
  },

  buttonPressed: (
    G: GameState,
    ctx: Ctx,
    player: Player,
    char: CharacterState
  ) => {
    char.attrs.specialActive = !char.attrs.specialActive;
    char.buttonText = char.attrs.specialActive ? 'Cancel' : 'Build Dome';
    return Mortal.buttonPressed(G, ctx, player, char);
  },

  build(
    G: GameState,
    ctx: Ctx,
    player: Player,
    char: CharacterState,
    pos: number
  ): string {

    if (char.attrs.specialActive)
      G.spaces[pos].is_domed = true;
    else
      Board.build(G, pos);

    char.attrs.specialActive = false;
    char.buttonActive = false;
    char.buttonText = 'Build Dome'
    return 'end'
  },
}