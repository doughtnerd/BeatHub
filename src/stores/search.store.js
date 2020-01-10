import { writable, get } from "svelte/store";
import { SEARCH_API } from "../constants/beatsaver-api.constants";

function makeQuery(page, query) {
  if (!query || query == "") return Promise.resolve([]);
  return fetch(`${SEARCH_API}${page}?q=${query}`)
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
          query: query,
          error: null
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
