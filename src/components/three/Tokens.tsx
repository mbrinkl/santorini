import { Cone, Cylinder, RoundedBox } from '@react-three/drei';
import { Vector3 } from '@react-three/fiber';
import { OffBoardToken, Token } from '../../types/gameTypes';
import { BoardPosition } from '../../types/boardTypes';
import { GROUND_SIZE } from '../../config/board';

export const GenericToken = ({
  boardPos,
  height,
  tokens,
}: {
  boardPos: BoardPosition;
  height: number;
  tokens: Token[];
}): JSX.Element => {
  const { x, z } = boardPos;
  // Assuming only two tokens per position is possible right now
  const yPosHeightMap = [0, 3, 5, 7, 7];
  const tokenArgs: Vector3 = tokens.length === 1 ? [2, 1, 2] : [1, 1, 1];
  const token0Pos: Vector3 =
    tokens.length === 1
      ? [x, yPosHeightMap[height], z]
      : [x - 1, yPosHeightMap[height], z - 1];
  const token1Pos: Vector3 = [x + 1, yPosHeightMap[height], z + 1];

  return (
    <>
      {tokens.map((token, index) => (
        <RoundedBox
          key={`token${token.color}`}
          userData={{ pos: boardPos.pos }}
          args={tokenArgs}
          position={index === 0 ? token0Pos : token1Pos}
          radius={0.05}
          smoothness={4}
        >
          <meshStandardMaterial name="mat" color={token.color} />
        </RoundedBox>
      ))}
    </>
  );
};

export const GenericOffBoardToken = ({
  tokens,
}: {
  tokens: OffBoardToken[];
}): JSX.Element => {
  const x = 3.5 * GROUND_SIZE;
  const z = -GROUND_SIZE;

  const mapping: Record<number, number> = {
    6: 7 * (Math.PI / 4),
    7: 0,
    8: Math.PI / 4,
    11: 3 * (Math.PI / 2),
    13: Math.PI / 2,
    16: 5 * (Math.PI / 4),
    17: Math.PI,
    18: 3 * (Math.PI / 4),
  };

  return (
    <>
      {tokens.map((token, index) => (
        <group
          key={`token${token.playerID}`}
          position={[x, 0, z + index * 2 * GROUND_SIZE]}
          rotation={[Math.PI / 2, 0, Math.PI + mapping[token.direction]]}
        >
          <Cone args={[1, 2]} rotation={[0, 0, 0]} position={[0, 1, 0]}>
            <meshStandardMaterial name="mat" color="blue" />
          </Cone>

          <Cylinder args={[0.5, 0.5, 2]} position={[0, -1, 0]}>
            <meshStandardMaterial name="mat" color="blue" />
          </Cylinder>
        </group>
      ))}
    </>
  );
};
