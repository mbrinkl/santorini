import React from "react";
import { Box, Sphere } from "@react-three/drei";

export const BuildingBase: React.FC<{ xPos: number, zPos: number }> = ({ xPos, zPos }) => {

    return <Box
        args={[5, 3, 5]} 
        position={[xPos, 1, zPos]} >
        <meshStandardMaterial color='white' />
    </Box>
};

export const BuildingMid: React.FC<{ xPos: number, zPos: number }> = ({ xPos, zPos }) => {
    return <Box
        args={[4, 2, 4]} 
        position={[xPos, 4, zPos]} >
        <meshStandardMaterial color='white' />
    </Box>
};

export const BuildingTop: React.FC<{ xPos: number, zPos: number }> = ({ xPos, zPos }) => {
    return <Box
        args={[3, 2, 3]} 
        position={[xPos, 6, zPos]} >
        <meshStandardMaterial color='white' />
    </Box>
};

export const Dome: React.FC<{ xPos: number, zPos: number, height: number }> = ({ xPos, zPos, height }) => {

    const yPosHeightMap = [0, 3, 5, 7, 7];

    return <Sphere
      args={[1.5, 16]}
      position={[xPos, yPosHeightMap[height], zPos]}
    >
      <meshStandardMaterial name="mat" color='blue' />
    </Sphere>
};