/* eslint-disable react/destructuring-assignment */
import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import type { StoryFn, Meta } from '@storybook/react';
import { _ClientImpl } from 'boardgame.io/dist/types/src/client/client';
import { BoardPosition } from '../../types/boardTypes';
import { BuildingBase, BuildingMid, BuildingTop } from './Buildings';
import { Ground } from './Ground';
import { Indicator } from './Indicators';
import { WorkerModel } from './WorkerModel';

export default {
  title: 'board/three/Indicators',
  component: Indicator,
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
  argTypes: {
    boardPos: {
      table: {
        disable: true,
      },
    },
    height: {
      table: {
        disable: true,
      },
    },
  },
  args: {
    stage: 'select',
  },
} as Meta<typeof Indicator>;

export const Isolated: StoryFn = (args) => (
  <Canvas camera={{ fov: 30 }}>
    <hemisphereLight args={['gray', 'black', 0.7]} />
    <directionalLight args={['white', 0.7]} position={[0, 10, 0]} />
    <OrbitControls
      minDistance={30}
      maxDistance={30}
      minPolarAngle={0}
      maxPolarAngle={Math.PI / 3}
    />
    <Indicator
      boardPos={{ pos: 0, x: 0, z: 0 }}
      height={0}
      stage={args.stage}
    />
  </Canvas>
);

export const WithBoard: StoryFn = (args) => {
  const positions: [BoardPosition, number][] = [
    [{ pos: 0, x: -9, z: 0 }, 0],
    [{ pos: 0, x: -3, z: 0 }, 1],
    [{ pos: 0, x: 3, z: 0 }, 2],
    [{ pos: 0, x: 9, z: 0 }, 3],
  ];
  return (
    <Canvas camera={{ fov: 75 }}>
      <hemisphereLight args={['gray', 'black', 0.7]} />
      <directionalLight args={['white', 0.7]} position={[0, 10, 0]} />
      <OrbitControls
        minDistance={30}
        maxDistance={30}
        minPolarAngle={0}
        maxPolarAngle={Math.PI / 3}
      />

      {positions.map(([pos, height]) => (
        <>
          <Ground key={height} boardPos={pos} />
          {args.showWorker && (
            <WorkerModel boardPos={pos} height={height} color="dodgerblue" />
          )}
          <Indicator boardPos={pos} height={height} stage={args.stage} />
          {height > 0 && <BuildingBase boardPos={pos} />}
          {height > 1 && <BuildingMid boardPos={pos} />}
          {height > 2 && <BuildingTop boardPos={pos} />}
        </>
      ))}
    </Canvas>
  );
};
WithBoard.args = {
  showWorker: true,
};
