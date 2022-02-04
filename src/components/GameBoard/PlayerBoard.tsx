import { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { useContextBridge } from '@react-three/drei';
import { HelpText } from './HelpText';
import { useBoardContext, BoardContext } from './BoardContext';
import { Scene } from './Three/Scene';
import { BoardPosition } from '../../types/BoardTypes';
import { GROUND_PADDING, GROUND_SIZE } from '../../config/board';

export const PlayerBoard = () : JSX.Element => {
  const { isActive, ctx, playerID } = useBoardContext();
  const ContextBridge = useContextBridge(BoardContext);
  const [boardPositions, setBoardPositions] = useState<BoardPosition[]>([]);

  useEffect(() => {
    const positions: BoardPosition[] = [];

    for (let i = -2; i < 3; i++) {
      for (let j = -2; j < 3; j++) {
        positions.push({
          pos: positions.length,
          z: (GROUND_PADDING + GROUND_PADDING * i + GROUND_SIZE * i),
          x: (GROUND_PADDING + GROUND_PADDING * j + GROUND_SIZE * j),
        });
      }
    }
    setBoardPositions(positions);
  }, []);

  let outlineClass = 'PlayerBoard';
  if (ctx.gameover) {
    outlineClass += (ctx.gameover.winner === playerID) ? ' PlayerBoard--winner' : ' PlayerBoard--loser';
  } else {
    outlineClass += isActive ? ' PlayerBoard--active' : ' PlayerBoard--waiting';
  }

  return (
    <div className={outlineClass}>
      <HelpText />
      <div id="canvas">
        <Canvas camera={{ fov: 75 }}>
          <ContextBridge>
            <Scene boardPositions={boardPositions} />
          </ContextBridge>
        </Canvas>
      </div>
    </div>
  );
};
