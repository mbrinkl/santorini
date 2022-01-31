import React from 'react';
import { ConnectedIndicator } from '../GameBoard/ConnectedIndicator';
import { Button } from '../Button';
import { getSortedCharacters } from '../../game/characters';
import { useBoardContext } from '../GameBoard/BoardContext';
import { Chat } from '../Chat';
import CheckImg from '../../assets/png/check.png';
import './style.scss';

export const CharacterBox: React.FC<{ name: string }> = ({ name }) => {
  const { G, moves } = useBoardContext();
  const takenCharacters: string[] = [];

  Object.values(G.players).forEach((player) => {
    takenCharacters.push(player.charState.name);
  });

  // Return true if opponent has taken this character
  // false if Random, Mortal, or not taken
  function isCharacterTaken(): boolean {
    return takenCharacters.includes(name) && !['Random', 'Mortal'].includes(name);
  }

  function select(): void {
    if (!isCharacterTaken()) {
      moves.setChar(name);
    }
  }

  return (
    <div
      className={`${name} characterBoxSelectable ${isCharacterTaken() && 'grayscale'}`}
      onClick={select}
      onKeyDown={(e) => e.key === 'Enter' && select()}
      role="button"
      tabIndex={0}
    >
      <span>{name}</span>
    </div>
  );
};

export const SelectedCharacterBox: React.FC<{
  name: string;
  playerID: string;
}> = ({ name, playerID }) => {
  const { G } = useBoardContext();

  return (
    <div className={`${name} characterBox`}>
      {G.players[playerID].ready
        && (
        <img
          className="characterBoxCheck"
          alt="ready"
          src={CheckImg}
        />
        )}
      <span>{name}</span>
    </div>
  );
};

export const CharacterSelect = () => {
  const {
    G, moves, matchData, playerID,
  } = useBoardContext();

  let readyButton: JSX.Element | null = null;

  // If not a spectator
  if (playerID) {
    if (G.players[playerID].ready) {
      readyButton = (
        <Button
          theme="red"
          onClick={() => {
            moves.cancelReady();
          }}
        >
          Cancel
        </Button>
      );
    } else {
      readyButton = (
        <Button
          theme="green"
          onClick={() => {
            moves.ready();
          }}
        >
          Ready
        </Button>
      );
    }
  }

  return (
    <div>
      <div className="charSelect">

        <div className="charSelect__chat">
          <div className="chatContainer">
            <Chat />
          </div>
        </div>

        <div className="charSelect__selectedCharDiv">
          <h1>Select a Character</h1>

          {Object.values(G.players).map((player) => (
            <div key={`selectedChar${player.ID}`} className="charSelect__selectedChar">
              <div className="charSelect__characterCard">
                <div className="charSelect__playerNameDiv">
                  <ConnectedIndicator playerID={+player.ID} />
                  <span className="charSelect__playerName">
                    {matchData?.[player.ID].name}
                  </span>
                </div>
                <SelectedCharacterBox
                  name={player.charState.name}
                  playerID={player.ID}
                />
              </div>
              <div className="charSelect__characterDescription">
                {player.charState.name === 'Random'
                  ? 'Random'
                  : G.players[player.ID].charState.desc}
              </div>
            </div>
          ))}

          {readyButton}

        </div>

        <div className="charSelect__characters">
          {getSortedCharacters().map((character) => (
            <CharacterBox key={character} name={character} />
          ))}
        </div>
      </div>
    </div>
  );
};
