import React, { useState, useEffect, useRef } from "react";
import { useBoardContext } from "./BoardContext";
import classNames from "classnames";
import { Engine, Scene } from "react-babylonjs";
import { Vector3, Color3, Color4, AbstractMesh } from "@babylonjs/core";
import { HelpText } from "./HelpText";
import { Ground } from "./BabylonComponents/Ground";
import { BuildingBase, BuildingMid, BuildingTop, Dome } from "./BabylonComponents/Buildings";
import { SelectIndicator, MoveIndicator, BuildIndicator } from "./BabylonComponents/Indicators";
import { WorkerModel } from "./BabylonComponents/WorkerModel";

export const PlayerBoard: React.FC = () => {
  const {
    State,
    moves,
    playerID,
    isActive,
    ctx,
  } = useBoardContext();

  const GROUND_SIZE = 5;
  const GROUND_PADDING = 0.5;

  const [xPositions, setXPositions] = useState<number[]>([]);
  const [zPositions, setZPositions] = useState<number[]>([]);
  const [ground, setGround] = useState<JSX.Element[]>([]);
  const [buildings_level1, setBuildingsLevel1] = useState<JSX.Element[]>([]);
  const [buildings_level2, setBuildingsLevel2] = useState<JSX.Element[]>([]);
  const [buildings_level3, setBuildingsLevel3] = useState<JSX.Element[]>([]);

  const [indicatorPos, setIndicatorPos] = useState(2);
  const [indicatorRot, setIndicatorRot] = useState(0);

  const requestRef: any = useRef();
  const previousTimeRef: any = useRef();
  const direction: any = useRef(1);

  const meshPicked = (mesh: AbstractMesh) => {
    let position = -1;

    for (let i = 0; i < 25; i++) {
      if (
        xPositions[i] === mesh.position.x &&
        zPositions[i] === mesh.position.z
      ) {
        position = i;
        break;
      }
    }

    moves.SelectSpace(position);
  }

  const animate = (time: number) => {
    if (previousTimeRef.current !== undefined) {
      const velocity = 0.03;
      setIndicatorPos(
        (prevCount) => prevCount + velocity * direction.current
      );
      setIndicatorRot((prevCount) => (prevCount + velocity) % (2 * Math.PI));
    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  };
  
  useEffect(() => {
    let xPos : number[] = [];
    let zPos : number[] = [];
    let g : JSX.Element[] = [];
    let b1 : JSX.Element[] = [];
    let b2 : JSX.Element[] = [];
    let b3 : JSX.Element[] = [];
    let x = -1;
    let z = -1;
    for (var i = -2; i < 3; i++) {
      for (var j = -2; j < 3; j++) {
        x = GROUND_PADDING + GROUND_PADDING * i + GROUND_SIZE * i;
        z = GROUND_PADDING + GROUND_PADDING * j + GROUND_SIZE * j;
        xPos.push(x);
        zPos.push(z);
        g.push(<Ground xPos={x} zPos={z} />);
        b1.push(<BuildingBase xPos={x} zPos={z} />);
        b2.push(<BuildingMid xPos={x} zPos={z} />);
        b3.push(<BuildingTop xPos={x} zPos={z} />);
      }
    }
    setXPositions(xPos);
    setZPositions(zPos);
    setGround(g);
    setBuildingsLevel1(b1);
    setBuildingsLevel2(b2);
    setBuildingsLevel3(b3);
  }, []);

  useEffect(() => {
    if (indicatorPos > 3) {
      direction.current = -1;
    } else if (indicatorPos < 1) {
      direction.current = 1;
    }

    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [indicatorPos, indicatorRot]);

  return (
    <div
      className={classNames(
        "PlayerBoard", !!ctx.gameover ?
          State.winner === playerID
            ? "PlayerBoard--winner"
            : "PlayerBoard--loser"
          : isActive
          ? "PlayerBoard--active"
          : "PlayerBoard--waiting"
      )}
    >
      <HelpText />

      <Engine canvasId="canvas" antialias={true}>
        <Scene clearColor={new Color4(0, 0, 0, 0)} onMeshPicked={meshPicked}>
          <arcRotateCamera
            name="camera"
            alpha={Math.PI / 4}
            beta={Math.PI / 4}
            radius={50}
            upperBetaLimit={Math.PI / 3}
            lowerRadiusLimit={50}
            upperRadiusLimit={50}
            target={new Vector3(xPositions[12], 0, zPositions[12])}
          />
          <hemisphericLight
            name="light"
            intensity={0.7}
            direction={Vector3.Up()}
          />

          {ground}

          {State.players["0"].char.workers.map((worker) => (
            <WorkerModel xPos = {xPositions[worker.pos]} 
              zPos={zPositions[worker.pos]}
              height={worker.height}
              color={Color3.Red()}
            />
          ))}

          {State.players["1"].char.workers.map((worker) => (
            <WorkerModel xPos = {xPositions[worker.pos]} 
              zPos={zPositions[worker.pos]}
              height={worker.height}
              color={Color3.Gray()}
            />
          ))}

          {State.spaces.map((space) => (
            <>
              {space.height >= 1 && buildings_level1[space.pos]}
              {space.height >= 2 && buildings_level2[space.pos]}
              {space.height >= 3 && buildings_level3[space.pos]}
              {space.is_domed && (
                <Dome
                  xPos={xPositions[space.pos]}
                  zPos={zPositions[space.pos]}
                  height={space.height}
                />
              )}
            </>
          ))}

          {isActive &&
            !ctx.gameover &&
            State.valids.map((pos) =>
              State.stage === "place" ? (
                // todo: place indicator
                <></>
              ) : State.stage === "select" ? (
                <SelectIndicator
                  xPos={xPositions[pos]}
                  yPos={
                    indicatorPos +
                    (State.spaces[pos].height === 0
                      ? 0
                      : State.spaces[pos].height === 1
                      ? 4
                      : State.spaces[pos].height === 2
                      ? 6
                      : 8) +
                    (State.spaces[pos].inhabited ? 2 : 0)
                  }
                  zPos={zPositions[pos]}
                />
              ) : State.stage === "move" ? (
                <MoveIndicator
                  xPos={xPositions[pos]}
                  yPos={
                    State.spaces[pos].height === 0
                      ? 0
                      : State.spaces[pos].height === 1
                      ? 3
                      : State.spaces[pos].height === 2
                      ? 5
                      : 7
                  }
                  zPos={zPositions[pos]}
                  rot={indicatorRot}
                />
              ) : (
                // assume stage is bulid
                <BuildIndicator
                  xPos={xPositions[pos]}
                  yPos={
                    indicatorPos +
                    (State.spaces[pos].height === 0
                      ? 0
                      : State.spaces[pos].height === 1
                      ? 3
                      : State.spaces[pos].height === 2
                      ? 5
                      : 7)
                  }
                  zPos={zPositions[pos]}
                />
              )
            )}
        </Scene>
      </Engine>
    </div>
  );
};
