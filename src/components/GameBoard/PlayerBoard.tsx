import React, { useState, useEffect } from "react";
import { useBoardContext, BoardContext } from "./BoardContext";
import classNames from "classnames";
import { HelpText } from "./HelpText";
import { Canvas } from '@react-three/fiber'
import { useContextBridge } from '@react-three/drei';
import { Scene } from "./Three/Scene";

export const PlayerBoard: React.FC = () => {

  const { isActive, ctx, playerID } = useBoardContext();

  const GROUND_SIZE = 5;
  const GROUND_PADDING = 0.5;

  const ContextBridge = useContextBridge(BoardContext);

  const [xPositions, setXPositions] = useState<number[]>([]);
  const [zPositions, setZPositions] = useState<number[]>([]);

  useEffect(() => {

    const xPos: number[] = [];
    const zPos: number[] = [];
    for (let i = -2; i < 3; i++) {
      for (let j = -2; j < 3; j++) {
        xPos.push(GROUND_PADDING + GROUND_PADDING * i + GROUND_SIZE * i);
        zPos.push(GROUND_PADDING + GROUND_PADDING * j + GROUND_SIZE * j);
      }
    }
    setXPositions(xPos);
    setZPositions(zPos);

  }, []);

  return (
    <div
      className={classNames(
        "PlayerBoard", ctx.gameover ?
        ctx.gameover.winner === playerID
          ? "PlayerBoard--winner"
          : "PlayerBoard--loser"
        : isActive
          ? "PlayerBoard--active"
          : "PlayerBoard--waiting"
      )}>

      <HelpText />

      <div id='canvas'>
        <Canvas>
          <ContextBridge>
            <Scene xPositions={xPositions} zPositions={zPositions} />
          </ContextBridge>
        </Canvas>
      </div>
    </div>
  );
};
