import React from "react";
import {Vector3, Color3} from '@babylonjs/core';

export const Ground: React.FC<{ xPos: number, zPos: number }> = ({ xPos, zPos }) => {

    const GROUND_SIZE = 5;

    return (
        <ground name={"ground_" + (xPos + zPos)}
        width={GROUND_SIZE} height={GROUND_SIZE} subdivisions={2}
        position={new Vector3(xPos, 0, zPos)}>
        
            <standardMaterial name="ground_mat" diffuseColor={Color3.Green()} specularColor={Color3.Black()} />

        </ground>
    );
};
