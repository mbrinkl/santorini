declare module "boardgame.io/react" {
  import { ComponentType } from "react";
  import {
    Context,
    DefaultGameStatePlayerView,
    DefaultMoves,
    DefaultPlayerID,
    DefaultPhaseID,
  } from "boardgame.io/core";
  import { ChatMessage } from "boardgame.io";

  export interface BoardProps<
    GameStatePlayerView = DefaultGameStatePlayerView,
    Moves = DefaultMoves,
    PlayerID = DefaultPlayerID,
    PhaseID = DefaultPhaseID,
  > {
    G: GameStatePlayerView;
    ctx: Omit<Context<PlayerID, PhaseID>, "playerID">;
    moves: Moves;
    matchID: string;
    playerID: PlayerID;
    matchData: any;
    isActive: boolean;
    log: any;
    isMultiplayer: boolean;
    isConnected: boolean;
    events: any;
    undo(): void;
    redo(): void;
    sendChatMessage(message): void;
    chatMessages: ChatMessage[];
  }

  export interface ClientConfig<
    GameStatePlayerView = DefaultGameStatePlayerView,
    Moves = DefaultMoves,
    PlayerID = DefaultPlayerID,
    PhaseID = DefaultPhaseID
  > {
    game: object;
    numPlayers?: number;
    board?: ComponentType<
      BoardProps<GameStatePlayerView, Moves, PlayerID, PhaseID>
    >;
    multiplayer?: false | 
      ((transportOpts: SocketIOTransportOpts) => SocketIOTransport);
    debug?: boolean;
    [key: string]: any;
  }

  export interface ClientProps<PlayerID = DefaultPlayerID> {
    matchID?: string;
    playerID?: PlayerID;
    credentials?: string;
    debug?: boolean;
  }

  export function Client<
    GameStatePlayerView = DefaultGameStatePlayerView,
    Moves = DefaultMoves,
    PlayerID = DefaultPlayerID,
    PhaseID = DefaultPhaseID
  >(
    config: ClientConfig<GameStatePlayerView, Moves, PlayerID, PhaseID>
  ): ComponentType<ClientProps<PlayerID>>;

  export const Lobby: ComponentType<{
    gameServer: string;
    lobbyServer: string;
    gameComponents: { game: any; board: any }[];
  }>;
}
