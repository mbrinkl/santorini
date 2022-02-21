import { ButtonLink } from '../Button';
import { LobbyPage } from '../Lobby/Wrapper';
import './style.scss';

export const NotFound = (): JSX.Element => (
  <LobbyPage>
    <h1 className="not-found__title">Page not Found</h1>
    <ButtonLink to="/">Home</ButtonLink>
  </LobbyPage>
);
