import { Plane } from '@react-three/drei';
import { BoardPosition } from '../../types/boardTypes';
import { GROUND_SIZE } from '../../config/board';

const Ground = ({ boardPos }: { boardPos: BoardPosition }): JSX.Element => (
  <Plane
    userData={{ pos: boardPos.pos }}
    args={[GROUND_SIZE, GROUND_SIZE]}
    position={[boardPos.x, 0, boardPos.z]}
    rotation={[(3 * Math.PI) / 2, 0, 0]}
  >
    <meshStandardMaterial color="green" />
  </Plane>
);

export default Ground;
