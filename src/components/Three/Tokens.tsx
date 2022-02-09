import { RoundedBox } from '@react-three/drei';
import { Vector3 } from '@react-three/fiber';
import { Token } from '../../types/GameTypes';
import { BoardPosition } from '../../types/BoardTypes';

export const GenericToken = ({ boardPos, height, tokens } : {
  boardPos: BoardPosition,
  height: number,
  tokens: Token[],
}): JSX.Element => {
  const { x, z } = boardPos;
  // Assuming only two tokens per position is possible right now
  const yPosHeightMap = [0, 3, 5, 7, 7];
  const tokenArgs: Vector3 = tokens.length === 1 ? [2, 1, 2] : [1, 1, 1];
  const token0Pos: Vector3 = tokens.length === 1 ? [x, yPosHeightMap[height], z]
    : [x - 1, yPosHeightMap[height], z - 1];
  const token1Pos: Vector3 = [x + 1, yPosHeightMap[height], z + 1];

  return (
    <>
      {
        tokens.map((token, index) => (
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
        ))
      }
    </>
  );
};
