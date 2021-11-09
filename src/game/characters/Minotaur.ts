import { Ctx } from 'boardgame.io';
import { getAdjacentPositions, getNextPosition } from '../utility';
import { Character, CharacterState } from '../../types/CharacterTypes';
import { Mortal } from './Mortal';
import { GameState, Player } from '../../types/GameTypes';
import { Board } from '../space';

export const Minotaur: Character = {

  ...Mortal,
  desc: `Your Move: Your Worker may move into an opponent Worker’s space, 
    if their Worker can be forced one space straight backwards to an 
    unoccupied space at any level.`,

  validMove: (
    G: GameState,
    ctx: Ctx,
    player: Player,
    char: CharacterState,
    originalPos: number,
  ) => {
    const adjacents: number[] = getAdjacentPositions(originalPos);
    const valids: number[] = [];

    adjacents.forEach((pos) => {
      if (
        !G.spaces[pos].isDomed
        && G.spaces[pos].height - G.spaces[originalPos].height <= char.moveUpHeight
      ) {
        if (!G.spaces[pos].inhabitant) {
          valids.push(pos);
        } else if (G.spaces[pos].inhabitant?.playerId !== player.id) {
          const posToPush = getNextPosition(originalPos, pos);
          const opponent = G.players[player.opponentId];
          if (Mortal.validMove(G, ctx, opponent, opponent.char, pos).includes(posToPush)) {
            valids.push(pos);
          }
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
    const posToPush = getNextPosition(char.workers[char.selectedWorker].pos, pos);
    const { inhabitant } = G.spaces[pos];

    if (inhabitant) {
      Board.place(G, posToPush, inhabitant.playerId, inhabitant.workerNum);
    }

    Board.free(G, char.workers[char.selectedWorker].pos);
    Board.place(G, pos, player.id, char.selectedWorker);

    return 'build';
  },
};
