import { Link } from 'react-router-dom';
import './ButtonBack.scss';

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
