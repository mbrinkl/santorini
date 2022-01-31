import { Mortal } from './Mortal';
import { Character } from '../../types/CharacterTypes';

export const Pegasus: Character = {
  ...Mortal,
  desc: 'Your Move: Your Worker may move up more than one level, but cannot win the game by doing so.',
  moveUpHeight: 3,

  checkWinByMove: (
    G,
    charState,
    heightBefore,
    heightAfter,
  ) => (
    heightBefore === 2 && heightAfter === 3
  ),
};
