import { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { useContextBridge } from '@react-three/drei';
import classNames from 'classnames';
import { HelpText } from './HelpText';
import { useBoardContext, BoardContext } from '../../context/boardContext';
import { Scene } from '../Three/Scene';
import { BoardPosition } from '../../types/BoardTypes';
import { GROUND_PADDING, GROUND_SIZE } from '../../config/board';
import './PlayerBoard.scss';

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

  let outlineClass = '';

  if (!playerID) {
    outlineClass = 'player-board--spectator';
  } else if (ctx.gameover) {
    outlineClass = (ctx.gameover.winner === playerID) ? 'player-board--winner' : 'player-board--loser';
  } else {
    outlineClass = isActive ? 'player-board--active' : 'player-board--waiting';
  }

  return (
    <div className={classNames('player-board', outlineClass)}>
      <HelpText />
      <div className="player-board__canvas">
        <Canvas camera={{ fov: 75 }}>
          <ContextBridge>
            <Scene boardPositions={boardPositions} />
          </ContextBridge>
        </Canvas>
      </div>
    </div>
  );
};
