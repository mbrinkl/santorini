import React from 'react';
import { ConnectedIndicator } from '../GameBoard/ConnectedIndicator';
import { Button } from '../Button';
import { getSortedCharacters } from '../../game/characters';
import { useBoardContext } from '../GameBoard/BoardContext';
import { Chat } from '../Chat';
import CheckImg from '../../assets/png/check.png';
import './style.scss';

export const CharacterBox: React.FC<{ name: string }> = ({ name }) => {
  const { G, moves, playerID } = useBoardContext();
  const takenCharacters: string[] = [];

  Object.values(G.players).forEach((player) => {
    takenCharacters.push(player.char.name);
  });

  // Return true if opponent has taken this character
  // false if Random, Mortal, or not taken
  function isCharacterTaken(): boolean {
    return takenCharacters.includes(name) && !['Random', 'Mortal'].includes(name);
  }

  function select(): void {
    if (!isCharacterTaken()) {
      moves.setChar(playerID, name);
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
            moves.cancelReady(playerID);
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
            moves.ready(playerID);
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
            <div key={`selectedChar${player.id}`} className="charSelect__selectedChar">
              <div className="charSelect__characterCard">
                <div className="charSelect__playerNameDiv">
                  <ConnectedIndicator playerID={+player.id} />
                  <span className="charSelect__playerName">
                    {matchData?.[player.id].name}
                  </span>
                </div>
                <SelectedCharacterBox
                  name={player.char.name}
                  playerID={player.id}
                />
              </div>
              <div className="charSelect__characterDescription">
                {player.char.name === 'Random'
                  ? 'Random'
                  : G.players[player.id].char.desc}
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
