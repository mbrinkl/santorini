import * as React from 'react';
import './style.scss';
import { useState } from 'react';
import { LobbyService } from '../../api/lobbyService';
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
  const activeRoomPlayer = useStoreState((s) => s.activeRoomPlayer);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    persistNickname(nickname);
    onSubmit?.();

    // update player name if they are in a game
    asyncUpdatePlayer();
  };

  async function asyncUpdatePlayer() {
    if (activeRoomPlayer) {
      await new LobbyService().updatePlayer({
        matchID: activeRoomPlayer.matchID,
        playerID: activeRoomPlayer.playerID,
        credentials: activeRoomPlayer.credential,
        newName: nickname,
      });
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
