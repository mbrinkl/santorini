import { Ctx } from 'boardgame.io';
import { getAdjacentPositions } from '../utility';
import { Character, CharacterState } from '../../types/CharacterTypes';
import { Mortal } from './Mortal';
import { GameState, Player } from '../../types/GameTypes';
import { Board } from '../space';

interface HeraclesAttrs {
  specialActive: boolean,
  specialUsed: boolean,
  numBuilds: number
}

export const Heracles: Character<HeraclesAttrs> = {
  ...Mortal,
  desc: `End of Your Turn: Once, both your Workers build any number 
    of domes (even zero) at any level.`,
  buttonText: 'Build Domes',
  attrs: {
    specialActive: false,
    specialUsed: false,
    numBuilds: 0,
  },

  buttonPressed: (
    G: GameState,
    ctx: Ctx,
    player: Player,
    char: CharacterState<HeraclesAttrs>,
  ) => {
    char.attrs.specialActive = !char.attrs.specialActive;

    if (char.attrs.specialUsed) {
      // reset stuff
      char.buttonActive = false;
      char.attrs.specialActive = false;
      char.buttonText = 'Build Domes';

      // set game stage
      return 'end';
    }
    if (char.attrs.specialActive) {
      char.buttonText = 'Cancel';
    } else {
      char.buttonText = 'Build Domes';
    }

    return Mortal.buttonPressed(G, ctx, player, char);
  },

  move: (
    G: GameState,
    ctx: Ctx,
    player: Player,
    char: CharacterState<HeraclesAttrs>,
    pos: number,
  ) => {
    if (!char.attrs.specialUsed) {
      char.attrs.numBuilds = 0;
      char.buttonActive = true;
    }
    return Mortal.move(G, ctx, player, char, pos);
  },

  validBuild: (
    G: GameState,
    ctx: Ctx,
    player: Player,
    char: CharacterState<HeraclesAttrs>,
    originalPos: number,
  ) => {
    if (!char.attrs.specialActive) {
      return Mortal.validBuild(G, ctx, player, char, originalPos);
    }

    const valids: number[] = [];
    let adjacents: number[] = [];

    for (let i = 0; i < char.numWorkers; i++) {
      // add on the adjacent positions of each worker
      adjacents = adjacents.concat(getAdjacentPositions(char.workers[i].pos));
    }

    adjacents.forEach((pos) => {
      if (!G.spaces[pos].inhabited && !G.spaces[pos].isDomed) {
        valids.push(pos);
      }
    });

    return valids;
  },

  build: (
    G: GameState,
    ctx: Ctx,
    player: Player,
    char: CharacterState<HeraclesAttrs>,
    pos: number,
  ) => {
    if (char.attrs.specialActive) {
      char.attrs.specialUsed = true;
      char.buttonText = 'End Build';
      char.attrs.numBuilds += 1;
      G.spaces[pos].isDomed = true;

      if (Mortal.hasValidBuild(G, ctx, player, char)) {
        return 'build';
      }
    } else {
      Board.build(G, pos);
    }

    char.buttonActive = false;
    char.attrs.specialActive = false;
    char.buttonText = 'Build Domes';
    return 'end';
  },
};
