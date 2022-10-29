import { LobbyAPI } from 'boardgame.io';
import { useEffect, useMemo, useState } from 'react';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { LobbyPage } from './Wrapper';
import { ButtonBack } from '../common/ButtonBack';
import { MatchTable } from '../common/MatchTable';
import { ReviewTableRow, SpectateTableRow } from '../../types/tables';
import { useGetMatchesQuery } from '../../api';

export const WatchPage = (): JSX.Element => {
  const spectateColumnHelper = createColumnHelper<SpectateTableRow>();
  const reviewColumnHelper = createColumnHelper<ReviewTableRow>();
  const [spectatableMatches, setSpectatableMatches] = useState<
    LobbyAPI.Match[]
  >([]);
  const [reviewableMatches, setReviewableMatches] = useState<LobbyAPI.Match[]>(
    [],
  );

  const { data: matches } = useGetMatchesQuery(undefined, {
    pollingInterval: 10000,
  });

  useEffect(() => {
    if (matches) {
      setSpectatableMatches(
        matches.filter(
          (match) =>
            match.players[0].isConnected &&
            match.players[1].isConnected &&
            !match.gameover,
        ),
      );

      setReviewableMatches(
        matches
          .filter((match) => match.gameover)
          .sort((a, b) => b.createdAt - a.createdAt),
      );
    }
  }, [matches]);

  const spectateColumns = useMemo(
    () => [
      spectateColumnHelper.accessor((c) => c.player0, {
        cell: (info) => info.getValue(),
        header: 'Player 1',
      }),
      spectateColumnHelper.accessor((c) => c.player1, {
        cell: (info) => info.getValue(),
        header: 'Player 2',
      }),
    ],
    [spectateColumnHelper],
  );

  const spectateData = useMemo(
    () =>
      spectatableMatches.map(
        (match): SpectateTableRow => ({
          matchID: match.matchID,
          player0: match.players[0].name || 'Player 1',
          player1: match.players[1].name || 'Player 2',
        }),
      ),
    [spectatableMatches],
  );

  const reviewColumns = useMemo(
    () => [
      reviewColumnHelper.group({
        header: 'Winner',
        columns: [
          reviewColumnHelper.accessor((c) => c.winnerName, {
            cell: (info) => info.getValue(),
            header: 'Name',
            id: 'Name-Winner',
          }),
          reviewColumnHelper.accessor((c) => c.winnerCharacter, {
            cell: (info) => info.getValue(),
            header: 'Played',
            id: 'Played-Winner',
          }),
        ],
      }),
      reviewColumnHelper.group({
        header: 'Loser',
        columns: [
          reviewColumnHelper.accessor((c) => c.loserName, {
            cell: (info) => info.getValue(),
            header: 'Name',
            id: 'Name-Loser',
          }),
          reviewColumnHelper.accessor((c) => c.loserCharacter, {
            cell: (info) => info.getValue(),
            header: 'Played',
            id: 'Played-Loser',
          }),
        ],
      }),
    ],
    [reviewColumnHelper],
  );

  const reviewData = useMemo(
    () =>
      reviewableMatches.map((match): ReviewTableRow => {
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

  return (
    <LobbyPage className="lobby-top">
      <ButtonBack to="/" />
      <MatchTable
        caption="Spectate"
        columns={spectateColumns as ColumnDef<SpectateTableRow, unknown>[]}
        data={spectateData}
        noDataMessage="No Live Games to Spectate"
      />
      <MatchTable
        caption="Review"
        subCaption="( Completed public games will show up here. )"
        columns={reviewColumns}
        data={reviewData}
        noDataMessage="No Games to Review"
      />
    </LobbyPage>
  );
};
