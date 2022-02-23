import React, { useCallback, useMemo } from 'react';
import { ThreeEvent } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { GameStage } from '../../types/gameTypesTemp';
import { useBoardContext } from '../../context/boardContext';
import { Ground } from './Ground';
import { BuildingBase, BuildingMid, BuildingTop, Dome } from './Buildings';
import { Indicator } from './Indicators';
import { WorkerModel } from './WorkerModel';
import { BoardPosition } from '../../types/boardTypesTemp';
import { TextCoords } from './TextCoords';
import { GenericOffBoardToken, GenericToken } from './Tokens';
import { GROUND_PADDING, GROUND_SIZE } from '../../config/board';

export const Scene = (): JSX.Element => {
  const { G, ctx, moves, isActive } = useBoardContext();

  const boardPositions = useMemo(() => {
    const positions: BoardPosition[] = [];

    for (let i = -2; i < 3; i++) {
      for (let j = -2; j < 3; j++) {
        positions.push({
          pos: positions.length,
          z: GROUND_PADDING + GROUND_PADDING * i + GROUND_SIZE * i,
          x: GROUND_PADDING + GROUND_PADDING * j + GROUND_SIZE * j,
        });
      }
    }

    return positions;
  }, []);

  const onMeshClicked = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();

      if (!isActive) {
        return;
      }

      const { phase } = ctx;
      const stage = ctx.activePlayers?.[ctx.currentPlayer];
      const { pos } = e.object.userData;

      if (G.valids.includes(pos)) {
        if (phase === 'beforeBoardSetup' || phase === 'afterBoardSetup') {
          moves.setup(pos);
        } else if (phase === 'boardSetup') {
          moves.place(pos);
        } else {
          switch (stage) {
            case 'select':
              moves.select(pos);
              break;
            case 'move':
              moves.move(pos);
              break;
            case 'build':
              moves.build(pos);
              break;
            case 'special':
              moves.special(pos);
              break;
            default:
              break;
          }
        }
      }
    },
    [G, ctx, moves, isActive],
  );

  return (
    <>
      <hemisphereLight args={['gray', 'black', 0.7]} />
      <directionalLight args={['white', 0.7]} position={[0, 10, 0]} />
      <OrbitControls
        enablePan={false}
        minDistance={30}
        maxDistance={30}
        minPolarAngle={0}
        maxPolarAngle={Math.PI / 3}
      />

      <TextCoords boardPositions={boardPositions} />

      <GenericOffBoardToken tokens={G.offBoardTokens} />

      <group onPointerDown={onMeshClicked}>
        {G.spaces.map((space) => (
          <React.Fragment key={space.pos}>
            <Ground boardPos={boardPositions[space.pos]} />
            {space.height >= 1 && (
              <BuildingBase boardPos={boardPositions[space.pos]} />
            )}
            {space.height >= 2 && (
              <BuildingMid boardPos={boardPositions[space.pos]} />
            )}
            {space.height >= 3 && (
              <BuildingTop boardPos={boardPositions[space.pos]} />
            )}
            {space.isDomed && (
              <Dome
                boardPos={boardPositions[space.pos]}
                height={space.height}
              />
            )}
            {space.tokens.length > 0 && ( // TODO: individual tokens
              <GenericToken
                boardPos={boardPositions[space.pos]}
                height={space.height}
                tokens={space.tokens}
              />
            )}
          </React.Fragment>
        ))}

        {Object.values(G.players).map((player) =>
          player.charState.workers.map((worker) => (
            <WorkerModel
              key={`${player.ID}${worker.pos}`}
              boardPos={boardPositions[worker.pos]}
              height={worker.height}
              color={player.ID === '0' ? 'dodgerblue' : 'grey'}
            />
          )),
        )}

        {isActive &&
          !ctx.gameover &&
          G.valids.map((pos) => (
            <Indicator
              key={pos}
              boardPos={boardPositions[pos]}
              height={G.spaces[pos].height}
              stage={
                (ctx.activePlayers &&
                  ctx.activePlayers[ctx.currentPlayer]) as GameStage
              }
            />
          ))}
      </group>
    </>
  );
};
