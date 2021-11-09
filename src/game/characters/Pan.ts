import { Mortal } from './Mortal';
import { GameState } from '../../types/GameTypes';
import { Character, CharacterState } from '../../types/CharacterTypes';

export const Pan: Character = {
  ...Mortal,
  desc: 'Win Condition: You also win if your Worker moves down two or more levels.',

  checkWinByMove: (
    G: GameState,
    char: CharacterState,
    heightBefore: number,
    heightAfter: number,
  ) => (
    (heightBefore < 3 && heightAfter === 3)
    || (heightBefore - heightAfter > 1)
  ),
};
