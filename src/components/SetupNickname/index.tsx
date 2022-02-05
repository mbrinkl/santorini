import React, { useState } from 'react';
import Tippy from '@tippyjs/react';
import { useStoreState, useStoreActions } from '../../store';
import { updatePlayer } from '../../api';
import { ButtonBack } from '../ButtonBack';
import { Button } from '../Button';
import { LobbyPage } from '../LobbyPage';
import { Input } from '../Input';
import 'tippy.js/dist/tippy.css';
import './style.scss';

export const SetupNickname = ({ onSubmit } : { onSubmit?: () => void }) : JSX.Element => {
  const initialNickname = useStoreState((s) => s.nickname);
  const persistNickname = useStoreActions((s) => s.setNickname);
  const [nickname, setNickname] = useState(initialNickname || '');
  const [tooltipVisible, setTooltipVisible] = useState(false);
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
    if (nickname.length > 0) {
      persistNickname(nickname);
      onSubmit?.();

      // update player name if they are in a game
      asyncUpdatePlayer();
    } else {
      setTooltipVisible(true);
      setTimeout(() => setTooltipVisible(false), 1500);
    }
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
          autoFocus
        />

        <Tippy
          visible={tooltipVisible}
          offset={[0, 12]}
          content={<p>Nickname cannot be empty.</p>}
        >
          <div className="Lobby__link-buttons">
            <Button
              theme="blue"
              type="submit"
            >
              Save
            </Button>
          </div>
        </Tippy>

      </form>
    </LobbyPage>
  );
};
