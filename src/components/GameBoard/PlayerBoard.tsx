import React, {useState, useEffect} from "react";
// import { Player } from "../../game";
import { useBoardContext } from "./BoardContext";
import classNames from "classnames";
import {Engine, Scene} from 'react-babylonjs';
import {Vector3, Color3, Color4} from '@babylonjs/core';



export const PlayerBoard: React.FC = () => {

  const {
    State,
    moves,
    //playerID,
    playersInfo,
    isActive,
    ctx,
  } = useBoardContext();

  var ground : JSX.Element[] = [];
  var buildings_level1 : JSX.Element[] = [];
  var buildings_level2 : JSX.Element[] = [];
  var buildings_level3 : JSX.Element[] = [];
  var domes : JSX.Element[] = [];

  const GROUND_SIZE = 5;
  const GROUND_PADDING = 0.5;

  let x_positions : number[] = [];
  let z_positions : number[] = [];

  const currentPlayerName = playersInfo.find(
    (p) => String(p.id) === ctx.currentPlayer
  )!.name;

  var counter = 0;

  for(var i = -2; i < 3; i++)
  {
    for(var j = -2; j < 3; j++)
    {
      x_positions[counter] = GROUND_PADDING + (GROUND_PADDING * i) + (GROUND_SIZE * i)
      z_positions[counter] = GROUND_PADDING + (GROUND_PADDING * j) + (GROUND_SIZE * j)

      ground.push(
        <ground name={"ground_" + counter}
        width={GROUND_SIZE} height={GROUND_SIZE} subdivisions={2}
        position={new Vector3(
          x_positions[counter], 
          0, 
          z_positions[counter]
        )}>
        
        <standardMaterial name="ground_mat" diffuseColor={Color3.Green()} specularColor={Color3.Black()} />

        </ground>
      );

      buildings_level1.push(
        <box name={"building1_" + counter} height={3} width={5} depth={5}
        position={new Vector3(x_positions[counter], 1, z_positions[counter])}>

        <standardMaterial name="mat" diffuseColor={Color3.White()} />

        </box>
      );

      buildings_level2.push(
        <box name={"building2_" + counter} height={2} width={4} depth={4}
        position={new Vector3(x_positions[counter], 4, z_positions[counter])}>

        <standardMaterial name="mat" diffuseColor={Color3.White()} />

        </box>
      );

      buildings_level3.push(
        <box name={"building3_" + counter} height={2} width={3} depth={3}
        position={new Vector3(x_positions[counter], 6, z_positions[counter])}>

        <standardMaterial name="mat" diffuseColor={Color3.White()} />

        </box>
      );

      domes.push(
        <sphere name="dome" diameter={3} segments={16} 
        position={new Vector3(x_positions[counter], 7, z_positions[counter])}>

        <standardMaterial name="mat" diffuseColor={Color3.Blue()} />

        </sphere>
      );

      counter++;
    }
  }

  function meshPicked(mesh)
  {
    let position = -1;

    for(let i = 0; i < 25; i++)
    {
      if (x_positions[i] === mesh.position.x && z_positions[i] === mesh.position.z)
      {
        position = i;
        break;
      }
    }

    moves.SelectSpace(position);
  }

  const [rotation, setRotation] = useState(Vector3.Zero());
  const [position, setPosition] = useState(new Vector3(x_positions[0], 1, z_positions[0]));

  useEffect(() => {

    let lastTime = Date.now();

    let timer;
    let direction = 1;
  
    const animate = _ => {
      if (position.y > 3) {
        direction = -1;
      } else if (position.y < 1) {
        direction = 1;
      }
  
      const velocity = 0.05 * direction;
      position.y += velocity;
      const rpm = 10;
      const now = Date.now()
      const deltaTimeInMillis = now - lastTime;
      lastTime = now;
      const rotationRads = ((rpm / 60) * Math.PI * 2 * (deltaTimeInMillis / 1000));
      rotation.y += rotationRads;
      setPosition(position.clone());
      setRotation(rotation.clone());
      timer = requestAnimationFrame(animate);
    };

    timer = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(timer);
  }, [rotation, position]);

  return (
    <div className={classNames(
      "PlayerBoard",
      isActive ? "PlayerBoard--active" : "PlayerBoard--waiting"
      )}>

    <span className="PlayerBoard__hint">
      {isActive ? 
        State.stage === 'place' ? <span>Place two workers</span>
        : State.stage === 'select' ? <span>Select a worker</span>
        : State.stage === 'move' ? <span>Move</span>
        : State.stage === 'build' ? <span>Build</span>
        : <span>End Turn or Undo</span>
      : 
        <span className="PlayerBoard__hint-accent">
          { currentPlayerName } is making a move...
        </span>
      }
    </span>

    <Engine canvasId="canvas" antialias={true}>
      <Scene clearColor={new Color4(0, 0, 0, 0)} onMeshPicked={meshPicked}>
        <arcRotateCamera name="camera" 
          alpha={Math.PI/4} beta={Math.PI/4} radius={50}
          upperBetaLimit={Math.PI/3} lowerRadiusLimit={50} upperRadiusLimit={50}
          target={Vector3.Zero()} />
        <hemisphericLight name="light" intensity={0.7} direction={Vector3.Up()} />

        {ground}

        { isActive && 
        
        <cylinder name="cylinder" diameterTop={2} diameterBottom={0} height={2} updatable={true}
          position={position}>
          <standardMaterial name="mat" diffuseColor={Color3.Black()} />
        </cylinder>
        }

        {State.char1.workers.map( worker => 
          <sphere name={"workersprite_" + worker.pos} diameter={2} segments={16}
            position={new Vector3(x_positions[worker.pos], 
              worker.height === 0 ? 1 : worker.height === 1 ? 4 : worker.height === 2 ? 6 : 8, 
              z_positions[worker.pos])}>
            <standardMaterial name="mat" diffuseColor={Color3.Red()} />
          </sphere>
        )}

        {State.char2.workers.map( worker => 
          <sphere name={"workersprite_" + worker.pos} diameter={2} segments={16}
            position={new Vector3(x_positions[worker.pos], 
              worker.height === 0 ? 1 : worker.height === 1 ? 4 : worker.height === 2 ? 6 : 8, 
              z_positions[worker.pos])}>
            <standardMaterial name="mat" diffuseColor={Color3.Black()} />
          </sphere> 
        )}

        {State.spaces.map( space =>
          <>
            {space.height >= 1 && buildings_level1[space.pos]}
            {space.height >= 2 && buildings_level2[space.pos]}
            {space.height >= 3 && buildings_level3[space.pos]}
            {space.height >= 4 && domes[space.pos]}
          </>
        )}

      </Scene>
    </Engine>

    </div>
  );
}
