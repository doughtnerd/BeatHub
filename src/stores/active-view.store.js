import { writable, derived, readable } from "svelte/store";

export const NEW_SONGS = "newSongs";
export const TOP_RATED_SONGS = "topRatedSongs";
export const TOP_DOWNLOADED_SONGS = "topDownloadedSongs";
export const TOP_PLAYED_SONGS = "topPlayedSongs";
export const HOT_SONGS = "hotSongs";
export const SEARCH = "search";

export const activeView = writable(SEARCH);
