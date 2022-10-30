import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { useContextBridge } from '@react-three/drei';
import classNames from 'classnames';
import HelpText from './HelpText';
import { useBoardContext, BoardContext } from '../../context/boardContext';
import Scene from '../three/Scene';
import './PlayerBoard.scss';

const PlayerBoard = (): JSX.Element => {
  const { isActive, ctx, playerID } = useBoardContext();
  const ContextBridge = useContextBridge(BoardContext);

  let outlineClass = '';

  if (!playerID) {
    outlineClass = 'player-board--spectator';
  } else if (ctx.gameover) {
    outlineClass =
      ctx.gameover.winner === playerID
        ? 'player-board--winner'
        : 'player-board--loser';
  } else {
    outlineClass = isActive ? 'player-board--active' : 'player-board--waiting';
  }

  return (
    <div className={classNames('player-board', outlineClass)}>
      <HelpText />
      <div className="player-board__canvas">
        <Suspense fallback={null}>
          <Canvas camera={{ fov: 75 }}>
            <ContextBridge>
              <Scene />
            </ContextBridge>
          </Canvas>
        </Suspense>
      </div>
    </div>
  );
};

export default PlayerBoard;
