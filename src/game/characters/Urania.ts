import { Ctx } from 'boardgame.io';
import { Player, GameState } from '../../types/GameTypes';
import { getWrappedAdjacents } from '../utility';
import { Character, CharacterState } from '../../types/CharacterTypes';
import { Mortal } from './Mortal';

export const Urania: Character = {
  ...Mortal,
  desc: `Your Turn: When your Worker moves or builds, treat opposite edges and corners as if they are
    adjacent so that every space has 8 neighbors.`,
  // banned aphrodite

  validMove: (
    G: GameState,
    ctx: Ctx,
    player: Player,
    char: CharacterState<any>,
    originalPos: number,
  ) => {
    const valids: number[] = [];

    getWrappedAdjacents(originalPos).forEach((pos) => {
      if (
        !G.spaces[pos].inhabitant
        && !G.spaces[pos].isDomed
        && G.spaces[pos].height - G.spaces[originalPos].height <= char.moveUpHeight
      ) {
        valids.push(pos);
      }
    });

    return valids;
  },

  validBuild: (
    G: GameState,
    ctx: Ctx,
    player: Player,
    char: CharacterState,
    originalPos: number,
  ) => {
    const valids: number[] = [];

    getWrappedAdjacents(originalPos).forEach((pos) => {
      if (!G.spaces[pos].inhabitant && !G.spaces[pos].isDomed) {
        valids.push(pos);
      }
    });

    return valids;
  },
};
