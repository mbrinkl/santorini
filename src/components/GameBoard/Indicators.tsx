import React from "react";
import {Vector3, Color3} from '@babylonjs/core';

export const SelectIndicator: React.FC<{ xPos: number, yPos: number, zPos: number }> = ({ xPos, yPos, zPos }) => {

    return (
        <>
            <cylinder name="selectIndicatorHead" diameterTop={2} diameterBottom={0} height={2} updatable={true}
            position={new Vector3(xPos, yPos, zPos)}>
                <standardMaterial name="mat" diffuseColor={Color3.Yellow()} />
            </cylinder>
            
            <cylinder name="selectIndicatorTail" diameter={1} height={2} updatable={true}
            position={new Vector3(xPos, yPos + 2, zPos)}>
                <standardMaterial name="mat" diffuseColor={Color3.Yellow()} />
            </cylinder>
        </>
        
    );
};

export const MoveIndicator: React.FC<{ xPos: number, yPos: number, zPos: number, rot: number }> = ({ xPos, yPos, zPos, rot }) => {

    return (
        <ribbon name="buildIndicator"
            position={new Vector3(xPos, yPos, zPos)} rotation={new Vector3(0, rot, 0)}
            pathArray={[[new Vector3(1, 1, 0), new Vector3(0, 1, 1), new Vector3(-1, 1, 0), new Vector3(0, 1, -1), new Vector3(1, 1, 0)], 
            [new Vector3(2, 1, 0), new Vector3(0, 1, 2), new Vector3(-2, 1, 0), new Vector3(0, 1, -2), new Vector3(2, 1, 0)]]}>
          <standardMaterial name="mat" alpha={0.5} diffuseColor={Color3.Blue()} />
        </ribbon>
    );
};

export const BuildIndicator: React.FC<{ xPos: number, yPos: number, zPos: number }> = ({ xPos, yPos, zPos }) => {

    return (
        <box name="moveIndicator" position={new Vector3(xPos, yPos - 1, zPos)} 
            height={0.5} width={5} depth={5}>
            <standardMaterial name="mat" alpha={0.5} diffuseColor={Color3.Blue()}  />
        </box>
    );
};