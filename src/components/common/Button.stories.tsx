import type { StoryFn, Meta } from '@storybook/react';
import { Button as ButtonComponent } from './Button';

export default {
  title: 'common/Buttons',
  component: ButtonComponent,
} as Meta<typeof ButtonComponent>;

export const Button: StoryFn<typeof ButtonComponent> = (args) => (
  <ButtonComponent {...args}>Button Text</ButtonComponent>
);
