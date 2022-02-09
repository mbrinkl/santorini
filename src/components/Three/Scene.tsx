import { useCallback } from 'react';
import { ThreeEvent } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { GameStage } from '../../types/GameTypes';
import { useBoardContext } from '../../context/boardContext';
import { Ground } from './Ground';
import {
  BuildingBase, BuildingMid, BuildingTop, Dome,
} from './Buildings';
import { Indicator } from './Indicators';
import { WorkerModel } from './WorkerModel';
import { BoardPosition } from '../../types/BoardTypes';
import { TextCoords } from './TextCoords';
import { GenericToken } from './Tokens';

export const Scene = ({ boardPositions } : {
  boardPositions: BoardPosition[]
}): JSX.Element => {
  const {
    G, ctx, moves, isActive,
  } = useBoardContext();

  const onMeshClicked = useCallback((e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();

    if (!isActive) {
      return;
    }

    const { phase } = ctx;
    const stage = ctx.activePlayers?.[ctx.currentPlayer];
    const { pos } = e.object.userData;

    if (G.valids.includes(pos)) {
      if (phase === 'placeWorkers') {
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
  }, [G, ctx, moves, isActive]);

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

      <group onPointerDown={onMeshClicked}>

        {G.spaces.map((space) => (
          <>
            <Ground key={`ground${space.pos}`} boardPos={boardPositions[space.pos]} />
            {space.height >= 1
              && <BuildingBase key={`buildingBase${space.pos}`} boardPos={boardPositions[space.pos]} />}
            {space.height >= 2
              && <BuildingMid key={`buildingMid${space.pos}`} boardPos={boardPositions[space.pos]} />}
            {space.height >= 3
              && <BuildingTop key={`buildingTop${space.pos}`} boardPos={boardPositions[space.pos]} />}
            {space.isDomed
              && <Dome key={`dome${space.pos}`} boardPos={boardPositions[space.pos]} height={space.height} />}
            {space.tokens.length > 0 // TODO: individual tokens
              && (
              <GenericToken
                key={`token${space.pos}`}
                boardPos={boardPositions[space.pos]}
                height={space.height}
                tokens={space.tokens}
              />
              )}
          </>
        ))}

        {Object.values(G.players).map((player) => (
          player.charState.workers.map((worker) => (
            <WorkerModel
              key={`workerModel${player.ID}${worker.pos}`}
              boardPos={boardPositions[worker.pos]}
              height={worker.height}
              color={player.ID === '0' ? 'dodgerblue' : 'grey'}
            />
          ))
        ))}

        {isActive && !ctx.gameover && G.valids.map((pos) => (
          <Indicator
            key={`Indicator${pos}`}
            boardPos={boardPositions[pos]}
            height={G.spaces[pos].height}
            stage={(ctx.activePlayers && ctx.activePlayers[ctx.currentPlayer]) as GameStage}
          />
        ))}
      </group>
    </>
  );
};
