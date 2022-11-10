import type { StoryFn, Meta } from '@storybook/react';
import { LobbyPage as LobbyPageComponent } from './Wrapper';

export default {
  title: 'lobby/LobbyPage',
  component: LobbyPageComponent,
  decorators: [
    (Story) => (
      <div style={{ margin: 0, height: '100vh' }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
  },
} as Meta<typeof LobbyPageComponent>;

export const LobbyPage: StoryFn<typeof LobbyPageComponent> = () => (
  <LobbyPageComponent />
);
