import React, { useState } from "react";
import { useBoardContext } from "./BoardContext";
import { useStoreState } from "../../store";
import "./style.scss";
import { ConnectedIndicator } from "./ConnectedIndicator";

export const PlayerInfoMobile = () => {
  const { playerID, State } = useBoardContext();
  const roomMetadata = useStoreState((s) => s.roomMetadata);
  const [showOverlay, setShowOverlay] = useState(false);

  function toggleOverlay() {
    setShowOverlay(!showOverlay);
  }

  if (showOverlay) return (
    <div className="MobileOverlay" onClick={toggleOverlay} role="none">
      <div className="MobileOverlay__p1">
        <span>
          <h3>{roomMetadata?.players[0].name + (playerID === '0' ? ' (you) - ' : ' - ') + State.players[0].char.name}</h3>
          {State.players[0].char.desc}
        </span>
      </div>
      <div className="MobileOverlay__mid">
        <span>(tap anywhere to close)</span>
      </div>
      <div className="MobileOverlay__p2">
        <span>
          <h3>{roomMetadata?.players[1].name + (playerID === '1' ? ' (you) - ' : ' - ') + State.players[1].char.name}</h3>
          {State.players[1].char.desc}
        </span>
      </div>
    </div>
  );

  return (
    <div className="PlayerInfoMobile">
      <div className="PlayerInfoMobile__P1QuestionMark" onClick={toggleOverlay} role="button" tabIndex={0}>
        <span>&nbsp;?&nbsp;</span>
      </div>
      <div className="PlayerInfoMobile__P1Name" onClick={toggleOverlay} role="button" tabIndex={0}>
        <h2>{roomMetadata?.players[0].name + (playerID === '0' ? ' (you)' : '')}</h2>
        <span>{State.players[0].char.name}</span>
        <ConnectedIndicator playerID={0} />
      </div>
      <div className="PlayerInfoMobile__P2QuestionMark" onClick={toggleOverlay} role="button" tabIndex={0}>
        <span>&nbsp;?&nbsp;</span>
      </div>
      <div className="PlayerInfoMobile__P2Name" onClick={toggleOverlay} role="button" tabIndex={0}>
        <h2>{roomMetadata?.players[1].name + (playerID === '1' ? ' (you)' : '')}</h2>
        <span>{State.players[1].char.name}</span>
        <ConnectedIndicator playerID={1} />
      </div>
    </div>
  );
};
