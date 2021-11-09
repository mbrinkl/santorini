import { Sphere } from '@react-three/drei';
import { BoardPosition } from '../../../types/BoardTypes';

export const WorkerModel: React.FC<{
  boardPos: BoardPosition,
  height: number,
  color: string
}> = ({ boardPos, height, color }) => {
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
