import { Character, CharacterState } from '../../types/CharacterTypes';
import { Mortal } from "./Mortal";
import { GameState, Player } from '../../types/GameTypes';
import { Board } from '../space'
import { Ctx } from 'boardgame.io';

interface AtlasAttrs {
  specialActive: boolean
}

const initialAttrs: AtlasAttrs = {
  specialActive: false
}

export const Atlas: Character = {
  ...Mortal,
  desc: `Your Build: Your worker may build a dome at any level.`,
  buttonText: 'Build Dome',
  attrs: initialAttrs,

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
    const attrs: AtlasAttrs = char.attrs as AtlasAttrs;
    attrs.specialActive = !attrs.specialActive;
    char.buttonText = attrs.specialActive ? 'Cancel' : 'Build Dome';
    return Mortal.buttonPressed(G, ctx, player, char);
  },

  build(
    G: GameState,
    ctx: Ctx,
    player: Player,
    char: CharacterState,
    pos: number
  ): string {
    const attrs: AtlasAttrs = char.attrs as AtlasAttrs;
    
    if (attrs.specialActive)
      G.spaces[pos].is_domed = true;
    else
      Board.build(G, pos);

    attrs.specialActive = false;
    char.buttonActive = false;
    char.buttonText = 'Build Dome'
    return 'end'
  },
}