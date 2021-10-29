import React from "react";
import { Box, Sphere } from "@react-three/drei";

export const BuildingBase: React.FC<{ xPos: number, zPos: number }> = ({ xPos, zPos }) => {

    return <Box name={`buildingBase${xPos}${zPos}`} 
        args={[5, 3, 5]} 
        position={[xPos, 1, zPos]} >
        <meshStandardMaterial color='white' />
    </Box>
};

export const BuildingMid: React.FC<{ xPos: number, zPos: number }> = ({ xPos, zPos }) => {
    return <Box name={`buildingMid${xPos}${zPos}`} 
        args={[4, 2, 4]} 
        position={[xPos, 4, zPos]} >
        <meshStandardMaterial color='white' />
    </Box>
};

export const BuildingTop: React.FC<{ xPos: number, zPos: number }> = ({ xPos, zPos }) => {
    return <Box name={`buildingTop${xPos}${zPos}`} 
        args={[3, 2, 3]} 
        position={[xPos, 6, zPos]} >
        <meshStandardMaterial color='white' />
    </Box>
};

export const Dome: React.FC<{ xPos: number, zPos: number, height: number }> = ({ xPos, zPos, height }) => {

    const yPosHeightMap = [0, 3, 5, 7, 7];

    return <Sphere name={`dome${xPos}${zPos}`}
      args={[1.5, 16]}
      position={[xPos, yPosHeightMap[height], zPos]}
    >
      <meshStandardMaterial name="mat" color='blue' />
    </Sphere>
};