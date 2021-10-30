import React, { useRef } from "react";
import { Box, Cone, Cylinder, Ring } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

export const PlaceIndicator: React.FC<{ xPos: number, height: number, zPos: number }> = ({ xPos, height, zPos }) => {

  const yMap = [0, 3, 5, 7, 7];
  const mesh: any = useRef();

  useFrame(({clock}) => {
    const time = clock.getElapsedTime();
    const scale = 1 + Math.abs((0.5 * Math.sin(time)));
    mesh.current.scale.x = scale;
    mesh.current.scale.y = scale;
  });

  return <Ring name={`placeIndicator${xPos}${zPos}`}
    ref={mesh}
    args={[0.75, 1, 32]}
    position={[xPos, yMap[height] + 0.1, zPos]}
    rotation={[3 * Math.PI / 2, 0, 0]}
  >
    <meshStandardMaterial color='yellow' />
  </Ring>
};

export const SelectIndicator: React.FC<{ xPos: number, height: number, zPos: number }> = ({ xPos, height, zPos }) => {

  const yMap = [4, 8, 10, 12, 12];
  const headMesh: any = useRef();
  const tailMesh: any = useRef();

  useFrame(({clock}) => {
    const time = clock.getElapsedTime();
    const pos = yMap[height] + (0.5 * Math.sin(time));
    headMesh.current.position.y = pos;
    tailMesh.current.position.y = pos + 2;
  });

  return <>
    <Cone name={`selectIndicatorHead${xPos}${zPos}`}
      ref={headMesh}
      args={[1, 2]}
      rotation={[Math.PI, 0, 0]}
      position={[xPos, yMap[height], zPos]} >
      <meshStandardMaterial color='yellow' />
    </Cone>

    <Cylinder name={`selectIndicatorTail${xPos}${zPos}`}
      ref={tailMesh}
      args={[0.5, 0.5, 2]}
      position={[xPos, yMap[height] + 2, zPos]}
    >
      <meshStandardMaterial color='yellow' />
    </Cylinder>
  </>
};

export const MoveIndicator: React.FC<{ xPos: number, height: number, zPos: number }> = ({ xPos, height, zPos }) => {

  const yMap = [0, 3, 5, 7, 7];
  const mesh: any = useRef();

  useFrame(() => {
    mesh.current.rotation.z -= (0.01);
  });

  return <Ring name={`moveIndicator${xPos}${zPos}`}
    ref={mesh}
    args={[1, 2, 4]}
    position={[xPos, yMap[height] + 0.1, zPos]}
    rotation={[3 * Math.PI / 2, 0, 0]}
  >
    <meshStandardMaterial color='blue' />
  </Ring>
};

export const BuildIndicator: React.FC<{ xPos: number, height: number, zPos: number }> = ({ xPos, height, zPos }) => {

  const yMap = [0, 3, 5, 7, 7];
  const mesh: any = useRef();

  useFrame(({clock}) => {
    const time = clock.getElapsedTime();
    const pos = yMap[height] + (Math.sin(time)) + 1;
    mesh.current.position.y = pos;
  });

  return <Box name={`buildIndicator${xPos}${zPos}`}
    ref={mesh}
    args={[5, 0.5, 5]}
    position={[xPos, yMap[height] + 0.1, zPos]}
  >
    <meshStandardMaterial color='blue' opacity={0.65} transparent={true} />
  </Box>
};