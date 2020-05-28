import React from "react";
import { LobbyPage } from "components/LobbyPage";
import { Logo } from "components/Logo";
import { Button, ButtonProps } from "components/Button";
import style from "./style.module.scss";
import { ButtonChangeNickname } from "../ButtonChangeNickname";
import { useStoreActions, useStoreState } from "../../store";
import { Redirect } from "react-router-dom";

interface Props {
  playerCount: number;
  onClick(playerCount: number): void;
}

const CreateGameButton: React.FC<ButtonProps & Props> = ({
  playerCount,
  onClick,
  ...props
}) => {
  return (
    <Button
      className={style.buttons}
      onClick={() => onClick(playerCount)}
      {...props}
    >
      Play!
    </Button>
  );
};

export const Welcome = () => {

  const createGameRoom = useStoreActions((s) => s.createGameRoom);
  // const nickname = useStoreState((s) => s.nickname);
  const roomID = useStoreState((s) => s.roomID);

  if (roomID) return <Redirect to={`/rooms/${roomID}`} />;

  function onHowToPlay()
  {
    window.open("http://files.roxley.com/Santorini-Rulebook-Web-2016.08.14.pdf", "_blank");
  }

  return (
    <LobbyPage>
      <ButtonChangeNickname />

      <Logo className={style.logo} size="large" />
      <p className={style.text}>
          Online multiplayer boardgame to play with a friend! Build towers and be 
          the first to move up to a level 3 building to win.
      </p>

      <div className={style.buttonsDiv}>
        <Button theme="yellow" 
          className={style.buttons}
          onClick={onHowToPlay}
          >
            Rules
        </Button>

        <CreateGameButton theme="green" 
          playerCount={2}
          onClick={createGameRoom}
        >
          Play!
        </CreateGameButton>
      </div>

    </LobbyPage>
  );
};
