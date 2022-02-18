import classNames from 'classnames';
import { LobbyAPI } from 'boardgame.io';
import { MouseEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LobbyPage } from './Wrapper';
import { ButtonBack } from '../ButtonBack';
import { getMatches } from '../../api';
import './Join.scss';

export const WatchPage = () : JSX.Element => {
  const [spectatableMatches, setSpectatableMatches] = useState<LobbyAPI.Match[]>([]);
  const [reviewableMatches, setReviewableMatches] = useState<LobbyAPI.Match[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    function pollMatches() {
      getMatches().then((matches) => {
        setSpectatableMatches(matches.filter((match) => (
          (match.players[0].isConnected && match.players[1].isConnected)
          && !match.gameover
        )));

        setReviewableMatches(matches.filter((match) => (
          match.gameover
        )));
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
      navigate(`/rooms/${matchID}`);
    }
  }

  const spectateTableBody = spectatableMatches.length === 0
    ? (
      <tr className="match-table__row">
        <td colSpan={3}>No Live Games to Spectate</td>
      </tr>
    ) : spectatableMatches.map((m) => (
      <tr
        key={m.matchID}
        className={classNames('match-table__row', 'match-table__row--match')}
        onClick={onTableRowClicked}
      >
        <td>{m.matchID}</td>
        <td>{m.players[0].name}</td>
        <td>{m.players[1].name}</td>
      </tr>
    ));

  const reviewableTableBody = reviewableMatches.length === 0
    ? (
      <tr className="match-table__row">
        <td colSpan={3}>No Games to Review</td>
      </tr>
    ) : reviewableMatches.map((m) => (
      <tr
        key={m.matchID}
        className={classNames('match-table__row', 'match-table__row--match')}
        onClick={onTableRowClicked}
      >
        <td>{m.matchID}</td>
        <td>{m.players[m.gameover.winner].name}</td>
        <td>{m.players[(Number(m.gameover.winner) + 1) % 2].name}</td>
      </tr>
    ));

  return (
    <LobbyPage className="lobby-top">
      <ButtonBack to="/" />
      <table className="match-table">
        <caption className="match-table__caption">Spectate</caption>
        <thead>
          <tr className="match-table__row">
            <th>Match ID</th>
            <th>Player 1</th>
            <th>Player 2</th>
          </tr>
        </thead>
        <tbody>
          {spectateTableBody}
        </tbody>
      </table>

      <table className="match-table">
        <caption className="match-table__caption">Review</caption>
        <thead>
          <tr className="match-table__row">
            <th>Match ID</th>
            <th>Winner</th>
            <th>Loser</th>
          </tr>
        </thead>
        <tbody>
          {reviewableTableBody}
        </tbody>
      </table>
    </LobbyPage>
  );
};
