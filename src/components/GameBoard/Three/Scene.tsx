import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useBoardContext } from "../BoardContext";
import classNames from "classnames";
import { HelpText } from "../HelpText";
import { Ground } from "./Ground";
import { BuildingBase, BuildingMid, BuildingTop, Dome } from "./Buildings";
import { SelectIndicator, MoveIndicator, BuildIndicator } from "./Indicators";
import { WorkerModel } from "./WorkerModel";
import { Canvas, useFrame, } from '@react-three/fiber'
import { OrbitControls, Box, Sky, Plane, CycleRaycast } from '@react-three/drei';
import { WebGLCubeRenderTarget, RGBAFormat, Euler, Raycaster } from 'three';

export const Scene: React.FC<{ xPositions: number[], zPositions: number[] }> = ({ xPositions, zPositions }) => {

  const { State, moves} = useBoardContext();

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
  }, []);

  const onMeshClicked = useCallback((e) => {

    let position = -1;

    for (let i = 0; i < 25; i++) {
      if (
        xPositions[i] === e.position.x &&
        zPositions[i] === e.position.z
      ) {
        position = i;
        break;
      }
    }

    console.log(position, State.stage);

    moves.SelectSpace(position);

  }, [State]);

  useFrame(({ gl, scene }) => {
    cubeCamera.current.update(gl, scene)
  })

  return (
    <>
      <cubeCamera name="cubeCamera" ref={cubeCamera} position={[0, 0, 0]} args={[0.1, 100, renderTarget]} />
      <ambientLight />

      <group onPointerDown={(e) => (e.stopPropagation(), onMeshClicked(e.object))}>

      {ground}
      {State.players["0"].char.workers.map((worker) => (
        <WorkerModel xPos={xPositions[worker.pos]}
          zPos={zPositions[worker.pos]}
          height={worker.height}
          color={'red'}
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

      </group>

      <OrbitControls enablePan={false} minDistance={35} maxDistance={35} minPolarAngle={Math.PI / 8} maxPolarAngle={Math.PI / 3} />
    </>
  );
}