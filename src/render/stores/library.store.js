import { writable } from "svelte/store";
import {
  LOAD_LIBRARY
} from "../../constants/channelNames";

function createLibraryStore () {
  const { subscribe, set, update } = writable([]);

  const loadLibrary = () => {
    window.api.invoke(LOAD_LIBRARY).then(library => {
      set(library ?? []);
    });
  }

  const scanForSongs = () => {
    window.api.invoke('scanForSongs').then(() => {loadLibrary()});
  }

  const deleteSong = (key, name) => {
    window.api.invoke('deleteSong', {key, name}).then(() => {loadLibrary()});
  }

  return {
    subscribe,
    loadLibrary,
    scanForSongs,
    deleteSong
  }
}

export const libraryStore = createLibraryStore()