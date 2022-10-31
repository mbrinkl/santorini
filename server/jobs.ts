import { StorageAPI } from 'boardgame.io';

const hour = 60 * 60 * 1000;
const day = 24 * hour;

// Delete games that have not been updated for 1 day and are not complete
async function deleteStaleGames(db: StorageAPI.Async | StorageAPI.Sync) {
  const dayAgo = Date.now() - day;
  const staleMatchIDs = await db.listMatches({
    where: {
      updatedBefore: dayAgo,
      isGameover: false,
    },
  });
  staleMatchIDs.forEach((matchID) => {
    db.wipe(matchID);
  });
}

export function setupServerJobs(db: StorageAPI.Async | StorageAPI.Sync) {
  setInterval(() => deleteStaleGames(db), hour);
}
