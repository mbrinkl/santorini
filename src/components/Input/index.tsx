import React, { InputHTMLAttributes } from 'react';
import classNames from 'classnames';
import style from './style.module.scss';

export const Input: React.FC<InputHTMLAttributes<HTMLInputElement>> = ({
  type = 'text',
  className,
  ...props
}) => (
  <input
    className={classNames(style.input, className)}
    type={type}
    {...props}
  />
);
