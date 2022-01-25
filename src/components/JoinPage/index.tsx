import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { isMobile } from '../../utility';
import { ButtonBack } from '../ButtonBack';
import { GithubLink } from '../LobbyPage';
import { useStoreActions, useStoreState } from '../../store';
import style from './style.module.scss';

export function JoinPage() {
  const listMatches = useStoreActions((s) => s.listMatches);
  const availableMatches = useStoreState((s) => s.availableMatches);
  const navigate = useNavigate();

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
    navigate(`/rooms/${matchID}`);
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
        {!isMobile() && <td>{new Date(m.createdAt).toLocaleString()}</td>}
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
            {!isMobile() && <th>Created At</th>}
          </tr>
        </thead>
        <tbody>
          {games}
        </tbody>
      </table>
    </div>
  );
}
