import { writable, derived, readable } from "svelte/store";

function createSongDownloadQueueStore() {
  const { subscribe, set, update } = writable([]);

  return {
    subscribe,
    queue: song => {
      update(current => [...current, song]);
    }
  };
}

export const songDownloadQueue = createSongDownloadQueueStore();
