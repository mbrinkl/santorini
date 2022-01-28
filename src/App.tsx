import { StoreProvider } from 'easy-peasy';
import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
} from 'react-router-dom';
import { JoinPage } from './components/JoinPage';
import { GameLobby } from './components/Lobby';
import { SetupNickname } from './components/SetupNickname';
import { initializeStore, useStoreState } from './store';
import { NICKNAME_STORAGE_KEY, PLAYER_STORAGE_KEY } from './config/client';
import { StoreModel } from './types/StoreTypes';
import { Home } from './components/Home';

const savedNickname = localStorage.getItem(NICKNAME_STORAGE_KEY);
const savedPlayer = localStorage.getItem(PLAYER_STORAGE_KEY);

const store = initializeStore({
  nickname: savedNickname || null,
  activeRoomPlayer: savedPlayer ? JSON.parse(savedPlayer) : null,
} as StoreModel);

const App: React.FC = () => {
  const nickname = useStoreState((s) => s.nickname);
  const navigate = useNavigate();

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/rooms" element={nickname ? <JoinPage /> : <SetupNickname />} />
        <Route path="/rooms/:id" element={nickname ? <GameLobby /> : <SetupNickname />} />
        <Route path="/nickname" element={<SetupNickname onSubmit={() => navigate('/')} />} />
      </Routes>
    </div>
  );
};

const AppRoot: React.FC = () => (
  <StoreProvider store={store}>
    <Router>
      <App />
    </Router>
  </StoreProvider>
);

export default AppRoot;
