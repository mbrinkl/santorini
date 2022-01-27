import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { LobbyAPI } from 'boardgame.io';
import { isMobile } from '../../utility';
import { ButtonBack } from '../ButtonBack';
import { GithubLink } from '../LobbyPage';
import style from './style.module.scss';
import { LobbyService } from '../../api/lobbyService';

export function JoinPage() {
  const [matches, setMatches] = useState<LobbyAPI.Match[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    new LobbyService().getMatches().then((m) => {
      setMatches(m);
    });
    const intervalID = setInterval(() => {
      new LobbyService().getMatches().then((m) => {
        setMatches(m);
      });
    }, 5000);
    return () => clearInterval(intervalID);
  }, []);

  function onTableRowClicked(e) {
    const row = e.target.closest('tr');
    const matchID = row.innerText.substring(0, 11);
    navigate(`/rooms/${matchID}`);
  }

  const filteredMatches = matches.filter((m) => !m.gameover && !m.players[1].name);
  const matchTableBody = filteredMatches.length === 0
    ? (
      <tr>
        <td colSpan={3} className={style.noGames}>No Public Games Available</td>
      </tr>
    ) : filteredMatches.map((m) => (
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
          {matchTableBody}
        </tbody>
      </table>
    </div>
  );
}
