import React, { useState, useEffect, useRef, useCallback } from "react";
import { useBoardContext } from "../BoardContext";
import { Ground } from "./Ground";
import { BuildingBase, BuildingMid, BuildingTop, Dome } from "./Buildings";
import { PlaceIndicator, SelectIndicator, MoveIndicator, BuildIndicator } from "./Indicators";
import { WorkerModel } from "./WorkerModel";
import { ThreeEvent, useFrame, } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei';
import { WebGLCubeRenderTarget, RGBAFormat } from 'three';
import { BoardPosition } from "../../../types/BoardTypes";

export const Scene: React.FC<{ boardPositions: BoardPosition[] }> = ({ boardPositions }) => {

  const { State, ctx, moves, isActive } = useBoardContext();

  const [ground, setGround] = useState<JSX.Element[]>([]);
  const [buildingsLevel1, setBuildingsLevel1] = useState<JSX.Element[]>([]);
  const [buildingsLevel2, setBuildingsLevel2] = useState<JSX.Element[]>([]);
  const [buildingsLevel3, setBuildingsLevel3] = useState<JSX.Element[]>([]);
  const [renderTarget] = useState(new WebGLCubeRenderTarget(1024, { format: RGBAFormat, generateMipmaps: true }));
  const cubeCamera: any = useRef();

  useEffect(() => {
    const g: JSX.Element[] = [];
    const b1: JSX.Element[] = [];
    const b2: JSX.Element[] = [];
    const b3: JSX.Element[] = [];

    for (const boardPos of boardPositions) {
      g.push(<Ground key={`ground${boardPos.pos}`} boardPos={boardPos} />);
      b1.push(<BuildingBase key={`buildingBase${boardPos.pos}`} boardPos={boardPos} />);
      b2.push(<BuildingMid key={`buildingMid${boardPos.pos}`} boardPos={boardPos} />);
      b3.push(<BuildingTop key={`buildingTop${boardPos.pos}`} boardPos={boardPos} />);
    }

    setGround(g);
    setBuildingsLevel1(b1);
    setBuildingsLevel2(b2);
    setBuildingsLevel3(b3);
  }, [boardPositions]);


  const onMeshClicked = useCallback((e: ThreeEvent<PointerEvent>) => {

    e.stopPropagation();

    const phase = ctx.phase;
    const stage = (ctx.activePlayers && ctx.activePlayers[ctx.currentPlayer]) || null;
    const pos = e.object.userData.pos;

    if (State.valids.includes(pos)) {
      if (phase === 'placeWorkers') {
        moves.Place(pos);
      }
      else {
        switch (stage) {
          case "select":
            moves.Select(pos);
            break;
          case "move":
            moves.Move(pos);
            break;
          case "build":
            moves.Build(pos);
            break;
        }
      }
    }

  }, [State, ctx, moves]);

  useFrame(({ gl, scene }) => {
    cubeCamera.current.update(gl, scene)
  })

  return (
    <>
      <cubeCamera ref={cubeCamera} position={[0, 0, 0]} args={[20, 50, renderTarget]} />
      <hemisphereLight args={['gray', 'black', 0.7]}  />
      <directionalLight args={['white', 0.7]} position={[0, 10, 0]}/>

      <group onPointerDown={onMeshClicked}>

        {ground}
        
        {State.players["0"].char.workers.map((worker, index) => (
          <WorkerModel key={`workerModel0${index}`}
            boardPos={boardPositions[worker.pos]}
            height={worker.height}
            color={'dodgerblue'}
          />
        ))}

        {State.players["1"].char.workers.map((worker, index) => (
          <WorkerModel key={`workerModel1${index}`}
            boardPos={boardPositions[worker.pos]}
            height={worker.height}
            color={'grey'}
          />
        ))}

        {State.spaces.map((space) => (
          <>
            {space.height >= 1 && buildingsLevel1[space.pos]}
            {space.height >= 2 && buildingsLevel2[space.pos]}
            {space.height >= 3 && buildingsLevel3[space.pos]}
            {space.isDomed && (
              <Dome key={`dome${space.pos}`}
                boardPos={boardPositions[space.pos]}
                height={space.height}
              />
            )}
          </>
        ))}

        {isActive &&
          !ctx.gameover &&
          State.valids.map((pos) =>
            (ctx.activePlayers && ctx.activePlayers[ctx.currentPlayer]) === "place" ? (
              <PlaceIndicator key={`placeIndicator${pos}`} boardPos={boardPositions[pos]} height={State.spaces[pos].height} />
            ) : (ctx.activePlayers && ctx.activePlayers[ctx.currentPlayer]) === "select" ? (
              <SelectIndicator key={`selectIndicator${pos}`} boardPos={boardPositions[pos]} height={State.spaces[pos].height} />
            ) : (ctx.activePlayers && ctx.activePlayers[ctx.currentPlayer]) === "move" ? (
              <MoveIndicator key={`moveIndicator${pos}`} boardPos={boardPositions[pos]} height={State.spaces[pos].height} />
            ) : (ctx.activePlayers && ctx.activePlayers[ctx.currentPlayer]) === "build" ? (
              <BuildIndicator key={`bulidIndicator${pos}`} boardPos={boardPositions[pos]} height={State.spaces[pos].height} />
            ) : (
              // todo: special move indicator
              <></>
            )
          )
        }

      </group>

      <OrbitControls key="orbitControls" enablePan={false} minDistance={30} maxDistance={30} minPolarAngle={0} maxPolarAngle={Math.PI / 3} />
    </>
  );
}