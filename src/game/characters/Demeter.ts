import { Ctx } from 'boardgame.io';
import { Character, CharacterState } from '../../types/CharacterTypes';
import { Mortal } from './Mortal';
import { getAdjacentPositions } from '../utility';
import { GameState, Player } from '../../types/GameTypes';
import { Board } from '../space';

interface DemeterAttrs {
  numBuilds: number,
  firstBuildPos: number,
}

const initialAttrs: DemeterAttrs = {
  numBuilds: 0,
  firstBuildPos: 0,
};

export const Demeter: Character = {
  ...Mortal,
  desc: 'Your Build: Your worker may build one additional time, but not on the same space.',
  buttonText: 'Skip 2nd Build',
  attrs: initialAttrs,

  buttonPressed: (
    G: GameState,
    ctx: Ctx,
    player: Player,
    char: CharacterState,
  ) => {
    const attrs: DemeterAttrs = char.attrs as DemeterAttrs;

    // reset stuff
    attrs.numBuilds = 0;
    char.buttonActive = false;

    // set game stage
    return 'end';
  },

  validBuild: (
    G: GameState,
    ctx: Ctx,
    player: Player,
    char: CharacterState,
    originalPos: number,
  ) => {
    const attrs: DemeterAttrs = char.attrs as DemeterAttrs;

    const adjacents: number[] = getAdjacentPositions(originalPos);
    const valids: number[] = [];

    if (attrs.numBuilds === 0) {
      adjacents.forEach((pos) => {
        if (!G.spaces[pos].inhabited && !G.spaces[pos].isDomed) {
          valids.push(pos);
        }
      });
    } else {
      adjacents.forEach((pos) => {
        if (!G.spaces[pos].inhabited && !G.spaces[pos].isDomed && pos !== attrs.firstBuildPos) {
          valids.push(pos);
        }
      });
    }

    return valids;
  },

  build: (
    G: GameState,
    ctx: Ctx,
    player: Player,
    char: CharacterState,
    pos: number,
  ) => {
    const attrs: DemeterAttrs = char.attrs as DemeterAttrs;

    attrs.numBuilds += 1;

    if (attrs.numBuilds === 1) {
      attrs.firstBuildPos = pos;
      Board.build(G, pos);
      char.buttonActive = true;
      return 'build';
    }

    attrs.numBuilds = 0;
    char.buttonActive = false;
    Board.build(G, pos);
    return 'end';
  },
};
