import {Vector3, Color3} from '@babylonjs/core';

export const WorkerModel: React.FC<{ xPos: number, zPos: number, height: number, color: Color3 }> = ({ xPos, zPos, height, color }) => {

  const yPosHeightMap = [1, 4, 6, 8];

  return (
    <sphere
      name={`workerModel${xPos}${zPos}`}
      diameter={2}
      segments={16}
      position={new Vector3(xPos, yPosHeightMap[height], zPos)}
    >
      <standardMaterial name="mat" diffuseColor={color} />
    </sphere>

  );
};