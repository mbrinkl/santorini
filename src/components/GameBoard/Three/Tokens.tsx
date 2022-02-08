import { RoundedBox } from '@react-three/drei';
import { BoardPosition } from '../../../types/BoardTypes';

export const GenericToken = ({ boardPos, height } : {
  boardPos: BoardPosition,
  height: number
}): JSX.Element => {
  const { x, z } = boardPos;
  const yPosHeightMap = [0, 3, 5, 7, 7];

  return (
    <RoundedBox
      args={[2, 1, 2]}
      position={[x, yPosHeightMap[height], z]}
      radius={0.05}
      smoothness={4}
    >
      <meshStandardMaterial name="mat" color="yellow" />
    </RoundedBox>
  );
};
