import type { StoryFn, Meta } from '@storybook/react';
// import { BoardProps, Client } from 'boardgame.io/react';
// import { BoardContext } from '../../context/boardContext';
// import { SantoriniGame } from '../../game';
// import { GameState } from '../../types/gameTypes';
import { CharacterCard } from './CharacterCard';

export default {
  title: 'board/CharacterCard',
  component: CharacterCard,
  // decorators: [
  //   (Story) => (
  //     <BoardContext.Provider value={''}>
  //       <Story />
  //     </BoardContext.Provider>
  //   ),
  // ],
} as Meta<typeof CharacterCard>;

export const Loada: StoryFn<typeof CharacterCard> = () => (
  <CharacterCard name="Apollo" playerID="1" />
);
