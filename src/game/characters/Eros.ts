import { Ctx } from 'boardgame.io';
import { getAdjacentPositions, getOppositePerimterPositions, posIsPerimeter } from '../utility';
import { Character, CharacterState, Worker } from '../../types/CharacterTypes';
import { Mortal } from './Mortal';
import { GameState, Player } from '../../types/GameTypes';

export const Eros: Character = {
  ...Mortal,
  desc: `Setup: Place your Workers anywhere along opposite edges of the board.
    Win Condition: You also win if one of your Workers moves to a space neighboring your
    other Worker and both are on the first level (or the same level in a 3-player game).`,

  validPlace: (
    G: GameState,
    ctx: Ctx,
    player: Player,
    char: CharacterState,
  ) => {
    const valids: number[] = [];
    G.spaces.forEach((space) => {
      if (!space.inhabitant && char.numWorkersToPlace > 0 && posIsPerimeter(space.pos)) {
        if (char.numWorkersToPlace === 2) {
          valids.push(space.pos);
        } else if (getOppositePerimterPositions(char.workers[0].pos).includes(space.pos)) {
          valids.push(space.pos);
        }
      }
    });
    return valids;
  },

  move: (
    G: GameState,
    ctx: Ctx,
    player: Player,
    char: CharacterState,
    pos: number,
  ) => {
    const stage = Mortal.move(G, ctx, player, char, pos);

    let worker: Worker | null = null;

    if (char.workers.length === 2) {
      worker = char.workers[(char.selectedWorkerNum + 1) % 2];
    }

    if (worker !== null) {
      if (
        getAdjacentPositions(pos).includes(worker.pos)
        && G.spaces[pos].height === 1 && worker.height === 1
      ) {
        ctx.events?.endGame({
          winner: player.id,
        });
      }
    }

    return stage;
  },
};
