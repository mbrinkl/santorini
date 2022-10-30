import { Link } from 'react-router-dom';
import './ButtonBack.scss';

const ButtonBack = ({
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

export default ButtonBack;
