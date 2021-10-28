import React from "react";

export const BuildingBase: React.FC<{ xPos: number, zPos: number }> = ({ xPos, zPos }) => {

    return <></>
    // return (
    //     <box name={"building1_" + (xPos + zPos)} height={3} width={5} depth={5}
    //     position={new Vector3(xPos, 1, zPos)}>

    //         <standardMaterial name="mat" diffuseColor={Color3.White()} />

    //     </box>
    // );
};

export const BuildingMid: React.FC<{ xPos: number, zPos: number }> = ({ xPos, zPos }) => {
    return <></>

    // return (
    //     <box name={"building2_" + (xPos + zPos)} height={2} width={4} depth={4}
    //     position={new Vector3(xPos, 4, zPos)}>

    //     <standardMaterial name="mat" diffuseColor={Color3.White()} />

    //     </box>
    // );
};

export const BuildingTop: React.FC<{ xPos: number, zPos: number }> = ({ xPos, zPos }) => {
    return <></>

    // return (
    //     <box name={"building3_" + (xPos + zPos)} height={2} width={3} depth={3}
    //     position={new Vector3(xPos, 6, zPos)}>

    //     <standardMaterial name="mat" diffuseColor={Color3.White()} />

    //     </box>
    // );
};

export const Dome: React.FC<{ xPos: number, zPos: number, height: number }> = ({ xPos, zPos, height }) => {
    return <></>

    // const yPosHeightMap = [0, 3, 5, 7, 7];
    // console.log('setting dome height: ', yPosHeightMap[height], height)

    // return (
    //     <sphere name="dome" diameter={3} segments={16} slice={0.5}
    //     position={new Vector3(xPos, yPosHeightMap[height], zPos)}>

    //     <standardMaterial name="mat" diffuseColor={Color3.Blue()} />

    //     </sphere>
    // );
};