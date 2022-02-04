import { useRef } from 'react';
import {
  Box, Cone, Cylinder, Ring,
} from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';
import { BoardPosition } from '../../../types/BoardTypes';
import { GameStage } from '../../../types/GameTypes';

export const PlaceIndicator = ({ boardPos, height } : {
  boardPos: BoardPosition,
  height: number
}): JSX.Element => {
  const yMap = [0, 3, 5, 7, 7];
  const mesh = useRef<Mesh>();

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    const scale = 1 + Math.abs((0.5 * Math.sin(time)));
    if (mesh.current) {
      mesh.current.scale.y = scale;
      mesh.current.scale.x = scale;
    }
  });

  return (
    <Ring
      userData={{ pos: boardPos.pos }}
      ref={mesh}
      args={[0.75, 1, 32]}
      position={[boardPos.x, yMap[height] + 0.1, boardPos.z]}
      rotation={[(3 * Math.PI) / 2, 0, 0]}
    >
      <meshStandardMaterial color="yellow" />
    </Ring>
  );
};

export const SelectIndicator = ({ boardPos, height } : {
  boardPos: BoardPosition,
  height: number
}): JSX.Element => {
  const yMap = [4, 8, 10, 12, 12];
  const headMesh = useRef<Mesh>();
  const tailMesh = useRef<Mesh>();

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    const pos = yMap[height] + (0.5 * Math.sin(time));
    if (headMesh.current && tailMesh.current) {
      headMesh.current.position.y = pos;
      tailMesh.current.position.y = pos + 2;
    }
  });

  return (
    <>
      <Cone
        userData={{ pos: boardPos.pos }}
        ref={headMesh}
        args={[1, 2]}
        rotation={[Math.PI, 0, 0]}
        position={[boardPos.x, yMap[height], boardPos.z]}
      >
        <meshStandardMaterial color="yellow" />
      </Cone>

      <Cylinder
        userData={{ pos: boardPos.pos }}
        ref={tailMesh}
        args={[0.5, 0.5, 2]}
        position={[boardPos.x, yMap[height] + 2, boardPos.z]}
      >
        <meshStandardMaterial color="yellow" />
      </Cylinder>
    </>
  );
};

export const MoveIndicator = ({ boardPos, height } : {
  boardPos: BoardPosition,
  height: number
}) : JSX.Element => {
  const yMap = [0, 3, 5, 7, 7];
  const mesh = useRef<Mesh>();

  useFrame(() => {
    if (mesh.current) {
      mesh.current.rotation.z -= (0.01);
    }
  });

  return (
    <Ring
      userData={{ pos: boardPos.pos }}
      ref={mesh}
      args={[1, 2, 4]}
      position={[boardPos.x, yMap[height] + 0.1, boardPos.z]}
      rotation={[(3 * Math.PI) / 2, 0, 0]}
    >
      <meshStandardMaterial color="blue" />
    </Ring>
  );
};

export const BuildIndicator = ({ boardPos, height } : {
  boardPos: BoardPosition,
  height: number
}): JSX.Element => {
  const yMap = [0, 3, 5, 7, 7];
  const mesh = useRef<Mesh>();

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    const pos = yMap[height] + (Math.sin(time)) + 1;
    if (mesh.current) {
      mesh.current.position.y = pos;
    }
  });

  return (
    <Box
      userData={{ pos: boardPos.pos }}
      ref={mesh}
      args={[5, 0.5, 5]}
      position={[boardPos.x, yMap[height] + 0.1, boardPos.z]}
    >
      <meshStandardMaterial color="blue" opacity={0.65} transparent />
    </Box>
  );
};

export const SpecialIndicator = ({ boardPos, height } : {
  boardPos: BoardPosition,
  height: number
}): JSX.Element => {
  const yMap = [0, 3, 5, 7, 7];
  const mesh = useRef<Mesh>();

  useFrame(() => {
    if (mesh.current) {
      mesh.current.rotation.z -= (0.01);
    }
  });

  return (
    <Ring
      userData={{ pos: boardPos.pos }}
      ref={mesh}
      args={[1, 2, 8]}
      position={[boardPos.x, yMap[height] + 0.1, boardPos.z]}
      rotation={[(3 * Math.PI) / 2, 0, 0]}
    >
      <meshStandardMaterial color="purple" />
    </Ring>
  );
};

export const Indicator = ({ boardPos, height, stage } : {
  boardPos: BoardPosition,
  height: number,
  stage: GameStage
}): JSX.Element | null => {
  switch (stage) {
    case 'place':
      return <PlaceIndicator boardPos={boardPos} height={height} />;
    case 'select':
      return <SelectIndicator boardPos={boardPos} height={height} />;
    case 'move':
      return <MoveIndicator boardPos={boardPos} height={height} />;
    case 'build':
      return <BuildIndicator boardPos={boardPos} height={height} />;
    case 'special':
      return <SpecialIndicator boardPos={boardPos} height={height} />;
    default:
      return null;
  }
};
