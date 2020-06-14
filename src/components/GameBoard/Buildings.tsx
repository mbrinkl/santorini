import React from "react";
import {Vector3, Color3} from '@babylonjs/core';

export const BuildingBase: React.FC<{ xPos: number, zPos: number }> = ({ xPos, zPos }) => {

    return (
        <box name={"building1_" + (xPos + zPos)} height={3} width={5} depth={5}
        position={new Vector3(xPos, 1, zPos)}>

            <standardMaterial name="mat" diffuseColor={Color3.White()} />

        </box>
    );
};

export const BuildingMid: React.FC<{ xPos: number, zPos: number }> = ({ xPos, zPos }) => {

    return (
        <box name={"building2_" + (xPos + zPos)} height={2} width={4} depth={4}
        position={new Vector3(xPos, 4, zPos)}>

        <standardMaterial name="mat" diffuseColor={Color3.White()} />

        </box>
    );
};

export const BuildingTop: React.FC<{ xPos: number, zPos: number }> = ({ xPos, zPos }) => {

    return (
        <box name={"building3_" + (xPos + zPos)} height={2} width={3} depth={3}
        position={new Vector3(xPos, 6, zPos)}>

        <standardMaterial name="mat" diffuseColor={Color3.White()} />

        </box>
    );
};

export const Dome: React.FC<{ xPos: number, yPos: number, zPos: number }> = ({ xPos, yPos, zPos }) => {

    return (
        <sphere name="dome" diameter={3} segments={16} slice={0.5}
        position={new Vector3(xPos, yPos, zPos)}>

        <standardMaterial name="mat" diffuseColor={Color3.Blue()} />

        </sphere>
    );
};