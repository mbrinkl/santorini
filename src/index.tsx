import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AppRoot } from './App';
import './styles/index.scss';

const container = document.getElementById('root');
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = createRoot(container!);
root.render(
  <StrictMode>
    <AppRoot />
  </StrictMode>,
);
