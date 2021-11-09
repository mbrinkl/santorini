import * as React from 'react';
import './style.scss';
import { useState } from 'react';
import { useStoreState, useStoreActions } from '../../store';
import { ButtonBack } from '../ButtonBack';
import { Button } from '../Button';
import { LobbyPage } from '../LobbyPage';
import { Input } from '../Input';

export const SetupNickname: React.FC<{ onSubmit?: () => void }> = ({
  onSubmit,
}) => {
  const initialNickname = useStoreState((s) => s.nickname);
  const persistNickname = useStoreActions((s) => s.setNickname);
  const [nickname, setNickname] = useState(initialNickname || '');
  const matchID = useStoreState((s) => s.matchID);
  const roomMetadata = useStoreState((s) => s.roomMetadata);
  const activeRoomPlayer = useStoreState((s) => s.activeRoomPlayer);
  const loadRoomMetadata = useStoreActions((s) => s.loadRoomMetadata);
  const updatePlayer = useStoreActions((s) => s.updatePlayer);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    persistNickname(nickname);
    if (onSubmit) {
      onSubmit();
    }

    // update player name if they are in a game
    asyncUpdatePlayer();
  };

  async function asyncUpdatePlayer() {
    if (matchID && roomMetadata && activeRoomPlayer) {
      await updatePlayer({
        matchID,
        playerID: activeRoomPlayer.playerID,
        credentials: activeRoomPlayer.credential,
        newName: nickname,
      });

      await loadRoomMetadata(matchID);
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
          maxLength={8}
        />

        <Button
          theme="blue"
          type="submit"
        >
          Save
        </Button>
      </form>
    </LobbyPage>
  );
};
