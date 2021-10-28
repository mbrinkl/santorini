import React, { useState, useEffect, useRef, useMemo } from "react";
import { useBoardContext } from "./BoardContext";
import classNames from "classnames";
import { HelpText } from "./HelpText";
import { Ground } from "./BabylonComponents/Ground";
import { BuildingBase, BuildingMid, BuildingTop, Dome } from "./BabylonComponents/Buildings";
import { SelectIndicator, MoveIndicator, BuildIndicator } from "./BabylonComponents/Indicators";
import { WorkerModel } from "./BabylonComponents/WorkerModel";
import { Canvas, useFrame, } from '@react-three/fiber'
import { OrbitControls, Box, Sky, Plane } from '@react-three/drei';
import { WebGLCubeRenderTarget, RGBAFormat, Euler } from 'three';

export const Scene: React.FC<{xPositions: number[], zPositions: number[]}> = ({xPositions, zPositions}) => {

  const {
    State,
    moves,
    playerID,
    isActive,
    ctx,
  } = useBoardContext();

  console.log('reset');

  //console.log("PLEASE WORK LMFAO");
  //console.log(State.stage, moves, playerID, isActive, ctx);

  const [ground, setGround] = useState<JSX.Element[]>([]);
  const [renderTarget] = useState(new WebGLCubeRenderTarget(1024, { format: RGBAFormat, generateMipmaps: true }));
  const cubeCamera : any = useRef();

  function shrek2(var1, var2) {
    console.log('callback', var1, var2);
    console.log(xPositions, zPositions);

    let position = -1;

    for (let i = 0; i < 25; i++) {
      if (
        xPositions[i] === var1 &&
        zPositions[i] === var2
      ) {
        position = i;
        break;
      }
    }

    console.log(position);

    moves.SelectSpace(position);
    console.log('hoorah', State.stage);
  }

  useEffect(() => {

    const g : JSX.Element[] = [];
    const b1 : JSX.Element[] = [];
    const b2 : JSX.Element[] = [];
    const b3 : JSX.Element[] = [];
    for (var i = 0; i < 25; i++) {
      g.push(<Ground xPos={xPositions[i]} zPos={zPositions[i]} callback={shrek2}/>);
        //b1.push(<BuildingBase xPos={x} zPos={z} />);
        //b2.push(<BuildingMid xPos={x} zPos={z} />);
        //b3.push(<BuildingTop xPos={x} zPos={z} />);
    }

    setGround(g);
    // setBuildingsLevel1(b1);
    // setBuildingsLevel2(b2);
    // setBuildingsLevel3(b3);
 }, [State]);

  useFrame(({ gl, scene }) => {
    cubeCamera.current.update(gl, scene)
  })

  return (
    <>
      <cubeCamera name="cubeCamera" ref={cubeCamera} position={[0, 0, 0]} args={[0.1, 100, renderTarget]} />
      <ambientLight />

      {ground}
      {State.players["0"].char.workers.map((worker) => (
        <WorkerModel xPos = {xPositions[worker.pos]} 
          zPos={zPositions[worker.pos]}
          height={worker.height}
          color={'red'}
        />
      ))}

      {State.players["1"].char.workers.map((worker) => (
              <WorkerModel xPos = {xPositions[worker.pos]} 
                zPos={zPositions[worker.pos]}
                height={worker.height}
                color={'grey'}
              />
      ))}

      {/* <Box args={[2, 2, 2]}>
        <meshPhysicalMaterial color="#f51d63" envMap={renderTarget.texture} metalness={1} roughness={0} />
      </Box> */}

      <OrbitControls enablePan={false} minDistance={35} maxDistance={35} minPolarAngle={Math.PI / 8} maxPolarAngle={Math.PI / 3}/>
    </>
  );
}