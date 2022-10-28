import { useEffect, useMemo, useState } from 'react';
import { LobbyAPI } from 'boardgame.io';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { LobbyPage } from './Wrapper';
import { ButtonBack } from '../common/ButtonBack';
import { getMatches } from '../../api';
import { MatchTable } from '../common/MatchTable';
import { JoinTableRow } from '../../types/tables';

export const JoinPage = (): JSX.Element => {
  const columnHelper = createColumnHelper<JoinTableRow>();
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

  const columns = useMemo(
    () => [
      columnHelper.accessor((c) => c.creator, {
        header: 'Creator',
      }),
      columnHelper.accessor((c) => c.createdAt, {
        header: 'Created At',
      }),
    ],
    [columnHelper],
  );

  const data = useMemo(
    () =>
      joinableMatches.map(
        (match): JoinTableRow => ({
          matchID: match.matchID,
          creator: match.players[0].name || 'Player 0',
          createdAt: new Date(match.createdAt).toLocaleString(),
        }),
      ),
    [joinableMatches],
  );

  return (
    <LobbyPage className="lobby-top">
      <ButtonBack to="/" />
      <MatchTable
        columns={columns as ColumnDef<JoinTableRow, unknown>[]}
        data={data}
        noDataMessage="No Public Games Available"
      />
    </LobbyPage>
  );
};
