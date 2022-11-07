import type { StoryFn, Meta } from '@storybook/react';
import { LoadingPage } from './LoadingPage';

export default {
  title: 'lobby/LoadingPage',
  component: LoadingPage,
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
} as Meta<typeof LoadingPage>;

export const Loada: StoryFn<typeof LoadingPage> = () => <LoadingPage />;
