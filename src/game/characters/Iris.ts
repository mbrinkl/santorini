import { Character, CharacterState } from ".";
import { Mortal } from "./Mortal";
import { getAdjacentPositions, getNextPosition } from '../utility'
import { GameState, Player } from '../index'
import { Ctx } from 'boardgame.io';

export const Iris: Character = {
  ...Mortal,
  name: 'Iris',
  desc: `Your Move: If there is a Worker neighboring your Worker and the space directly on the 
      other side of it is unoccupied, your worker may move to that space regardless of its level.`,

  validMove: (
    G: GameState,
    ctx: Ctx,
    player: Player,
    char: CharacterState,
    originalPos: number
  ) => {
    let adjacents: number[] = getAdjacentPositions(originalPos);
    let valids: number[] = [];

    adjacents.forEach(pos => {

      // if the space is in valid range and height and not domed
      if (!G.spaces[pos].is_domed && G.spaces[pos].height - G.spaces[originalPos].height <= char.moveUpHeight) {
        // if the space is not inhabited
        if (!G.spaces[pos].inhabited)
          // add the space to the valid list
          valids.push(pos);

        // or if the space is inhabited, but by another player 
        else if (G.spaces[pos].inhabitant.playerId !== ctx.currentPlayer) {

          const nextPos: number = getNextPosition(originalPos, pos);

          if (nextPos !== -1) {
            if (!G.spaces[nextPos].inhabited && !G.spaces[nextPos].is_domed)
              // add the space to the valid list
              valids.push(nextPos);
          }
        }
      }
    });

    return valids;
  },
}