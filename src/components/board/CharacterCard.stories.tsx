import type { StoryFn, Meta } from '@storybook/react';
import { _ClientImpl } from 'boardgame.io/dist/types/src/client/client';
import { characterList } from '../../game/util/characterUtil';
import { BoardContext } from '../../hooks/useBoardContext';
import { mockBoardProps } from '../../util/mocks';
import { CharacterCard } from './CharacterCard';

export default {
  title: 'board/CharacterCard',
  component: CharacterCard,
  argTypes: {
    name: {
      control: 'select',
      options: characterList,
    },
  },
  args: {
    name: characterList[0],
  },
} as Meta<typeof CharacterCard>;

export const Default: StoryFn<typeof CharacterCard> = (args) => (
  <BoardContext.Provider value={mockBoardProps}>
    <CharacterCard {...args} />
  </BoardContext.Provider>
);
