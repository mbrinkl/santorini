import { Ctx } from 'boardgame.io';
import { Mortal } from './Mortal';
import { GameState, Player } from '../../types/GameTypes';
import { Character, CharacterState } from '../../types/CharacterTypes';
import { Board } from '../space';
import { getNextPosition } from '../utility';

export const Harpies: Character = {
  ...Mortal,
  desc: `Opponent’s Turn: Each time an opponent’s Worker moves, it is forced space by space in the same
    direction until the next space is at a higher level or it is obstructed.`,
  // banned ['Hermes', 'Triton']

  opponentPostMove: (
    G: GameState,
    ctx: Ctx,
    player: Player,
    char: CharacterState,
    pos: number, // the original pos
  ) => {
    const worker = char.workers[char.selectedWorkerNum];

    let originalPos = pos;
    let newPos = char.workers[char.selectedWorkerNum].pos;
    let toPos = getNextPosition(originalPos, newPos);

    while (
      toPos !== -1
      && G.spaces[toPos].height <= worker.height
      && !G.spaces[toPos].inhabitant
      && !G.spaces[toPos].isDomed
    ) {
      Board.free(G, worker.pos);
      Board.place(G, toPos, player.id, char.selectedWorkerNum);

      originalPos = newPos;
      newPos = toPos;
      toPos = getNextPosition(originalPos, newPos);
    }
  },
};
