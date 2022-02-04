import { HTMLAttributes } from 'react';
import style from './style.module.scss';
import { Logo } from '../Logo';
import { ReactComponent as GithubSvg } from '../../assets/svg/github.svg';

export const SmallLogo = () : JSX.Element => <Logo size="small" className={style.smallLogo} />;

export const GithubLink = () : JSX.Element => (
  <a
    className={style.githubLink}
    href="https://github.com/mbrinkl/santorini"
    target="_blank"
    rel="noopener noreferrer"
  >
    <GithubSvg />
  </a>
);

export const LobbyPage = ({
  className,
  children,
  ...props
} : HTMLAttributes<HTMLDivElement>) : JSX.Element => (
  <div className={`${style.lobbyPage} ${className}`} {...props}>
    <GithubLink />
    {children}
  </div>
);
