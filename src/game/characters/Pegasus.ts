import { Mortal } from './Mortal';
import { GameState } from '../../types/GameTypes';
import { Character, CharacterState } from '../../types/CharacterTypes';

export const Pegasus: Character = {
  ...Mortal,
  desc: 'Your Move: Your Worker may move up more than one level, but cannot win the game by doing so.',
  moveUpHeight: 3,

  checkWinByMove: (
    G: GameState,
    char: CharacterState,
    heightBefore: number,
    heightAfter: number,
  ) => (
    heightBefore === 2 && heightAfter === 3
  ),
};
