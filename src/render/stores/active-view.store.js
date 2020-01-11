import { writable } from "svelte/store";

export const NEW_MAPS = "newMaps";
export const TOP_RATED_MAPS = "topRatedMaps";
export const TOP_DOWNLOADED_MAPS = "topDownloadedMaps";
export const TOP_PLAYED_MAPS = "topPlayedMaps";
export const HOT_MAPS = "hotMaps";
export const SEARCH = "search";
export const SETTINGS = "settings";
export const DOWNLOADS = "downloads";

export const activeView = writable(SEARCH);
