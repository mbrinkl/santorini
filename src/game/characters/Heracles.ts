import { getAdjacentPositions } from '../utility';
import { Character, CharacterState } from '../../types/CharacterTypes';
import { Mortal } from "./Mortal";
import { GameState, Player } from '../../types/GameTypes';
import { Board } from '../space';
import { Ctx } from 'boardgame.io';

interface HeraclesAttrs {
  specialActive: boolean,
  specialUsed: boolean,
  numBuilds: number
}

const initialAttrs: HeraclesAttrs = {
  specialActive: false,
  specialUsed: false,
  numBuilds: 0
}

export const Heracles: Character = {
  ...Mortal,
  desc: `End of Your Turn: Once, both your Workers build any number 
    of domes (even zero) at any level.`,
  buttonText: `Build Domes`,
  attrs: initialAttrs,

  buttonPressed: (
    G: GameState,
    ctx: Ctx,
    player: Player,
    char: CharacterState
  ) => {
    const attrs: HeraclesAttrs = char.attrs as HeraclesAttrs;

    attrs.specialActive = !attrs.specialActive;

    if (attrs.specialUsed) {
      // reset stuff
      char.buttonActive = false;
      attrs.specialActive = false;
      char.buttonText = 'Build Domes';

      //set game stage
      return 'end';
    }
    else if (attrs.specialActive) {
      char.buttonText = 'Cancel';
    }
    else {
      char.buttonText = 'Build Domes';
    }

    return Mortal.buttonPressed(G, ctx, player, char);
  },

  move: (
    G: GameState,
    ctx: Ctx,
    player: Player,
    char: CharacterState,
    pos: number
  ) => {
    const attrs: HeraclesAttrs = char.attrs as HeraclesAttrs;
    
    if (!attrs.specialUsed) {
      attrs.numBuilds = 0;
      char.buttonActive = true;
    }
    return Mortal.move(G, ctx, player, char, pos);
  },

  validBuild: (
    G: GameState,
    ctx: Ctx,
    player: Player,
    char: CharacterState,
    originalPos: number
  ) => {
    const attrs: HeraclesAttrs = char.attrs as HeraclesAttrs;

    if (!attrs.specialActive) {
      return Mortal.validBuild(G, ctx, player, char, originalPos);
    }
    else {
      let valids: number[] = [];
      let adjacents: number[] = [];

      for (let i = 0; i < char.numWorkers; i++) {
        // add on the adjacent positions of each worker
        adjacents = adjacents.concat(getAdjacentPositions(char.workers[i].pos));
      }

      adjacents.forEach(pos => {
        if (!G.spaces[pos].inhabited && !G.spaces[pos].isDomed) {
          valids.push(pos);
        }
      })

      return valids;
    }
  },

  build: (
    G: GameState,
    ctx: Ctx,
    player: Player,
    char: CharacterState,
    pos: number
  ) => {
    const attrs: HeraclesAttrs = char.attrs as HeraclesAttrs;

    if (attrs.specialActive) {
      attrs.specialUsed = true;
      char.buttonText = 'End Build';
      attrs.numBuilds++;
      G.spaces[pos].isDomed = true;

      if (Mortal.hasValidBuild(G, ctx, player, char)) {
        return 'build';
      }
    }
    else {
      Board.build(G, pos);
    }

    char.buttonActive = false;
    attrs.specialActive = false;
    char.buttonText = 'Build Domes';
    return 'end';
  },
}