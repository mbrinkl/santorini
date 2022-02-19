import { StorageCache } from '@boardgame.io/storage-cache';

export class ExtendedStorageCache extends StorageCache {
  // expose the random seed in setupdata when the game ends
  async setMetadata(...args: Parameters<StorageCache['setMetadata']>) {
    const [matchID, matchData] = args;
    if (matchData.gameover != null && matchData.setupData == null) {
      const { initialState } = await this.fetch(matchID, { initialState: true });
      const seed = initialState.plugins.random.data.seed as string;
      const cacheMetadata = this.cache.metadata.get(matchID);
      if (cacheMetadata) {
        cacheMetadata.setupData = seed;
      }
      await super.setMetadata(matchID, { ...matchData, setupData: seed });
    } else if (matchData.gameover == null && matchData.setupData != null) {
      const cacheMetadata = this.cache.metadata.get(matchID);
      if (cacheMetadata) {
        cacheMetadata.setupData = null;
      }
      await super.setMetadata(matchID, { ...matchData, setupData: null });
    } else {
      await super.setMetadata(...args);
    }
  }
}
