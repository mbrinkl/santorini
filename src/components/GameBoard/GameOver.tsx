import { ButtonLink } from "components/Button";
import React from "react";
import { useBoardContext } from "./BoardContext";

export const GameOver = () => {
  const { ctx, playerID, playersInfo } = useBoardContext();

  const winner = ctx.gameover['winner'];

  const placeMessages = {
    0: "You Won!",
    1: "You Lost"
  };

  const place = winner === playerID ? 0 : 1;

  const playerName = playersInfo[playerID].name + " (You)";
  const opponentName = playersInfo[(+playerID + 1) % 2].name;

  return (
    <div className="GameOver">
      <div className="GameOver__modal">
        <h2 className="GameOver__title">
          Game Results
        </h2>

        <h2 className="GameOver__subtitle">{placeMessages[place]}</h2>

        <div className="GameOver__ranking">

              <div className="GameOver__ranking-result" key={1}>
                <span>1.</span>
                <span>
                  {place === 0 ? playerName : opponentName}
                </span>
              </div>

              <div className="GameOver__ranking-result" key={2}>
                <span>2.</span>
                <span>
                  {place === 1 ? playerName : opponentName}
                </span>
              </div>

        </div>

        <ButtonLink to="/" theme="blue">
          Create new game
        </ButtonLink>
      </div>
    </div>
  );
};
