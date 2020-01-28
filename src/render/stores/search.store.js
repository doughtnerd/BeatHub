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
    maps: [],
    query: "",
    error: null,
    searching: false,
    loading: false
  });

  const { set, update, subscribe } = store;

  return {
    subscribe,
    search: async query => {
      const storeVal = get(store);
      if (query === storeVal.query) return;
      try {
        update(current => ({
          ...current,
          query,
          searching: true,
          loading: true
        }));
        const results = await makeQuery(0, query);
        update(current => ({
          ...current,
          maps: [...results],
          searching: false,
          nextPage: 1,
          loading: false
        }));
      } catch (err) {
        set({
          nextPage: 0,
          maps: [],
          query: query,
          error: err,
          searching: false,
          loading: false
        });
      }
    },
    loadNextPage: async () => {
      let { nextPage, query, maps } = get(store);
      try {
        update(current => ({
          ...current,
          loading: true
        }));
        let results = await makeQuery(nextPage, query);
        update(current => ({
          nextPage: current.nextPage + 1,
          maps: [...current.maps, ...results],
          query: query,
          error: null,
          loading: false
        }));
      } catch (err) {
        update(current => ({
          ...current,
          error: err,
          loading: false
        }));
      }
    }
  };
}

export const searchStore = createSearchStore();
