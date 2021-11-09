import { Ctx } from 'boardgame.io';
import { Character, CharacterState } from '../../types/CharacterTypes';
import { Mortal } from './Mortal';
import { GameState, Player } from '../../types/GameTypes';
import { Board } from '../space';

interface AtlasAttrs {
  specialActive: boolean,
}

export const Atlas: Character<AtlasAttrs> = {
  ...Mortal,
  desc: 'Your Build: Your worker may build a dome at any level.',
  buttonText: 'Build Dome',
  attrs: {
    specialActive: false,
  },

  move: (
    G: GameState,
    ctx: Ctx,
    player: Player,
    char: CharacterState<AtlasAttrs>,
    pos: number,
  ) => {
    char.buttonActive = true;
    return Mortal.move(G, ctx, player, char, pos);
  },

  buttonPressed: (
    G: GameState,
    ctx: Ctx,
    player: Player,
    char: CharacterState<AtlasAttrs>,
  ) => {
    char.attrs.specialActive = !char.attrs.specialActive;
    char.buttonText = char.attrs.specialActive ? 'Cancel' : 'Build Dome';
    return Mortal.buttonPressed(G, ctx, player, char as CharacterState);
  },

  build: (
    G: GameState,
    ctx: Ctx,
    player: Player,
    char: CharacterState<AtlasAttrs>,
    pos: number,
  ) => {
    if (char.attrs.specialActive) G.spaces[pos].isDomed = true;
    else Board.build(G, pos);

    char.attrs.specialActive = false;
    char.buttonActive = false;
    char.buttonText = 'Build Dome';
    return 'end';
  },
};
