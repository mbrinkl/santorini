import { Character } from '../../types/CharacterTypes';
import { Mortal } from './Mortal';

export const Chronus: Character = {
  ...Mortal,
  desc: 'Win Condition: You also win when there are at least five Complete Towers on the board.',

  onTurnBegin: ({ G, playerID, events }, char) => {
    const numCompleteTowers: number = G.spaces.filter((space) => (
      space.isDomed === true && space.height >= 3)).length;

    if (numCompleteTowers >= 5) {
      events.endGame({
        winner: playerID,
      });
    }
  },

  onTurnEnd: ({ G, playerID, events }, char) => {
    const numCompleteTowers: number = G.spaces.filter((space) => (
      space.isDomed === true && space.height >= 3)).length;

    if (numCompleteTowers >= 5) {
      events.endGame({
        winner: playerID,
      });
    }
  },
};
