import { Sphere } from '@react-three/drei';
import { BoardPosition } from '../../types/boardTypes';

export const WorkerModel = ({
  boardPos,
  height,
  color,
}: {
  boardPos: BoardPosition;
  height: number;
  color: string;
}): JSX.Element => {
  const yPosHeightMap = [1, 4, 6, 8];

  return (
    <Sphere
      userData={{ pos: boardPos.pos }}
      args={[1, 16]}
      position={[boardPos.x, yPosHeightMap[height], boardPos.z]}
    >
      <meshStandardMaterial name="mat" color={color} roughness={0.25} />
    </Sphere>
  );
};
