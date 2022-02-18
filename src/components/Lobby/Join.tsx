import { useNavigate } from 'react-router-dom';
import { MouseEvent, useEffect, useState } from 'react';
import classNames from 'classnames';
import { LobbyAPI } from 'boardgame.io';
import { LobbyPage } from './Wrapper';
import { ButtonBack } from '../ButtonBack';
import { getMatches } from '../../api';
import './Join.scss';

export const JoinPage = () : JSX.Element => {
  const [matches, setMatches] = useState<LobbyAPI.Match[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    function pollMatches() {
      getMatches().then((m) => {
        setMatches(m);
      });
    }

    pollMatches();
    const intervalID = setInterval(() => {
      pollMatches();
    }, 5000);

    return () => clearInterval(intervalID);
  }, []);

  function onTableRowClicked(e: MouseEvent<HTMLTableRowElement>) : void {
    const row = (e.target as HTMLTableRowElement).closest('tr');
    const matchID = row?.innerText.substring(0, 11);
    if (matchID) {
      navigate(`/${matchID}`);
    }
  }

  const filteredMatches = matches.filter((m) => (
    !m.gameover
    && !m.players[1].name
    && m.createdAt === m.updatedAt
  ));

  const matchTableBody = filteredMatches.length === 0
    ? (
      <tr className="match-table__row">
        <td colSpan={3}>No Public Games Available</td>
      </tr>
    ) : filteredMatches.map((m) => (
      <tr
        key={m.matchID}
        className={classNames('match-table__row', 'match-table__row--match')}
        onClick={onTableRowClicked}
      >
        <td>{m.matchID}</td>
        <td>{m.players[0].name}</td>
        <td>{new Date(m.createdAt).toLocaleString()}</td>
      </tr>
    ));

  return (
    <LobbyPage className="lobby-top">
      <ButtonBack to="/" />
      <table className="match-table">
        <thead>
          <tr className="match-table__row">
            <th>Match ID</th>
            <th>Creator</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {matchTableBody}
        </tbody>
      </table>
    </LobbyPage>
  );
};
