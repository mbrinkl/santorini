import { createStore, createTypedHooks } from "easy-peasy";
import { setInitState, store } from "./store";
import { LobbyService } from "../api/lobbyService";
import { StoreModel } from "../types/StoreTypes";

const typedHooks = createTypedHooks<StoreModel>();

export const useStoreActions = typedHooks.useStoreActions;
export const useStoreDispatch = typedHooks.useStoreDispatch;
export const useStoreState = typedHooks.useStoreState;

export const initializeStore = (initialState?: StoreModel) => {
  setInitState(initialState);
  return createStore(store, {
    initialState,
    injections: { lobbyApi: new LobbyService() }
  });
};
