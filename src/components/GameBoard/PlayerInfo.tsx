import React from "react";
import { useBoardContext } from "./BoardContext";
import { useStoreState } from "../../store";
import "./style.scss";
import { ConnectedIndicator } from "./ConnectedIndicator";

export const PlayerInfo = () => {
  const { playerID, State} = useBoardContext();
  const roomMetadata = useStoreState((s) => s.roomMetadata);
  
  return (
    <div className="PlayerInfo">
      <div className="PlayerInfo__P1Name">
        <h2>{roomMetadata?.players[0].name + (playerID === '0' ? ' (you)' : '')}</h2>
        <h4>{State.players[0].char.name}</h4>
        <p>{State.players[0].char.desc}</p>
        <ConnectedIndicator playerID={0} />
      </div>
      <div className="PlayerInfo__P2Name">
        <ConnectedIndicator playerID={1} />
        <p>{State.players[1].char.desc}</p>
        <h4>{State.players[1].char.name}</h4>
        <h2>{roomMetadata?.players[1].name + (playerID === '1' ? ' (you)' : '')}</h2>
      </div>
    </div>
  );
};
