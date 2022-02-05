import { ConnectedIndicator } from '../GameBoard/ConnectedIndicator';
import { Button } from '../Button';
import { banList, getSortedCharacters } from '../../game/characters';
import { useBoardContext } from '../GameBoard/BoardContext';
import { Chat } from '../Chat';
import CheckImg from '../../assets/png/check.png';
import './style.scss';

export const CharacterBox = ({ playerID, name } : {
  playerID: string | null,
  name: string
}) : JSX.Element => {
  const { G, moves } = useBoardContext();
  const takenCharacters: string[] = [];

  Object.values(G.players).forEach((player) => {
    takenCharacters.push(player.charState.name);
  });

  function isBanned(): boolean {
    if (!playerID) {
      return false;
    }

    const { opponentID } = G.players[playerID];
    const opponentCharName = G.players[opponentID].charState.name;
    if (banList.filter((ban) => ban.includes(name) && ban.includes(opponentCharName)).length > 0) {
      return true;
    }

    return false;
  }

  function isUnselectable(): boolean {
    if (['Random', 'Mortal'].includes(name)) {
      return false;
    }

    return takenCharacters.includes(name) || isBanned();
  }

  function select(): void {
    if (!isUnselectable()) {
      moves.setChar(name);
    }
  }

  return (
    <div
      className={`${name} characterBoxSelectable ${isUnselectable() && 'grayscale'}`}
      onClick={select}
      onKeyDown={(e) => e.key === 'Enter' && select()}
      role="button"
      tabIndex={0}
    >
      <span>{name}</span>
    </div>
  );
};

export const SelectedCharacterBox = ({ name, playerID } : {
  name: string;
  playerID: string;
}) : JSX.Element => {
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

export const CharacterSelect = () : JSX.Element => {
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
                    {`${matchData?.[player.ID].name}${player.ID === playerID ? ' (You)' : ''}`}
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
            <CharacterBox key={character} playerID={playerID} name={character} />
          ))}
        </div>
      </div>
    </div>
  );
};
