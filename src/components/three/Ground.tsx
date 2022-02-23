import { Plane } from '@react-three/drei';
import { BoardPosition } from '../../types/boardTypesTemp';
import { GROUND_SIZE } from '../../config/board';

export const Ground = ({
  boardPos,
}: {
  boardPos: BoardPosition;
}): JSX.Element => (
  <Plane
    userData={{ pos: boardPos.pos }}
    args={[GROUND_SIZE, GROUND_SIZE]}
    position={[boardPos.x, 0, boardPos.z]}
    rotation={[(3 * Math.PI) / 2, 0, 0]}
  >
    <meshStandardMaterial color="green" />
  </Plane>
);
