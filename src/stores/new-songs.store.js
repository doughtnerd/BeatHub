import { writable, get } from "svelte/store";

const nextPageNumberStore = writable(0);
function createNewSongStore(nextPageNumberStore) {
  const { set, update, subscribe } = writable([]);

  return {
    subscribe,
    loadNextPage: async () => {
      const pageNumberToLoad = get(nextPageNumberStore);
      const newSongs = await fetch(
        `https://beatsaver.com/api/maps/latest/${pageNumberToLoad}`
      )
        .then(res => {
          return res.json();
        })
        .then(data => {
          return data.docs;
        });

      update(current => {
        return [...current, ...newSongs];
      });

      nextPageNumberStore.update(n => n + 1);
    }
  };
}

export const newSongsStore = createNewSongStore(nextPageNumberStore);
