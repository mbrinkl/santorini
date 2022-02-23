import { Text } from '@react-three/drei';
import { BoardPosition } from '../../types/boardTypesTemp';
import { GROUND_SIZE } from '../../config/board';

export const TextCoords = ({
  boardPositions,
}: {
  boardPositions: BoardPosition[];
}): JSX.Element => {
  const coords: [number, string][] = [
    [0, '5'],
    [5, '4'],
    [10, '3'],
    [15, '2'],
    [20, '1'],
    [20, 'A'],
    [21, 'B'],
    [22, 'C'],
    [23, 'D'],
    [24, 'E'],
  ];

  return (
    <>
      {coords.map(([index, text]) => {
        let { x, z } = boardPositions[index];

        if (Number(text)) {
          x -= GROUND_SIZE;
        } else {
          z += GROUND_SIZE;
        }

        return (
          <Text
            key={`textCoord${text}`}
            position={[x, 0, z]}
            rotation={[(3 * Math.PI) / 2, 0, 0]}
            color="black"
            anchorX="center"
            anchorY="middle"
            fontSize={2.5}
            lineHeight={1}
          >
            {text}
          </Text>
        );
      })}
    </>
  );
};
