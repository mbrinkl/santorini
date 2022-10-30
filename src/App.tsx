import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
} from 'react-router-dom';
import { Provider } from 'react-redux';
import CreatePage from './components/lobby/Create';
import JoinPage from './components/lobby/Join';
import { GameLobby } from './components/lobby/Game';
import SetupNickname from './components/lobby/SetupNickname';
import { store, useAppSelector } from './store';
import Home from './components/lobby/Home';
import NotFound from './components/lobby/NotFound';
import WatchPage from './components/lobby/Watch';

const App = () => {
  const nickname = useAppSelector((s) => s.user.nickname);
  const navigate = useNavigate();

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<CreatePage />} />
        <Route path="/join" element={<JoinPage />} />
        <Route path="/watch" element={<WatchPage />} />
        <Route
          path="/nickname"
          element={<SetupNickname onSubmit={() => navigate('/')} />}
        />
        <Route
          path="/:matchID"
          element={nickname ? <GameLobby /> : <SetupNickname />}
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

const AppRoot = () => (
  <Provider store={store}>
    <Router>
      <App />
    </Router>
  </Provider>
);

export default AppRoot;
