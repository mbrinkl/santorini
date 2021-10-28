import React, { useState, useEffect, useRef, useMemo } from "react";
import { useBoardContext, BoardContext } from "./BoardContext";
import classNames from "classnames";
// import { Engine, Scene } from "react-babylonjs";
// import { Vector3, Color3, Color4, AbstractMesh } from "@babylonjs/core";
import { HelpText } from "./HelpText";
import { Ground } from "./BabylonComponents/Ground";
import { BuildingBase, BuildingMid, BuildingTop, Dome } from "./BabylonComponents/Buildings";
import { SelectIndicator, MoveIndicator, BuildIndicator } from "./BabylonComponents/Indicators";
import { WorkerModel } from "./BabylonComponents/WorkerModel";
import { Canvas, useFrame, } from '@react-three/fiber'
import { OrbitControls, Box, Sky, Plane, useContextBridge } from '@react-three/drei';
import { WebGLCubeRenderTarget, RGBAFormat, Euler } from 'three';
import { Scene } from "./Scene";

export const PlayerBoard: React.FC = () => {

  const GROUND_SIZE = 5;
  const GROUND_PADDING = 0.5;
  
  const ContextBridge = useContextBridge(BoardContext);

  const [xPositions, setXPositions] = useState<number[]>([]);
  const [zPositions, setZPositions] = useState<number[]>([]);

  useEffect(() => {

    let xPos : number[] = [];
    let zPos : number[] = [];
    for (var i = -2; i < 3; i++) {
      for (var j = -2; j < 3; j++) {
        xPos.push(GROUND_PADDING + GROUND_PADDING * i + GROUND_SIZE * i);
        zPos.push(GROUND_PADDING + GROUND_PADDING * j + GROUND_SIZE * j);
      }
    }
    setXPositions(xPos);
    setZPositions(zPos);

  }, []);

  return (
    <div id='canvas'>
      <HelpText />
      <Canvas>
        <ContextBridge>
          <Scene xPositions={xPositions} zPositions={zPositions}/>
        </ContextBridge>
      </Canvas>
    </div>
  );
};
