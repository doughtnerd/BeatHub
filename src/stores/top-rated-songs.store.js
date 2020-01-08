import { writable, get } from "svelte/store";

function makeQuery(nextPage) {
  return fetch(`https://beatsaver.com/api/maps/rating/${nextPage}`)
    .then(res => {
      return res.json();
    })
    .then(data => {
      return data.docs;
    });
}

function createTopRatedSongsStore() {
  const store = writable({
    nextPage: 0,
    songs: [],
    error: null
  });

  return {
    subscribe: store.subscribe,
    loadNextPage: async () => {
      const { nextPage } = get(store);
      const newSongs = await makeQuery(nextPage);

      store.update(current => ({
        nextPage: current.nextPage + 1,
        songs: [...current.songs, ...newSongs],
        error: null
      }));
    }
  };
}

export const topRatedSongsStore = createTopRatedSongsStore();
