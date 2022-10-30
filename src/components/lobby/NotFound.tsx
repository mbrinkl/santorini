import { ButtonLink } from '../common/Button';
import LobbyPage from './Wrapper';
import './NotFound.scss';

const NotFound = (): JSX.Element => (
  <LobbyPage>
    <h1 className="not-found__title">Page not Found</h1>
    <ButtonLink to="/">Home</ButtonLink>
  </LobbyPage>
);

export default NotFound;
