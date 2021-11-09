import React, { HTMLAttributes } from 'react';
import classNames from 'classnames';
import style from './style.module.scss';
import { Logo } from '../Logo';
import { ReactComponent as GithubSvg } from '../../assets/svg/github.svg';

export const LobbyPage: React.FC<HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => (
  <div className={classNames(style.lobbyPage, className)} {...props}>
    <GithubLink />
    {children}
  </div>
);

export const SmallLogo = () => <Logo size="small" className={style.smallLogo} />;

export const GithubLink = () => (
  <a
    className={style.githubLink}
    href="https://github.com/mbrinkl/santorini"
    target="_blank"
    rel="noopener noreferrer"
  >
    <GithubSvg />
  </a>
);
