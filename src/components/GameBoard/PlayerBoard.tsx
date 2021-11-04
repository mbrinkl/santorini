import React, { useState, useEffect } from "react";
import { useBoardContext, BoardContext } from "./BoardContext";
import classNames from "classnames";
import { HelpText } from "./HelpText";
import { Canvas } from '@react-three/fiber'
import { useContextBridge } from '@react-three/drei';
import { Scene } from "./Three/Scene";
import { BoardPosition } from "../../types/BoardTypes";
import { GROUND_PADDING, GROUND_SIZE } from "../../config/board";

export const PlayerBoard: React.FC = () => {

  const { isActive, ctx, playerID } = useBoardContext();
  const ContextBridge = useContextBridge(BoardContext);
  const [boardPositions, setBoardPositions] = useState<BoardPosition[]>([]);

  useEffect(() => {

    const positions: BoardPosition[] = [];

    for (let i = -2; i < 3; i++) {
      for (let j = -2; j < 3; j++) {
        positions.push({
          pos: positions.length,
          x: (GROUND_PADDING + GROUND_PADDING * i + GROUND_SIZE * i),
          z: (GROUND_PADDING + GROUND_PADDING * j + GROUND_SIZE * j)
        });   
      }
    }
    setBoardPositions(positions);

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
            <Scene boardPositions={boardPositions} />
          </ContextBridge>
        </Canvas>
      </div>
    </div>
  );
};
