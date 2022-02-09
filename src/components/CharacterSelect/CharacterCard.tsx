import { banList } from '../../game/characters';
import { useBoardContext } from '../../context/boardContext';
import CheckImg from '../../assets/png/check.png';
import './CharacterCard.scss';

export const CharacterCard = ({ playerID, name } : {
  playerID: string | null,
  name: string,
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
      className={
        `${name}
        character-card
        ${isUnselectable() ? 'character-card--grayscale' : 'character-card--selectable'}`
      }
      onClick={select}
      onKeyDown={(e) => e.key === 'Enter' && select()}
      role="button"
      tabIndex={0}
    >
      <span>{name}</span>
    </div>
  );
};

export const SelectedCharacterCard = ({ name, playerID } : {
  name: string;
  playerID: string;
}) : JSX.Element => {
  const { G } = useBoardContext();

  return (
    <div className={`${name} character-card`}>
      {G.players[playerID].ready
        && (
        <img
          className="character-card--ready"
          alt="ready"
          src={CheckImg}
        />
        )}
      <span>{name}</span>
    </div>
  );
};
