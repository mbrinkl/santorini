import type { StoryFn, Meta } from '@storybook/react';
import { LoadingPage as LoadingPageComponent } from './LoadingPage';

export default {
  title: 'lobby/LoadingPage',
  component: LoadingPageComponent,
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
} as Meta<typeof LoadingPageComponent>;

export const LoadingPage: StoryFn<typeof LoadingPageComponent> = () => (
  <LoadingPageComponent />
);
