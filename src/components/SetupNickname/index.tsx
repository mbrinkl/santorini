import * as React from "react";
import "./style.scss";
import { useStoreState, useStoreActions } from "../../store";
import { useState } from "react";
import { ButtonBack } from "../ButtonBack";
import { Button } from "components/Button";
import { LobbyPage } from "components/LobbyPage";
import { Input } from "components/Input";

export const SetupNickname: React.FC<{ onSubmit?: () => void }> = ({
  onSubmit,
}) => {
  const initialNickname = useStoreState((s) => s.nickname);
  const persistNickname = useStoreActions((s) => s.setNickname);
  const [nickname, setNickname] = useState(initialNickname || "");
  const roomID = useStoreState((s) => s.roomID);
  const roomMetadata = useStoreState((s) => s.roomMetadata);
  const activeRoomPlayer = useStoreState((s) => s.activeRoomPlayer);
  const loadRoomMetadata = useStoreActions((s) => s.loadRoomMetadata);
  const updatePlayer = useStoreActions((s) => s.updatePlayer)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    persistNickname(nickname);
    onSubmit && onSubmit();

    // update player name if they are in a game
    asyncUpdatePlayer();
  };

  async function asyncUpdatePlayer() {
    if (roomID && roomMetadata && activeRoomPlayer) {
      await updatePlayer({ 
        roomID: roomID, 
        playerID: activeRoomPlayer.playerID,
        credentials: activeRoomPlayer.credential,
        newName: nickname 
      });

      await loadRoomMetadata(roomID);
    }
  }

  return (
    <LobbyPage>
      <ButtonBack to="/" />

      <h3 className="SetupNickname__title">
        Set your nickname
      </h3>

      <form onSubmit={handleSubmit} className="SetupNickname__form">
        <Input
          placeholder="Enter a nickname..."
          className="SetupNickname__input"
          onChange={(e) => setNickname(e.target.value)}
          value={nickname}
          autoFocus={true}
          maxLength={8}
        />

        <Button 
          theme="blue"
          type="submit">
          Save
        </Button>
      </form>
    </LobbyPage>
  );
};
