import React from "react";
import { useBoardContext } from "./BoardContext";
import { useStoreState } from "../../store";
import "./style.scss";

export const PlayerInfo = () => {
  const { playerID, State } = useBoardContext();
  const roomMetadata = useStoreState((s) => s.roomMetadata);

  return (
    <div className="PlayerInfo">
      <div className="PlayerInfo__P1Name">
        <h2>{roomMetadata?.players[0].name + (playerID === '0' ? ' (you)' : '')}</h2>
        <span>{State.players[0].char.name}</span>
      </div>
      <div className="PlayerInfo__P1Description">
        <span>
          {State.players[0].char.desc}
        </span>
      </div>
      <div className="PlayerInfo__P2Name">
        <h2>{roomMetadata?.players[1].name + (playerID === '1' ? ' (you)' : '')}</h2>
        <span>{State.players[1].char.name}</span>
      </div>
      <div className="PlayerInfo__P2Description">
        <span>
          {State.players[1].char.desc}
        </span>
      </div>
    </div>
  );
};
