import { StorageAPI } from 'boardgame.io';

const minute = 60 * 1000;
const day = 24 * 60 * minute;

// Delete games that have not been updated for 3 days and are not complete
async function deleteStaleGames(db: StorageAPI.Async | StorageAPI.Sync) {
  const expirationTime = Date.now() - 3 * day;
  const staleMatchIDs = await db.listMatches({
    where: {
      updatedBefore: expirationTime,
      isGameover: false,
    },
  });
  staleMatchIDs.forEach((matchID) => {
    db.wipe(matchID);
  });
}

export function setupServerJobs(db: StorageAPI.Async | StorageAPI.Sync) {
  setInterval(() => deleteStaleGames(db), 5 * minute);
}
