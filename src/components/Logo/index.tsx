import React from 'react';
import classNames from 'classnames';
import { ReactComponent as LogoSvg } from '../../assets/svg/logo.svg';
import './style.scss';

interface Props {
  size: 'small' | 'medium' | 'large' | 'tiny';
  className?: string;
}

export const Logo: React.FC<Props> = ({ size, className, ...props }) => (
  <LogoSvg
    className={classNames('Logo', `Logo--${size}`, className)}
    {...props}
  />
);
