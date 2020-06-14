import React, {useState, useEffect} from "react";
// import { Player } from "../../game";
import { useBoardContext } from "./BoardContext";
import classNames from "classnames";
import {Engine, Scene} from 'react-babylonjs';
import {Vector3, Color3, Color4} from '@babylonjs/core';
import { HelpText } from "./HelpText";
import { Ground } from "./Ground";
import { BuildingBase, BuildingMid, BuildingTop, Dome } from "./Buildings"
import { Indicator } from "./Indicator";

export const PlayerBoard: React.FC = () => {

  const {
    State,
    moves,
    playerID,
    //playersInfo,
    isActive,
    ctx,
  } = useBoardContext();

  var ground : JSX.Element[] = [];
  var buildings_level1 : JSX.Element[] = [];
  var buildings_level2 : JSX.Element[] = [];
  var buildings_level3 : JSX.Element[] = [];

  const GROUND_SIZE = 5;
  const GROUND_PADDING = 0.5;

  let x_positions : number[] = [];
  let z_positions : number[] = [];

  const [rotation, setRotation] = useState(Vector3.Zero());
  const [position, setPosition] = useState(2);

  var counter = 0;

  for(var i = -2; i < 3; i++)
  {
    for(var j = -2; j < 3; j++)
    {
      x_positions[counter] = GROUND_PADDING + (GROUND_PADDING * i) + (GROUND_SIZE * i)
      z_positions[counter] = GROUND_PADDING + (GROUND_PADDING * j) + (GROUND_SIZE * j)

      ground.push(<Ground xPos={x_positions[counter]} zPos={z_positions[counter]} />);
      buildings_level1.push(<BuildingBase xPos={x_positions[counter]} zPos={z_positions[counter]} />);
      buildings_level2.push(<BuildingMid xPos={x_positions[counter]} zPos={z_positions[counter]} />);
      buildings_level3.push(<BuildingTop xPos={x_positions[counter]} zPos={z_positions[counter]} />);

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

  useEffect(() => {

    let lastTime = Date.now();

    let timer;
    let direction = 1;
  
    const animate = _ => {
      if (position > 3) {
        direction = -1;
      } else if (position < 1) {
        direction = 1;
      }
  
      const velocity = 0.05 * direction;
      setPosition(position + velocity);
      const rpm = 10;
      const now = Date.now()
      const deltaTimeInMillis = now - lastTime;
      lastTime = now;
      const rotationRads = ((rpm / 60) * Math.PI * 2 * (deltaTimeInMillis / 1000));
      rotation.y += rotationRads;
      setPosition(position);
      setRotation(rotation.clone());
      timer = requestAnimationFrame(animate);
    };

    timer = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(timer);
  }, [rotation, position]);

  return (
    <div className={classNames(
      "PlayerBoard",
      !!ctx.gameover ? (ctx.gameover['winner'] === playerID ? "PlayerBoard--winner" : "PlayerBoard--loser") :
      isActive ? "PlayerBoard--active" : "PlayerBoard--waiting"
      )}>

    <HelpText />

    <Engine canvasId="canvas" antialias={true}>
      <Scene clearColor={new Color4(0, 0, 0, 0)} onMeshPicked={meshPicked}>
        <arcRotateCamera name="camera" 
          alpha={Math.PI/4} beta={Math.PI/4} radius={50}
          upperBetaLimit={Math.PI/3} lowerRadiusLimit={50} upperRadiusLimit={50}
          target={new Vector3(x_positions[12], 0, z_positions[12])} />
        <hemisphericLight name="light" intensity={0.7} direction={Vector3.Up()} />

        {ground}

        {State.players['0'].char.workers.map( worker => 
          <sphere name={"workersprite_" + worker.pos} diameter={2} segments={16}
            position={new Vector3(x_positions[worker.pos], 
              worker.height === 0 ? 1 : worker.height === 1 ? 4 : worker.height === 2 ? 6 : 8, 
              z_positions[worker.pos])}>
            <standardMaterial name="mat" diffuseColor={Color3.Red()} />
          </sphere>
        )}

        {State.players['1'].char.workers.map( worker => 
          <sphere name={"workersprite_" + worker.pos} diameter={2} segments={16}
            position={new Vector3(x_positions[worker.pos], 
              worker.height === 0 ? 1 : worker.height === 1 ? 4 : worker.height === 2 ? 6 : 8, 
              z_positions[worker.pos])}>
            <standardMaterial name="mat" diffuseColor={Color3.Gray()} />
          </sphere> 
        )}

        {State.spaces.map( space =>
          <>
            {space.height >= 1 && buildings_level1[space.pos]}
            {space.height >= 2 && buildings_level2[space.pos]}
            {space.height >= 3 && buildings_level3[space.pos]}
            {space.is_domed && 
              <Dome xPos={x_positions[space.pos]} 
                yPos={space.height === 0 ? 0 : space.height === 1 ? 3 : space.height === 2 ? 5 : 7} 
                zPos={z_positions[space.pos]} 
              />
            }
          </>
        )}

        {isActive && State.valids.map( pos =>
          <Indicator xPos={x_positions[pos]} 
          yPos={position + (State.spaces[pos].height === 0 ? 0 : State.spaces[pos].height === 1 ? 4 : State.spaces[pos].height === 2 ? 6 : 8) + (State.spaces[pos].inhabited ? 2 : 0)} 
          zPos={z_positions[pos]} />
        )}

      </Scene>
    </Engine>

    </div>
  );
}
