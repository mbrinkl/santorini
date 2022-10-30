import { StorageCache } from '@boardgame.io/storage-cache';

class ExtendedStorageCache extends StorageCache {
  async setMetadata(...args: Parameters<StorageCache['setMetadata']>) {
    const [matchID, matchData] = args;

    if (matchData.gameover == null && matchData.setupData != null) {
      await super.setMetadata(matchID, { ...matchData, setupData: null });
    } else {
      await super.setMetadata(...args);
    }
  }

  async setState(...args: Parameters<StorageCache['setState']>) {
    const [matchID, state] = args;

    await super.setState(...args);

    if (state.ctx.gameover != null) {
      const { metadata } = await this.fetch(matchID, {
        metadata: true,
      });
      const seed = state.plugins.random.data.seed as string;
      await super.setMetadata(matchID, {
        ...metadata,
        setupData: seed,
        players: {
          ...metadata.players,
          0: {
            ...metadata.players[0],
            data: { character: state.G.players[0].charState.name },
          },
          1: {
            ...metadata.players[1],
            data: { character: state.G.players[1].charState.name },
          },
        },
      });
    }
  }
}

export default ExtendedStorageCache;
