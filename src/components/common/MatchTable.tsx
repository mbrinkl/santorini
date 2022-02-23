import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Column,
  IdType,
  Row,
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
  useAsyncDebounce,
} from 'react-table';
import { getSortedCharacters } from '../../game/characters';
import './MatchTable.scss';

interface RequiredProps {
  matchID: string;
}

interface Props<T extends RequiredProps> {
  columns: Column<T>[];
  data: T[];
  noDataMessage: string;
  caption?: string;
  subCaption?: string;
  globalFilterFunction?: (
    rows: Row<T>[],
    ids: IdType<T>[],
    query: string,
  ) => Row<T>[];
}

const GlobalFilter = ({ setGlobalFilter }) => {
  // const count = preGlobalFilteredRows.length;
  const [character, setCharacter] = useState('');
  const [player, setPlayer] = useState('');

  const debouncedFilterUpdate = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined);
  }, 200);

  useEffect(() => {
    const value = `!char${character}!player${player}`;
    debouncedFilterUpdate(value);
  }, [character, player, debouncedFilterUpdate]);

  return (
    <span className="match-table__filters">
      {'Character: '}
      <select onChange={(e) => setCharacter(e.target.value)}>
        <option />
        {getSortedCharacters()
          .slice(1)
          .map((charName) => (
            <option key={charName}>{charName}</option>
          ))}
      </select>
      {'    Player Name: '}
      <input
        value={player}
        onChange={(e) => {
          setPlayer(e.target.value);
        }}
        style={{
          fontSize: '1.1rem',
          border: '0',
        }}
      />
    </span>
  );
};

export const MatchTable = <T extends RequiredProps>({
  columns,
  data,
  noDataMessage,
  caption,
  subCaption,
  globalFilterFunction,
}: Props<T>): JSX.Element => {
  const navigate = useNavigate();

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    visibleColumns,
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    setGlobalFilter,
    state: { pageIndex, pageSize },
  } = useTable<T>(
    { columns, data, globalFilter: globalFilterFunction },
    useGlobalFilter,
    useSortBy,
    usePagination,
  );

  return (
    <div className="match-table">
      <table className="match-table__table" {...getTableProps()}>
        {caption && (
          <caption className="match-table__caption">{caption}</caption>
        )}
        {subCaption && (
          <caption className="match-table__sub-caption">{subCaption}</caption>
        )}
        <thead>
          <tr>
            <th colSpan={visibleColumns.length}>
              {globalFilterFunction && (
                <GlobalFilter setGlobalFilter={setGlobalFilter} />
              )}
            </th>
          </tr>
          {
            // Loop over the header rows
            headerGroups.map((headerGroup) => (
              // Apply the header row props
              // eslint-disable-next-line react/jsx-key
              <tr
                className="match-table__row"
                {...headerGroup.getHeaderGroupProps()}
              >
                {
                  // Loop over the headers in each row
                  headerGroup.headers.map((column) => (
                    // Apply the header cell props
                    // eslint-disable-next-line react/jsx-key
                    <th
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                    >
                      {
                        // Render the header
                        column.render('Header')
                      }
                      <span>
                        {/* eslint-disable-next-line */}
                        {column.isSorted
                          ? column.isSortedDesc
                            ? ' 🔽'
                            : ' 🔼'
                          : ''}
                      </span>
                    </th>
                  ))
                }
              </tr>
            ))
          }
        </thead>

        <tbody {...getTableBodyProps()}>
          {page.length === 0 ? (
            <tr className="match-table__row">
              <td colSpan={visibleColumns.length}>{noDataMessage}</td>
            </tr>
          ) : (
            // Loop over the table rows
            page.map((row) => {
              // Prepare the row for display
              prepareRow(row);
              return (
                // Apply the row props
                // eslint-disable-next-line react/jsx-key
                <tr
                  className={classNames(
                    'match-table__row',
                    'match-table__row--match',
                  )}
                  {...row.getRowProps()}
                  onClick={() => navigate(`/${row.original.matchID}`)}
                >
                  {
                    // Loop over the rows cells
                    row.cells.map((cell) => (
                      // Apply the cell props
                      // eslint-disable-next-line react/jsx-key
                      <td {...cell.getCellProps()}>
                        {
                          // Render the cell contents
                          cell.render('Cell')
                        }
                      </td>
                    ))
                  }
                </tr>
              );
            })
          )}
        </tbody>
      </table>
      {pageOptions.length > 1 && (
        <div className="match-table__pagination">
          <button
            type="button"
            onClick={() => gotoPage(0)}
            disabled={!canPreviousPage}
          >
            {'<<'}
          </button>
          <button
            type="button"
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
          >
            {'<'}
          </button>
          <button
            type="button"
            onClick={() => nextPage()}
            disabled={!canNextPage}
          >
            {'>'}
          </button>
          <button
            type="button"
            onClick={() => gotoPage(pageCount - 1)}
            disabled={!canNextPage}
          >
            {'>>'}
          </button>{' '}
          <span>
            Page{' '}
            <strong>
              {pageIndex + 1} of {pageOptions.length}
            </strong>{' '}
          </span>
          <span>
            | Go to page:{' '}
            <input
              type="number"
              defaultValue={pageIndex + 1}
              onChange={(e) => {
                const newPage = e.target.value ? Number(e.target.value) - 1 : 0;
                gotoPage(newPage);
              }}
              style={{ width: '100px' }}
            />
          </span>{' '}
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
            }}
          >
            {[10, 20, 30, 40, 50].map((size) => (
              <option key={size} value={size}>
                Show {size}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};
