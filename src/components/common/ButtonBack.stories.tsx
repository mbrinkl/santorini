import type { StoryFn, Meta } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import { ButtonBack as ButtonBackComponent } from './ButtonBack';

export default {
  title: 'common/Buttons',
  component: ButtonBackComponent,
  args: {
    to: '#',
  },
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/']}>
        <Story />
      </MemoryRouter>
    ),
  ],
} as Meta<typeof ButtonBackComponent>;

export const ButtonBack: StoryFn<typeof ButtonBackComponent> = (args) => (
  <ButtonBackComponent {...args} />
);
