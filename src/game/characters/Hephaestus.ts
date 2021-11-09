import { Ctx } from 'boardgame.io';
import { Character, CharacterState } from '../../types/CharacterTypes';
import { Mortal } from './Mortal';
import { getAdjacentPositions } from '../utility';
import { GameState, Player } from '../../types/GameTypes';
import { Board } from '../space';

interface HephaestusAttrs {
  numBuilds: number,
  firstBuildPos: number,
}

export const Hephaestus: Character<HephaestusAttrs> = {
  ...Mortal,
  desc: 'Your Build: Your Worker may build one additional block (not dome) on top of your first block.',
  buttonText: 'Skip 2nd Build',
  attrs: {
    numBuilds: 0,
    firstBuildPos: -1,
  },

  buttonPressed: (
    G: GameState,
    ctx: Ctx,
    player: Player,
    char: CharacterState<HephaestusAttrs>,
  ) => {
    // reset stuff
    char.attrs.numBuilds = 0;
    char.buttonActive = false;

    // set game stage
    return 'end';
  },

  validBuild: (
    G: GameState,
    ctx: Ctx,
    player: Player,
    char: CharacterState<HephaestusAttrs>,
    originalPos: number,
  ) => {
    const adjacents: number[] = getAdjacentPositions(originalPos);
    const valids: number[] = [];

    if (char.attrs.numBuilds === 0) {
      adjacents.forEach((pos) => {
        if (!G.spaces[pos].inhabited && !G.spaces[pos].isDomed) {
          valids.push(pos);
        }
      });
    } else {
      valids.push(char.attrs.firstBuildPos);
    }

    return valids;
  },

  build: (
    G: GameState,
    ctx: Ctx,
    player: Player,
    char: CharacterState<HephaestusAttrs>,
    pos: number,
  ) => {
    char.attrs.numBuilds += 1;

    if (char.attrs.numBuilds === 1) {
      Board.build(G, pos);

      if (G.spaces[pos].height > 2) {
        char.attrs.numBuilds = 0;
        return 'end';
      }

      char.attrs.firstBuildPos = pos;
      char.buttonActive = true;
      return 'build';
    }

    char.attrs.numBuilds = 0;
    char.buttonActive = false;
    Board.build(G, pos);
    return 'end';
  },
};
