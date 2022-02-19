import { LobbyAPI } from 'boardgame.io';
import { useEffect, useState } from 'react';
import { LobbyPage } from './Wrapper';
import { ButtonBack } from '../ButtonBack';
import { getMatches } from '../../api';
import { MatchTable } from '../MatchTable';

export const WatchPage = () : JSX.Element => {
  const [spectatableMatches, setSpectatableMatches] = useState<LobbyAPI.Match[]>([]);
  const [reviewableMatches, setReviewableMatches] = useState<LobbyAPI.Match[]>([]);

  useEffect(() => {
    function pollMatches() {
      getMatches().then((matches) => {
        setSpectatableMatches(matches.filter((match) => (
          (match.players[0].isConnected && match.players[1].isConnected)
          && !match.gameover
        )));

        setReviewableMatches(matches.filter((match) => (
          match.gameover
        )).sort((a, b) => b.createdAt - a.createdAt));
      });
    }

    pollMatches();
    const intervalID = setInterval(() => {
      pollMatches();
    }, 10000);

    return () => clearInterval(intervalID);
  }, []);

  return (
    <LobbyPage className="lobby-top">
      <ButtonBack to="/" />
      <MatchTable
        caption="Spectate"
        headers={['Player 1', 'Player 2']}
        noBody="No Live Games to Spectate"
        body={spectatableMatches.map((match) => (
          {
            matchID: match.matchID,
            data: [
              match.players[0].name || 'Player 0',
              match.players[1].name || 'Player 1',
            ],
          }
        ))}
      />
      <MatchTable
        caption="Review"
        subCaption="( Completed games will show up here. )"
        headers={['Winner', 'Loser']}
        noBody="No Games to Review"
        body={reviewableMatches.map((match) => (
          {
            matchID: match.matchID,
            data: [
              `${match.players[match.gameover.winner].name} 
              (${match.players[match.gameover.winner].data?.character})`,
              `${match.players[(Number(match.gameover.winner) + 1) % 2].name} 
              (${match.players[(Number(match.gameover.winner) + 1) % 2].data?.character})`,
            ],
          }
        ))}
      />
    </LobbyPage>
  );
};
