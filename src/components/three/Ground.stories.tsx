import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import type { StoryFn, Meta } from '@storybook/react';
import { _ClientImpl } from 'boardgame.io/dist/types/src/client/client';
import { Ground } from './Ground';

export default {
  title: 'board/three/Ground',
  component: Ground,
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
} as Meta<typeof Ground>;

export const Default: StoryFn<typeof Ground> = () => (
  <Canvas camera={{ fov: 30 }}>
    <hemisphereLight args={['gray', 'black', 0.7]} />
    <directionalLight args={['white', 0.7]} position={[0, 10, 0]} />
    <OrbitControls
      minDistance={30}
      maxDistance={30}
      minPolarAngle={0}
      maxPolarAngle={Math.PI / 3}
    />
    <Ground boardPos={{ pos: 0, x: 0, z: 0 }} />
  </Canvas>
);
