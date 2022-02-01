import { GameContext } from '../../types/GameTypes';
import { Character } from '../../types/CharacterTypes';
import { Mortal } from './Mortal';

function checkWinCondition({ G, playerID, events }: GameContext) {
  const numCompleteTowers = G.spaces.filter((space) => (
    space.isDomed === true && space.height >= 3)).length;

  if (numCompleteTowers >= 5) {
    events.endGame({
      winner: playerID,
    });
  }
}

export const Chronus: Character = {
  ...Mortal,
  desc: 'Win Condition: You also win when there are at least five Complete Towers on the board.',

  onTurnBegin: (context, charState) => {
    checkWinCondition(context);
  },

  onTurnEnd: (context, charState) => {
    checkWinCondition(context);
  },
};
