import { Box, Sphere } from '@react-three/drei';
import { BoardPosition } from '../../types/BoardTypes';

export const BuildingBase = ({ boardPos } : { boardPos: BoardPosition }): JSX.Element => (
  <Box
    userData={{ pos: boardPos.pos }}
    args={[5, 3, 5]}
    position={[boardPos.x, 1, boardPos.z]}
  >
    <meshStandardMaterial color="white" />
  </Box>
);

export const BuildingMid = ({ boardPos } : { boardPos: BoardPosition }): JSX.Element => (
  <Box
    userData={{ pos: boardPos.pos }}
    args={[4, 2, 4]}
    position={[boardPos.x, 4, boardPos.z]}
  >
    <meshStandardMaterial color="white" />
  </Box>
);

export const BuildingTop = ({ boardPos } : { boardPos: BoardPosition }): JSX.Element => (
  <Box
    userData={{ pos: boardPos.pos }}
    args={[3, 2, 3]}
    position={[boardPos.x, 6, boardPos.z]}
  >
    <meshStandardMaterial color="white" />
  </Box>
);

export const Dome = ({ boardPos, height } : {
  boardPos: BoardPosition,
  height: number
}): JSX.Element => {
  const yPosHeightMap = [0, 3, 5, 7, 7];

  return (
    <Sphere
      userData={{ pos: boardPos.pos }}
      args={[1.5, 16]}
      position={[boardPos.x, yPosHeightMap[height], boardPos.z]}
    >
      <meshStandardMaterial name="mat" color="blue" />
    </Sphere>
  );
};
