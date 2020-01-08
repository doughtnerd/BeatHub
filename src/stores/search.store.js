import { writable, get } from "svelte/store";

function makeQuery(page, query) {
  if (!query || query == "") return Promise.resolve([]);
  return fetch(`https://beatsaver.com/api/search/text/${page}?q=${query}`)
    .then(res => {
      return res.json();
    })
    .then(data => {
      return data.docs;
    });
}

function createSearchStore() {
  const store = writable({
    nextPage: 0,
    songs: [],
    query: ""
  });

  const { set, update, subscribe } = store;

  return {
    subscribe,
    search: async query => {
      try {
        const results = await makeQuery(0, query);
        set({
          nextPage: 1,
          songs: [...results],
          query: query,
          error: null
        });
      } catch (err) {
        set({
          nextPage: 0,
          songs: [],
          query: query,
          error: err
        });
      }
    },
    loadNextPage: async () => {
      let { nextPage, query, songs } = get(store);
      try {
        let results = await makeQuery(nextPage, query);
        update(current => ({
          nextPage: current.nextPage + 1,
          songs: [...current.songs, ...results],
          query: query
        }));
      } catch (err) {
        update(current => ({
          ...current,
          error: err
        }));
      }
    }
  };
}

export const searchStore = createSearchStore();
