import { getNextPosition } from '../utility';
import { tryEndGame } from '../winConditions';
import { Mortal } from './Mortal';
import { Character } from '../../types/CharacterTypes';

export const Maenads: Character = {
  ...Mortal,
  desc: [`End of your turn: If your workers neighbour an opponent’s worker on opposite sides, 
    that opponent loses the game.`],

  onTurnEnd: (context, charState) => {
    if (charState.workers.length === 2) {
      const { G, playerID } = context;
      const { opponentID } = G.players[playerID];

      const worker1Pos = charState.workers[0].pos;
      const worker2pos = charState.workers[1].pos;

      G.players[opponentID].charState.workers.forEach((worker) => {
        const nextPos = getNextPosition(worker1Pos, worker.pos);
        if (nextPos === worker2pos) {
          tryEndGame(context, playerID);
        }
      });
    }
  },
};
