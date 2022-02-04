import { ReactComponent as LogoSvg } from '../../assets/svg/logo.svg';
import './style.scss';

interface Props {
  size: 'small' | 'medium' | 'large' | 'tiny';
  className?: string;
}

export const Logo = ({ size, className, ...props } : Props) => (
  <LogoSvg
    className={`Logo ${`Logo--${size}`} ${className}`}
    {...props}
  />
);
