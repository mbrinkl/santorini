import React from "react";
import {Vector3, Color3} from '@babylonjs/core';

export const Indicator: React.FC<{ xPos: number, yPos: number, zPos: number }> = ({ xPos, yPos, zPos }) => {

    return (
        <>
            <cylinder name="cylinder" diameterTop={2} diameterBottom={0} height={2} updatable={true}
            position={new Vector3(xPos, yPos, zPos)}>
                <standardMaterial name="mat" diffuseColor={Color3.Yellow()} />
            </cylinder>
            
            <cylinder name="cylinder2" diameter={1} height={2} updatable={true}
            position={new Vector3(xPos, yPos + 2, zPos)}>
                <standardMaterial name="mat" diffuseColor={Color3.Yellow()} />
            </cylinder>
        </>
        
    );
};