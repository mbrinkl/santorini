import { useEffect, useState } from 'react';
import { LobbyAPI } from 'boardgame.io';
import { LobbyPage } from './Wrapper';
import { ButtonBack } from '../common/ButtonBack';
import { getMatches } from '../../api';
import { MatchTable } from '../common/MatchTable';

export const JoinPage = (): JSX.Element => {
  const [joinableMatches, setJoinableMatches] = useState<LobbyAPI.Match[]>([]);

  useEffect(() => {
    function pollMatches() {
      getMatches().then((matches) => {
        setJoinableMatches(
          matches.filter(
            (match) =>
              !match.gameover &&
              !match.players[1].name &&
              match.createdAt === match.updatedAt,
          ),
        );
      });
    }

    pollMatches();
    const intervalID = setInterval(() => {
      pollMatches();
    }, 5000);

    return () => clearInterval(intervalID);
  }, []);

  return (
    <LobbyPage className="lobby-top">
      <ButtonBack to="/" />
      <MatchTable
        headers={['Creator', 'Created At']}
        noBody="No Public Games Available"
        body={joinableMatches.map((match) => ({
          matchID: match.matchID,
          data: [
            match.players[0].name || 'Player 0',
            new Date(match.createdAt).toLocaleString(),
          ],
        }))}
      />
    </LobbyPage>
  );
};
