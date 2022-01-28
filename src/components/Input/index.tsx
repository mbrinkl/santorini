import React, { InputHTMLAttributes } from 'react';
import style from './style.module.scss';

export const Input: React.FC<InputHTMLAttributes<HTMLInputElement>> = ({
  type = 'text',
  className,
  ...props
}) => (
  <input
    className={`${style.input} ${className}`}
    type={type}
    {...props}
  />
);
