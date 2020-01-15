import { writable } from "svelte/store";

export const NEW_MAPS = "New Maps";
export const TOP_RATED_MAPS = "Top Rated";
export const TOP_DOWNLOADED_MAPS = "Top Downloaded";
export const TOP_PLAYED_MAPS = "Top Played";
export const HOT_MAPS = "Hottest";
export const SEARCH = "Search";
export const SETTINGS = "Settings";
export const DOWNLOADS = "Downloads";

export const activeView = writable(SEARCH);
