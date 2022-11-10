import type { StoryFn, Meta } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import { NotFound as NotFoundComponent } from './NotFound';

export default {
  title: 'lobby/NotFound',
  component: NotFoundComponent,
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/']}>
        <div style={{ margin: 0, height: '100vh' }}>
          <Story />
        </div>
      </MemoryRouter>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
  },
} as Meta<typeof NotFoundComponent>;

export const NotFound: StoryFn<typeof NotFoundComponent> = () => (
  <NotFoundComponent />
);
