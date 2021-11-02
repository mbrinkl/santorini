import { Character, CharacterState } from ".";
import { Mortal } from "./Mortal";
import { getAdjacentPositions } from '../utility'
import { GameState, Player } from '../../types/GameTypes';
import { Board } from '../space'
import { Ctx } from 'boardgame.io';

interface HephaestusAttrs {
  numBuilds: number,
  firstBuildPos: number,
}

const initialAttrs: HephaestusAttrs = {
  numBuilds: 0,
  firstBuildPos: -1
}

export const Hephaestus: Character = {
  ...Mortal,
  name: 'Hephaestus',
  desc: `Your Build: Your Worker may build one additional block (not dome) on top of your first block.`,
  buttonText: 'Skip 2nd Build',
  attrs: initialAttrs,

  buttonPressed: (
    G: GameState,
    ctx: Ctx,
    player: Player,
    char: CharacterState
  ) => {
    const attrs: HephaestusAttrs = char.attrs as HephaestusAttrs;

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
    originalPos: number
  ) => {
    const attrs: HephaestusAttrs = char.attrs as HephaestusAttrs;

    let adjacents: number[] = getAdjacentPositions(originalPos);
    let valids: number[] = []

    if (attrs.numBuilds === 0) {
      adjacents.forEach(pos => {
        if (!G.spaces[pos].inhabited && !G.spaces[pos].is_domed) {
          valids.push(pos);
        }
      })
    }
    else {
      valids.push(attrs.firstBuildPos);
    }

    return valids;
  },

  build: (
    G: GameState,
    ctx: Ctx,
    player: Player,
    char: CharacterState,
    pos: number
  ) => {
    const attrs: HephaestusAttrs = char.attrs as HephaestusAttrs;

    attrs.numBuilds++;

    if (attrs.numBuilds === 1) {

      Board.build(G, pos);

      if (G.spaces[pos].height > 2) {
        attrs.numBuilds = 0;
        return 'end';
      }
      else {
        attrs.firstBuildPos = pos;
        char.buttonActive = true;
        return 'build';
      }
    }
    else {
      attrs.numBuilds = 0;
      char.buttonActive = false;
      Board.build(G, pos);
      return 'end'
    }
  }
}
