import { ColumnDef } from '@tanstack/react-table';

export interface RequiredRowProps {
  matchID: string;
}

export interface SpectateTableRow extends RequiredRowProps {
  player0: string;
  player1: string;
}

export interface ReviewTableRow extends RequiredRowProps {
  winnerName: string;
  winnerCharacter: string;
  loserName: string;
  loserCharacter: string;
}

export interface TableProps<T extends RequiredRowProps> {
  columns: ColumnDef<T>[];
  data: T[];
  noDataMessage: string;
  caption?: string;
  subCaption?: string;
}
