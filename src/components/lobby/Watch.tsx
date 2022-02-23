import { LobbyAPI } from 'boardgame.io';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { IdType, Row } from 'react-table';
import { LobbyPage } from './Wrapper';
import { ButtonBack } from '../common/ButtonBack';
import { getMatches } from '../../api';
import { MatchTable } from '../common/MatchTable';

interface ReviewableMatch {
  matchID: string;
  winnerName: string;
  winnerCharacter: string;
  loserName: string;
  loserCharacter: string;
}

export const WatchPage = (): JSX.Element => {
  const [spectatableMatches, setSpectatableMatches] = useState<
    LobbyAPI.Match[]
  >([]);
  const [reviewableMatches, setReviewableMatches] = useState<LobbyAPI.Match[]>(
    [],
  );

  useEffect(() => {
    function pollMatches(setReviewable: boolean) {
      getMatches().then((matches) => {
        setSpectatableMatches(
          matches.filter(
            (match) =>
              match.players[0].isConnected &&
              match.players[1].isConnected &&
              !match.gameover,
          ),
        );

        if (setReviewable) {
          setReviewableMatches(
            matches
              .filter((match) => match.gameover)
              .sort((a, b) => b.createdAt - a.createdAt),
          );
        }
      });
    }

    pollMatches(true);
    const intervalID = setInterval(() => {
      pollMatches(false);
    }, 10000);

    return () => clearInterval(intervalID);
  }, []);

  const spectateColumns = useMemo(
    () => [
      {
        Header: 'Player 1',
        accessor: 'player0' as const,
      },
      {
        Header: 'Player 2',
        accessor: 'player1' as const,
      },
    ],
    [],
  );

  const spectateData = useMemo(
    () =>
      spectatableMatches.map((match) => ({
        matchID: match.matchID,
        player0: match.players[0].name || 'Player 1',
        player1: match.players[1].name || 'Player 2',
      })),
    [spectatableMatches],
  );

  const reviewColumns = useMemo(
    () => [
      {
        Header: 'Winner',
        columns: [
          {
            Header: 'Name',
            accessor: 'winnerName' as const,
          },
          {
            Header: 'Played',
            accessor: 'winnerCharacter' as const,
          },
        ],
      },
      {
        Header: 'Loser',
        columns: [
          {
            Header: 'Name',
            accessor: 'loserName' as const,
          },
          {
            Header: 'Played',
            accessor: 'loserCharacter' as const,
          },
        ],
      },
    ],
    [],
  );

  const reviewData = useMemo(
    () =>
      reviewableMatches.map((match) => {
        const winner = Number(match.gameover.winner);
        const loser = (winner + 1) % 2;
        return {
          matchID: match.matchID,
          winnerName: match.players[winner].name || 'Player 1',
          winnerCharacter: match.players[winner].data?.character || 'NOT FOUND',
          loserName: match.players[loser].name || 'Player 2',
          loserCharacter: match.players[loser].data?.character || 'NOT FOUND',
        };
      }),
    [reviewableMatches],
  );

  const reviewGlobalFilter = useCallback(
    // This is Typescript if you're using JS remove the types (e.g. :string)
    (
      rows: Row<ReviewableMatch>[],
      ids: IdType<ReviewableMatch>[],
      query: string,
    ) => {
      const charIndex = query.indexOf('!char');
      const playerIndex = query.indexOf('!player');

      const charQuery = query
        .substring(charIndex + 5, playerIndex)
        .toLocaleLowerCase();
      const playerQuery = query.substring(playerIndex + 7).toLocaleLowerCase();

      return rows.filter(
        (row) =>
          (charQuery.length === 0 ||
            row.values.winnerCharacter
              .toLocaleLowerCase()
              .includes(charQuery) ||
            row.values.loserCharacter
              .toLocaleLowerCase()
              .includes(charQuery)) &&
          (playerQuery.length === 0 ||
            row.values.winnerName.toLocaleLowerCase().includes(playerQuery) ||
            row.values.loserName.toLocaleLowerCase().includes(playerQuery)),
      );
    },
    [],
  );

  return (
    <LobbyPage className="lobby-top">
      <ButtonBack to="/" />
      <MatchTable
        caption="Spectate"
        columns={spectateColumns}
        data={spectateData}
        noDataMessage="No Live Games to Spectate"
      />
      <MatchTable
        caption="Review"
        subCaption="( Completed games will show up here. )"
        columns={reviewColumns}
        data={reviewData}
        noDataMessage="No Games to Review"
        globalFilterFunction={reviewGlobalFilter}
      />
    </LobbyPage>
  );
};
