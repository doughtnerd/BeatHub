import { writable } from "svelte/store";

function createNewSongStore() {
  const { set, update, subscribe } = writable([]);

  return {
    subscribe,
    loadPage: async pageNumber => {
      const newSongs = await fetch(
        `https://beatsaver.com/api/maps/downloads/${pageNumber}`
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
    }
  };
}

export const topDownloadedSongsStore = createNewSongStore();
