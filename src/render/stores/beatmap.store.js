import { writable, get } from "svelte/store";
import {
  HOT_MAPS_API,
  TOP_DOWNLOADED_MAPS_API,
  TOP_RATED_MAPS_API,
  NEW_MAPS_API
} from "../constants/beatsaver-api.constants";
import { fetchMapsByLatest, fetchMapsByRating } from "../services/beatsaver-api";

function createBeatmapStore(endpoint, queryFn) {
  const store = writable({
    nextPage: 0,
    maps: [],
    error: null,
    loading: false
  });

  return {
    subscribe: store.subscribe,
    loadFirstPage: async () => {
      store.update(current => ({
        ...current,
        loading: true
      }));
      const newSongs = await queryFn(0)

      store.update(current => ({
        nextPage: current.nextPage + 1,
        maps: [...newSongs],
        error: null,
        loading: false
      }));
    },
    loadNextPage: async () => {
      const { nextPage, loading } = get(store);
      if (loading) return;
      try {
        store.update(current => ({
          ...current,
          loading: true
        }));
        const newSongs = await queryFn(nextPage)

        store.update(current => {
          return {
            nextPage: current.nextPage + 1,
            maps: [...current.maps, ...newSongs],
            loading: false,
            error: null
          };
        });
      } catch (err) {
        store.update(current => ({
          ...current,
          error: err,
          loading: false
        }));
      }
    }
  };
}

export const hotMapsStore = createBeatmapStore(HOT_MAPS_API, () => {});
export const topDownloadedMapsStore = createBeatmapStore(
  TOP_DOWNLOADED_MAPS_API
, () => {});
export const topRatedMapsStore = createBeatmapStore(TOP_RATED_MAPS_API, fetchMapsByRating);
export const newMapsStore = createBeatmapStore(NEW_MAPS_API, fetchMapsByLatest);
