import React, { useRef, useState } from "react";
import { Box, Cone, Cylinder, Ring } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Euler } from "three";

export const PlaceIndicator: React.FC<{ xPos: number, height: number, zPos: number }> = ({ xPos, height, zPos }) => {

  const yMap = [0, 3, 5, 7, 7];
  const mesh: any = useRef();
  const [multiplier, setMultiplier] = useState(1);

  useFrame(() => {
    if (mesh.current.scale.x < 1) {
      setMultiplier(1);
    }
    else if (mesh.current.scale.x > 1.5) {
      setMultiplier(-1);
    }

    mesh.current.scale.x += (0.005 * multiplier);
    mesh.current.scale.y += (0.005 * multiplier);
  });

  return <Ring name={`moveIndicator${xPos}${zPos}`}
    ref={mesh}
    args={[0.75, 1, 32]}
    position={[xPos, yMap[height] + 0.1, zPos]}
    rotation={new Euler(3 * Math.PI / 2, 0, 0, 'XYZ')}
  >
    <meshStandardMaterial color='yellow' />
  </Ring>
};

export const SelectIndicator: React.FC<{ xPos: number, height: number, zPos: number }> = ({ xPos, height, zPos }) => {

  const yMap = [4, 8, 10, 12, 12];
  const headMesh: any = useRef();
  const tailMesh: any = useRef();
  const [multiplier, setMultiplier] = useState(1);

  useFrame(() => {
    if (headMesh.current.position.y < yMap[height]) {
      setMultiplier(1);
    }
    else if (headMesh.current.position.y > yMap[height] + 0.5) {
      setMultiplier(-1);
    }

    headMesh.current.position.y += (0.01 * multiplier);
    tailMesh.current.position.y += (0.01 * multiplier);
  });

  return <>
    <Cone name={`selectIndicatorHead${xPos}${zPos}`}
      ref={headMesh}
      args={[1, 2]}
      rotation={new Euler(Math.PI, 0, 0, 'XYZ')}
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
    rotation={new Euler(3 * Math.PI / 2, 0, 0, 'XYZ')}
  >
    <meshStandardMaterial color='blue' />
  </Ring>
};

export const BuildIndicator: React.FC<{ xPos: number, height: number, zPos: number }> = ({ xPos, height, zPos }) => {

  const yMap = [0, 3, 5, 7, 7];
  const mesh: any = useRef();
  const [multiplier, setMultiplier] = useState(1);

  useFrame(() => {
    if (mesh.current.position.y < yMap[height]) {
      setMultiplier(1);
    }
    else if (mesh.current.position.y > yMap[height] + 2) {
      setMultiplier(-1);
    }

    mesh.current.position.y += (0.03 * multiplier);
  });

  return <Box name={`buildIndicator${xPos}${zPos}`}
    ref={mesh}
    args={[5, 0.5, 5]}
    position={[xPos, yMap[height] + 0.1, zPos]}
  >
    <meshStandardMaterial color='blue' opacity={0.65} transparent={true} />
  </Box>
};