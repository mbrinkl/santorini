import classNames from 'classnames';
import { useNavigate } from 'react-router-dom';
import './style.scss';

interface BodyProps {
  matchID: string;
  data: string[];
}

interface Props {
  caption?: string;
  subCaption?: string;
  headers: string[];
  body: BodyProps[];
  noBody: string;
}

export const MatchTable = ({
  caption,
  subCaption,
  headers,
  body,
  noBody,
}: Props): JSX.Element => {
  const navigate = useNavigate();

  return (
    <table className="match-table">
      {caption && <caption className="match-table__caption">{caption}</caption>}
      {subCaption && (
        <caption className="match-table__sub-caption">{subCaption}</caption>
      )}
      <thead>
        <tr className="match-table__row">
          {headers.map((header) => (
            <th key={header}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {body.length === 0 && (
          <tr className="match-table__row">
            <td colSpan={headers.length}>{noBody}</td>
          </tr>
        )}
        {body.map((bodyData) => (
          <tr
            key={bodyData.matchID}
            className={classNames(
              'match-table__row',
              'match-table__row--match',
            )}
            onClick={() => navigate(`/${bodyData.matchID}`)}
          >
            {bodyData.data.map((data) => (
              <td key={data}>{data}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
