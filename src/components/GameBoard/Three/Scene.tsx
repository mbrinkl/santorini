import React, { useState, useEffect, useRef, useCallback } from "react";
import { useBoardContext } from "../BoardContext";
import { Ground } from "./Ground";
import { BuildingBase, BuildingMid, BuildingTop, Dome } from "./Buildings";
import { PlaceIndicator, SelectIndicator, MoveIndicator, BuildIndicator } from "./Indicators";
import { WorkerModel } from "./WorkerModel";
import { ThreeEvent, useFrame, } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei';
import { WebGLCubeRenderTarget, RGBAFormat } from 'three';

export const Scene: React.FC<{ xPositions: number[], zPositions: number[] }> = ({ xPositions, zPositions }) => {

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

    for (var i = 0; i < 25; i++) {
      g.push(<Ground xPos={xPositions[i]} zPos={zPositions[i]} />);
      b1.push(<BuildingBase xPos={xPositions[i]} zPos={zPositions[i]} />);
      b2.push(<BuildingMid xPos={xPositions[i]} zPos={zPositions[i]} />);
      b3.push(<BuildingTop xPos={xPositions[i]} zPos={zPositions[i]} />);
    }

    setGround(g);
    setBuildingsLevel1(b1);
    setBuildingsLevel2(b2);
    setBuildingsLevel3(b3);
  }, [xPositions, zPositions]);


  const onMeshClicked = useCallback((e: ThreeEvent<PointerEvent>) => {

    e.stopPropagation();

    const phase = ctx.phase;
    const stage = (ctx.activePlayers && ctx.activePlayers[ctx.currentPlayer]) || null;
    let pos = -1;

    for (let i = 0; i < 25; i++) {
      if (
        xPositions[i] === e.object.position.x &&
        zPositions[i] === e.object.position.z
      ) {
        pos = i;
        break;
      }
    }

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

  }, [State, ctx, moves, xPositions, zPositions]);

  useFrame(({ gl, scene }) => {
    cubeCamera.current.update(gl, scene)
  })

  return (
    <>
      <cubeCamera name="cubeCamera" ref={cubeCamera} position={[0, 0, 0]} args={[20, 50, renderTarget]} />
      <hemisphereLight args={['gray', 'black', 0.7]}  />
      <directionalLight args={['white', 0.7]} position={[0, 10, 0]}/>

      <group onPointerDown={onMeshClicked}>

      {ground}
      {State.players["0"].char.workers.map((worker) => (
        <WorkerModel xPos={xPositions[worker.pos]}
          zPos={zPositions[worker.pos]}
          height={worker.height}
          color={'dodgerblue'}
        />
      ))}

      {State.players["1"].char.workers.map((worker) => (
        <WorkerModel xPos={xPositions[worker.pos]}
          zPos={zPositions[worker.pos]}
          height={worker.height}
          color={'grey'}
        />
      ))}

      {State.spaces.map((space) => (
        <>
          {space.height >= 1 && buildingsLevel1[space.pos]}
          {space.height >= 2 && buildingsLevel2[space.pos]}
          {space.height >= 3 && buildingsLevel3[space.pos]}
          {space.is_domed && (
            <Dome
              xPos={xPositions[space.pos]}
              zPos={zPositions[space.pos]}
              height={space.height}
            />
          )}
        </>
      ))}

      {isActive &&
        !ctx.gameover &&
        State.valids.map((pos) =>
          (ctx.activePlayers && ctx.activePlayers[ctx.currentPlayer]) === "place" ? (
            <PlaceIndicator xPos={xPositions[pos]} height={State.spaces[pos].height} zPos={zPositions[pos]} />
          ) : (ctx.activePlayers && ctx.activePlayers[ctx.currentPlayer]) === "select" ? (
            <SelectIndicator xPos={xPositions[pos]} height={State.spaces[pos].height} zPos={zPositions[pos]} />
          ) : (ctx.activePlayers && ctx.activePlayers[ctx.currentPlayer]) === "move" ? (
            <MoveIndicator xPos={xPositions[pos]} height={State.spaces[pos].height} zPos={zPositions[pos]} />
          ) : (ctx.activePlayers && ctx.activePlayers[ctx.currentPlayer]) === "build" ? (
            <BuildIndicator xPos={xPositions[pos]} height={State.spaces[pos].height} zPos={zPositions[pos]} />
          ) : (
            // todo: special move indicator
            <></>
          )
        )
      }

      </group>

      <OrbitControls enablePan={false} minDistance={30} maxDistance={30} minPolarAngle={0} maxPolarAngle={Math.PI / 3} />
    </>
  );
}