import { Character, CharacterState } from ".";
import { Mortal } from "./Mortal";
import { getAdjacentPositions } from '../utility'
import { GameState, Player } from '../../types/GameTypes';
import { Board } from '../space'
import { Ctx } from 'boardgame.io';

// interface attrsType {
//   numBuilds: number,
//   firstBuildPos: number,
// }

export const Hephaestus: Character = {
  ...Mortal,
  name: 'Hephaestus',
  desc: `Your Build: Your Worker may build one additional block (not dome) on top of your first block.`,
  buttonText: 'Skip 2nd Build',
  attrs: {
    numBuilds: 0,
    firstBuildPos: -1,
  },

  buttonPressed: (
    G: GameState,
    ctx: Ctx,
    player: Player,
    char: CharacterState
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
    char: CharacterState,
    originalPos: number
  ) => {
    let adjacents: number[] = getAdjacentPositions(originalPos);
    let valids: number[] = []

    if (char.attrs.numBuilds === 0) {
      adjacents.forEach(pos => {
        if (!G.spaces[pos].inhabited && !G.spaces[pos].is_domed) {
          valids.push(pos);
        }
      })
    }
    else {
      valids.push(char.attrs.firstBuildPos);
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

    char.attrs.numBuilds++;

    if (char.attrs.numBuilds === 1) {

      Board.build(G, pos);

      if (G.spaces[pos].height > 2) {
        char.attrs.numBuilds = 0;
        return 'end';
      }
      else {
        char.attrs.firstBuildPos = pos;
        char.buttonActive = true;
        return 'build';
      }
    }
    else {
      char.attrs.numBuilds = 0;
      char.buttonActive = false;
      Board.build(G, pos);
      return 'end'
    }
  }
}
