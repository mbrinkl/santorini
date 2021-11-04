import React, { useRef } from "react";
import { Box, Cone, Cylinder, Ring } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { BoardPosition } from "../../../types/BoardTypes";

export const PlaceIndicator: React.FC<{ boardPos: BoardPosition, height: number }> = ({ boardPos, height }) => {

  const yMap = [0, 3, 5, 7, 7];
  const mesh: any = useRef();

  useFrame(({clock}) => {
    const time = clock.getElapsedTime();
    const scale = 1 + Math.abs((0.5 * Math.sin(time)));
    mesh.current.scale.x = scale;
    mesh.current.scale.y = scale;
  });

  return <Ring userData={{pos: boardPos.pos}}
    ref={mesh}
    args={[0.75, 1, 32]}
    position={[boardPos.x, yMap[height] + 0.1, boardPos.z]}
    rotation={[3 * Math.PI / 2, 0, 0]}
  >
    <meshStandardMaterial color='yellow' />
  </Ring>
};

export const SelectIndicator: React.FC<{ boardPos: BoardPosition, height: number }> = ({ boardPos, height }) => {

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
    <Cone userData={{pos: boardPos.pos}}
      ref={headMesh}
      args={[1, 2]}
      rotation={[Math.PI, 0, 0]}
      position={[boardPos.x, yMap[height], boardPos.z]} >
      <meshStandardMaterial color='yellow' />
    </Cone>

    <Cylinder userData={{pos: boardPos.pos}}
      ref={tailMesh}
      args={[0.5, 0.5, 2]}
      position={[boardPos.x, yMap[height] + 2, boardPos.z]}
    >
      <meshStandardMaterial color='yellow' />
    </Cylinder>
  </>
};

export const MoveIndicator: React.FC<{ boardPos: BoardPosition, height: number }> = ({ boardPos, height }) => {

  const yMap = [0, 3, 5, 7, 7];
  const mesh: any = useRef();

  useFrame(() => {
    mesh.current.rotation.z -= (0.01);
  });

  return <Ring userData={{pos: boardPos.pos}}
    ref={mesh}
    args={[1, 2, 4]}
    position={[boardPos.x, yMap[height] + 0.1, boardPos.z]}
    rotation={[3 * Math.PI / 2, 0, 0]}
  >
    <meshStandardMaterial color='blue' />
  </Ring>
};

export const BuildIndicator: React.FC<{ boardPos: BoardPosition, height: number }> = ({ boardPos, height }) => {

  const yMap = [0, 3, 5, 7, 7];
  const mesh: any = useRef();

  useFrame(({clock}) => {
    const time = clock.getElapsedTime();
    const pos = yMap[height] + (Math.sin(time)) + 1;
    mesh.current.position.y = pos;
  });

  return <Box userData={{pos: boardPos.pos}}
    ref={mesh}
    args={[5, 0.5, 5]}
    position={[boardPos.x, yMap[height] + 0.1, boardPos.z]}
  >
    <meshStandardMaterial color='blue' opacity={0.65} transparent={true} />
  </Box>
};