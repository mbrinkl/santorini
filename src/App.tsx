import { StoreProvider } from "easy-peasy";
import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  useHistory,
} from "react-router-dom";
import { GameLobby } from "./components/Lobby";
import { SetupNickname } from "./components/SetupNickname";
import { initializeStore, useStoreState } from "./store";
import {
  NICKNAME_STORAGE_KEY,
  PLAYER_STORAGE_KEY,
  StoreModel,
} from "./store/store";
import { Welcome } from "components/Welcome";

const savedNickname = localStorage.getItem(NICKNAME_STORAGE_KEY);
const savedPlayer = localStorage.getItem(PLAYER_STORAGE_KEY);

const store = initializeStore({
  nickname: savedNickname || null,
  activeRoomPlayer: savedPlayer ? JSON.parse(savedPlayer) : null,
} as StoreModel);

const App: React.FC = () => {
  const nickname = useStoreState((s) => s.nickname);
  const history = useHistory();

  return (
    <div className="App">
      <Switch>
        <Route exact path="/">
          <Welcome />
        </Route>

        <Route path="/rooms/:id">
          {nickname ? <GameLobby /> : <SetupNickname />}
        </Route>

        <Route path="/nickname">
          <SetupNickname onSubmit={() => history.push("/")} />
        </Route>
      </Switch>
    </div>
  );
};

const AppRoot: React.FC = () => {
  return (
    <StoreProvider store={store}>
      <Router>
        <App />
      </Router>
    </StoreProvider>
  );
};

export default AppRoot;
