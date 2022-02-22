import React, { useState } from 'react';
import Tippy from '@tippyjs/react';
import { useStoreState, useStoreActions } from '../../store';
import { updatePlayer } from '../../api';
import { ButtonBack } from '../common/ButtonBack';
import { Button } from '../common/Button';
import { LobbyPage } from './Wrapper';
import { Input } from '../common/Input';
import 'tippy.js/dist/tippy.css';
import './SetupNickname.scss';

export const SetupNickname = ({
  onSubmit,
}: {
  onSubmit?: () => void;
}): JSX.Element => {
  const initialNickname = useStoreState((s) => s.nickname);
  const persistNickname = useStoreActions((s) => s.setNickname);
  const [nickname, setNickname] = useState(initialNickname || '');
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const activeRoomPlayer = useStoreState((s) => s.activeRoomPlayer);

  const asyncUpdatePlayer = async () => {
    if (activeRoomPlayer) {
      await updatePlayer(
        activeRoomPlayer.matchID,
        activeRoomPlayer.playerID.toString(),
        activeRoomPlayer.credentials,
        nickname,
      );
    }
  };

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

      <h3 className="setup-nickname__title">Set your nickname</h3>

      <form onSubmit={handleSubmit} className="setup-nickname__form">
        <Input
          placeholder="Enter a nickname..."
          className="setup-nickname__input"
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
          <Button theme="blue" type="submit">
            Save
          </Button>
        </Tippy>
      </form>
    </LobbyPage>
  );
};
