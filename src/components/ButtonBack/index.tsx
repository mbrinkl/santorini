import React from 'react';
import { Link } from 'react-router-dom';
import './style.scss';

export const ButtonBack: React.FC<{ to: string, text?: string }> = ({ to, text = 'Back' }) => (
  <Link to={to} className="ButtonBack">
    {`↤ ${text}`}
  </Link>
);
