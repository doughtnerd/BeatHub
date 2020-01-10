import { writable, get } from "svelte/store";
import {
  HOT_MAPS_API,
  TOP_DOWNLOADED_MAPS_API,
  TOP_RATED_MAPS_API,
  NEW_MAPS_API
} from "../constants/beatsaver-api.constants";

function makeQuery(endpoint, nextPage) {
  return fetch(`${endpoint}${nextPage}`)
    .then(res => {
      return res.json();
    })
    .then(data => {
      return data.docs;
    });
}

function createBeatmapStore(endpoint) {
  const store = writable({
    nextPage: 0,
    songs: [],
    error: null
  });

  return {
    subscribe: store.subscribe,
    loadNextPage: async () => {
      const { nextPage } = get(store);
      try {
        const newSongs = await makeQuery(endpoint, nextPage);

        store.update(current => {
          return {
            nextPage: current.nextPage + 1,
            songs: [...current.songs, ...newSongs],
            error: null
          };
        });
      } catch (err) {
        store.update(current => ({ ...current, error: err }));
      }
    }
  };
}

export const hotMapsStore = createBeatmapStore(HOT_MAPS_API);
export const topDownloadedMapsStore = createBeatmapStore(
  TOP_DOWNLOADED_MAPS_API
);
export const topRatedMapsStore = createBeatmapStore(TOP_RATED_MAPS_API);
export const newMapsStore = createBeatmapStore(NEW_MAPS_API);
