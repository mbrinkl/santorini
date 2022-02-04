import { useState, useEffect, useCallback } from 'react';
import { ThreeEvent } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { GameStage } from '../../../types/GameTypes';
import { useBoardContext } from '../BoardContext';
import { Ground } from './Ground';
import {
  BuildingBase, BuildingMid, BuildingTop, Dome,
} from './Buildings';
import { Indicator } from './Indicators';
import { WorkerModel } from './WorkerModel';
import { BoardPosition } from '../../../types/BoardTypes';

export const Scene = ({ boardPositions } : {
  boardPositions: BoardPosition[]
}): JSX.Element => {
  const {
    G, ctx, moves, isActive,
  } = useBoardContext();

  const [ground, setGround] = useState<JSX.Element[]>([]);
  const [buildingsLevel1, setBuildingsLevel1] = useState<JSX.Element[]>([]);
  const [buildingsLevel2, setBuildingsLevel2] = useState<JSX.Element[]>([]);
  const [buildingsLevel3, setBuildingsLevel3] = useState<JSX.Element[]>([]);

  useEffect(() => {
    const g: JSX.Element[] = [];
    const b1: JSX.Element[] = [];
    const b2: JSX.Element[] = [];
    const b3: JSX.Element[] = [];

    boardPositions.forEach((boardPos) => {
      g.push(<Ground key={`ground${boardPos.pos}`} boardPos={boardPos} />);
      b1.push(<BuildingBase key={`buildingBase${boardPos.pos}`} boardPos={boardPos} />);
      b2.push(<BuildingMid key={`buildingMid${boardPos.pos}`} boardPos={boardPos} />);
      b3.push(<BuildingTop key={`buildingTop${boardPos.pos}`} boardPos={boardPos} />);
    });

    setGround(g);
    setBuildingsLevel1(b1);
    setBuildingsLevel2(b2);
    setBuildingsLevel3(b3);
  }, [boardPositions]);

  const onMeshClicked = useCallback((e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();

    const { phase } = ctx;
    const stage = (ctx.activePlayers && ctx.activePlayers[ctx.currentPlayer]) || null;
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
  }, [G, ctx, moves]);

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

      <group onPointerDown={onMeshClicked}>

        {ground}

        {G.players['0'].charState.workers.map((worker) => (
          <WorkerModel
            key={`workerModel0${worker.pos}`}
            boardPos={boardPositions[worker.pos]}
            height={worker.height}
            color="dodgerblue"
          />
        ))}

        {G.players['1'].charState.workers.map((worker) => (
          <WorkerModel
            key={`workerModel1${worker.pos}`}
            boardPos={boardPositions[worker.pos]}
            height={worker.height}
            color="grey"
          />
        ))}

        {G.spaces.map((space) => (
          <>
            {space.height >= 1 && buildingsLevel1[space.pos]}
            {space.height >= 2 && buildingsLevel2[space.pos]}
            {space.height >= 3 && buildingsLevel3[space.pos]}
            {space.isDomed && (
              <Dome
                key={`dome${space.pos}`}
                boardPos={boardPositions[space.pos]}
                height={space.height}
              />
            )}
          </>
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
