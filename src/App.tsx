import { StoreProvider } from 'easy-peasy';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
} from 'react-router-dom';
import { CreatePage } from './components/Lobby/Create';
import { JoinPage } from './components/Lobby/Join';
import { GameLobby } from './components/Lobby/Game';
import { SetupNickname } from './components/Lobby/SetupNickname';
import { initializeStore, useStoreState } from './store';
import { NICKNAME_STORAGE_KEY, PLAYER_STORAGE_KEY } from './config/client';
import { StoreModel } from './types/StoreTypes';
import { Home } from './components/Lobby/Home';

const savedNickname = localStorage.getItem(NICKNAME_STORAGE_KEY);
const savedPlayer = localStorage.getItem(PLAYER_STORAGE_KEY);

const store = initializeStore({
  nickname: savedNickname || null,
  activeRoomPlayer: savedPlayer ? JSON.parse(savedPlayer) : null,
} as StoreModel);

const App = () => {
  const nickname = useStoreState((s) => s.nickname);
  const navigate = useNavigate();

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<CreatePage />} />
        <Route path="/rooms" element={<JoinPage />} />
        <Route path="/rooms/:matchID" element={nickname ? <GameLobby /> : <SetupNickname />} />
        <Route path="/nickname" element={<SetupNickname onSubmit={() => navigate('/')} />} />
      </Routes>
    </div>
  );
};

const AppRoot = () => (
  <StoreProvider store={store}>
    <Router>
      <App />
    </Router>
  </StoreProvider>
);

export default AppRoot;
