import React, { useState } from "react";
import { useBoardContext } from "./BoardContext";
import { useStoreState } from "../../store";
import "./style.scss";

export const PlayerInfo = () => {
  const { playerID, State } = useBoardContext();

  const roomMetadata = useStoreState((s) => s.roomMetadata);

  const [showP1Desc, setShowP1Desc] = useState(false);
  const [showP2Desc, setShowP2Desc] = useState(false);


  function toggleP1Desc() {
    setShowP1Desc(!showP1Desc);
  }

  function toggleP2Desc() {
    setShowP2Desc(!showP2Desc);
  }

  return (
    <>
    <div className="PlayerInfo">
      <div className="PlayerInfo__P1QuestionMark" onClick={toggleP1Desc}>
        <span>&nbsp;?&nbsp;</span>
      </div>
      <div className="PlayerInfo__P1Name" onClick={toggleP1Desc}>
        <h2>{roomMetadata?.players[0].name + (playerID === '0' ? ' (you)' : '')}</h2>
        <span>{State.players[0].char.name}</span>
      </div>
      <div className="PlayerInfo__P2QuestionMark" onClick={toggleP2Desc}>
        <span>&nbsp;?&nbsp;</span>
      </div>
      <div className="PlayerInfo__P2Name" onClick={toggleP2Desc}>
        <h2>{roomMetadata?.players[1].name + (playerID === '1' ? ' (you)' : '')}</h2>
        <span>{State.players[1].char.name}</span>
      </div>
    </div>
    
    <div className="PlayerDescriptions">
      <div className="PlayerDescriptions__1" style={{display: showP1Desc ? 'block' : 'none' }}>
        <span>
          {showP1Desc ? State.players[0].char.desc : ''}
        </span>
      </div>
      <div className="PlayerDescriptions__2" style={{display: showP2Desc ? 'block' : 'none' }}>
        <span>
          {showP2Desc ? State.players[1].char.desc : ''}
        </span>
      </div>
    </div>
    </>

  );
};
