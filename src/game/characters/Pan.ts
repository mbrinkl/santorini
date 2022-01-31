import { Mortal } from './Mortal';
import { Character } from '../../types/CharacterTypes';

export const Pan: Character = {
  ...Mortal,
  desc: 'Win Condition: You also win if your Worker moves down two or more levels.',

  checkWinByMove: (
    G,
    charState,
    heightBefore,
    heightAfter,
  ) => (
    (heightBefore < 3 && heightAfter === 3)
    || (heightBefore - heightAfter > 1)
  ),
};
