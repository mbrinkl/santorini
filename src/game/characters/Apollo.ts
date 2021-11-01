import { Character, CharacterState } from '.'
import { Mortal } from './Mortal'
import { getAdjacentPositions } from '../utility'
import { GameState, Player } from '../index'
import { Board } from '../space'
import { Ctx } from 'boardgame.io';

export const Apollo: Character = {
  ...Mortal,
  name: 'Apollo',
  desc: `Your Move : Your worker may move into an opponent worker's space by 
      forcing their worker to the space you just vacated.`,

  validMove: (
    G: GameState,
    ctx: Ctx,
    player: Player,
    char: CharacterState,
    originalPos: number
  ) => {

    let adjacents: number[] = getAdjacentPositions(originalPos);
    let valids: number[] = []

    originalPos = +originalPos;

    adjacents.forEach(pos => {

      // if the space is in valid range and height and not domed
      if (!G.spaces[pos].is_domed && G.spaces[pos].height - G.spaces[originalPos].height <= char.moveUpHeight) {
        // if the space is not inhabited
        if (!G.spaces[pos].inhabited)
          // add the space to the valid list
          valids.push(pos);

        // or if the space is inhabited, but by another player 
        else if (G.spaces[pos].inhabitant.playerId !== ctx.currentPlayer)
          // add the space to the valid list
          valids.push(pos)
      }
    })

    return valids;
  },

  move: (
    G: GameState,
    ctx: Ctx,
    player: Player,
    char: CharacterState,
    pos: number
  ) => {

    let originalPos = char.workers[char.selectedWorker].pos;

    // if switching spaces with another worker
    if (G.spaces[pos].inhabited) {
      Board.place(G, originalPos, player.opponentId, G.spaces[pos].inhabitant.workerNum);
    }
    else
      Board.free(G, originalPos);

    Board.place(G, pos, player.id, char.selectedWorker);

    return "build"
  },
}
