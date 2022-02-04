import React, { useState } from 'react';
import { useStoreState, useStoreActions } from '../../store';
import { updatePlayer } from '../../api';
import { ButtonBack } from '../ButtonBack';
import { Button } from '../Button';
import { LobbyPage } from '../LobbyPage';
import { Input } from '../Input';
import './style.scss';

export const SetupNickname = ({ onSubmit } : { onSubmit?: () => void }) : JSX.Element => {
  const initialNickname = useStoreState((s) => s.nickname);
  const persistNickname = useStoreActions((s) => s.setNickname);
  const [nickname, setNickname] = useState(initialNickname || '');
  const activeRoomPlayer = useStoreState((s) => s.activeRoomPlayer);

  async function asyncUpdatePlayer() {
    if (activeRoomPlayer) {
      await updatePlayer(
        activeRoomPlayer.matchID,
        activeRoomPlayer.playerID.toString(),
        activeRoomPlayer.credential,
        nickname,
      );
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    persistNickname(nickname);
    onSubmit?.();

    // update player name if they are in a game
    asyncUpdatePlayer();
  };

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
