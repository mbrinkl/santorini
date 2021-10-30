
import { Sphere } from "@react-three/drei";

export const WorkerModel: React.FC<{ xPos: number, zPos: number, height: number, color: string }> = ({ xPos, zPos, height, color }) => {

  const yPosHeightMap = [1, 4, 6, 8];

  return (
    <Sphere
      args={[1, 16]}
      name={`workerModel${xPos}${zPos}`}
      position={[xPos, yPosHeightMap[height], zPos]}
    >
      <meshStandardMaterial name="mat" color={color} roughness={0.25}/>
    </Sphere>

  );
};