import { useHistory } from 'react-router-dom';
import { useEffect } from 'react';
import { ButtonBack } from '../ButtonBack';
import { GithubLink } from '../LobbyPage';
import { useStoreActions, useStoreState } from '../../store';
import style from './style.module.scss';

export const JoinPage = () => {
  const listMatches = useStoreActions((s) => s.listMatches);
  const availableMatches = useStoreState((s) => s.availableMatches);
  const history = useHistory();

  useEffect(() => {
    listMatches(null);
    const intervalID = setInterval(() => {
      listMatches(null);
    }, 5000);
    return () => clearInterval(intervalID);
  }, [listMatches]);

  function onTableRowClicked(e) {
    const row = e.target.closest('tr');
    const matchID = row.innerText.substring(0, 11);
    history.push({
      pathname: `/rooms/${matchID}`,
    });
  }

  const matches = availableMatches.filter((m) => !m.gameover && !m.players[1].name);
  const games = matches.length === 0
    ? (
      <tr>
        <td colSpan={3} className={style.noGames}>No Public Games Available</td>
      </tr>
    ) : matches.map((m) => (
      <tr key={m.matchID} onClick={onTableRowClicked}>
        <td>{m.matchID}</td>
        <td>{m.players[0].name}</td>
        <td>{new Date(m.createdAt).toLocaleString()}</td>
      </tr>
    ));

  return (
    <div className={style.joinPage}>
      <GithubLink />
      <ButtonBack to="/" />
      <table>
        <thead>
          <tr>
            <th>Match ID</th>
            <th>Creator</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {games}
        </tbody>
      </table>
    </div>
  );
};
