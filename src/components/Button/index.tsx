import React, { ButtonHTMLAttributes } from 'react';
import { Link, LinkProps } from 'react-router-dom';
import style from './style.module.scss';

interface ButtonProps {
  theme?: 'red' | 'yellow' | 'blue' | 'green';
  size?: 'small' | 'medium';
}

export const Button = React.forwardRef<
HTMLButtonElement,
ButtonProps & ButtonHTMLAttributes<HTMLButtonElement>
>(({
  className, theme = 'blue', size = 'medium', ...props
}, ref) => (
  <button
    ref={ref}
    type="button"
    className={`
      ${style.button}
      ${style[`button--${theme}`]}
      ${style[`button--size-${size}`]}
      ${className}`}
    {...props}
  />
));

export const ButtonLink: React.FC<ButtonProps & LinkProps> = ({
  className,
  theme = 'blue',
  size = 'medium',
  ...props
}) => (
  <Link
    className={`
      ${style.button},
      ${style[`button--${theme}`]}
      ${style[`button--size-${size}`]}
      ${className}`}
    {...props}
  />
);
