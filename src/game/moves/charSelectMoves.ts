import { Ctx } from 'boardgame.io';
import { initCharacter } from '../index';
import { GameState } from '../../types/GameTypes';

export function SetChar(G: GameState, ctx: Ctx, id: string, name: string) {
  G.players[id].ready = false;
  G.players[id].char = initCharacter(name);
}

export function Ready(G: GameState, ctx: Ctx, id: string) {
  G.players[id].ready = true;
}

export function CancelReady(G: GameState, ctx: Ctx, id: number) {
  G.players[id].ready = false;
}
