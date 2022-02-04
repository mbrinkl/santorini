import { InputHTMLAttributes } from 'react';
import style from './style.module.scss';

export const Input = ({
  type = 'text',
  className,
  ...props
} : InputHTMLAttributes<HTMLInputElement>) : JSX.Element => (
  <input
    className={`${style.input} ${className}`}
    type={type}
    {...props}
  />
);
