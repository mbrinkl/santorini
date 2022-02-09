import React, { ButtonHTMLAttributes } from 'react';
import { Link, LinkProps } from 'react-router-dom';
import style from './style.module.scss';

interface ButtonProps {
  theme?: 'red' | 'yellow' | 'blue' | 'green';
  size?: 'small' | 'medium';
}

export const Button = React.forwardRef<
HTMLButtonElement, ButtonProps & ButtonHTMLAttributes<HTMLButtonElement>
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
Button.displayName = 'Button';

export const ButtonLink = ({
  className,
  theme = 'blue',
  size = 'medium',
  ...props
}: ButtonProps & LinkProps) : JSX.Element => (
  <Link
    className={`
      ${style.button}
      ${style[`button--${theme}`]}
      ${style[`button--size-${size}`]}
      ${className}`}
    {...props}
  />
);
