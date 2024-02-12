import { LobbyAPI } from 'boardgame.io';
import { Server } from 'boardgame.io/server';

type Middleware = Parameters<ReturnType<typeof Server>['router']['use']>;

/**
 * Call a discord webhook whenever a full match is started
 */
export const discordWebhookMiddleware: Middleware = [
  '/games/:name/:id/join',
  async (ctx, next) => {
    await next();

    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    const serverUrl = process.env.RENDER_EXTERNAL_URL;
    const splitUrl = ctx.request.url.split('/');
    const { playerID } = ctx.response.body as LobbyAPI.JoinedMatch;

    if (!webhookUrl || !serverUrl || splitUrl.length !== 5 || playerID !== '1')
      return;

    const matchID = splitUrl[3];
    const createdMatchUrl = new URL(matchID, serverUrl).href;
    const now = new Date().toLocaleString();

    fetch(webhookUrl, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'Created Matches',
        avatar_url: 'https://i.imgur.com/YdHReCb.png',
        content: `${createdMatchUrl} ${now}`,
      }),
    }).catch();
  },
];
