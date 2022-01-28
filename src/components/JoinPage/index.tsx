import { useNavigate } from 'react-router-dom';
import { MouseEvent, useEffect, useState } from 'react';
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
    const lobbyService = new LobbyService();
    function pollMatches() {
      lobbyService.getMatches().then((m) => {
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
      navigate(`/rooms/${matchID}`);
    }
  }

  const filteredMatches = matches.filter((m) => !m.gameover
    && !m.players[1].name
    && m.createdAt === m.updatedAt);
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
