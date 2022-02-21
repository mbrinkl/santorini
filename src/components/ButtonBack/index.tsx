import { Link } from 'react-router-dom';
import './style.scss';

export const ButtonBack = ({
  to,
  text = 'Back',
}: {
  to: string;
  text?: string;
}): JSX.Element => (
  <Link to={to} className="ButtonBack">
    {`↤ ${text}`}
  </Link>
);
