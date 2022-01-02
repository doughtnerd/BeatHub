
import { derived, writable, get } from 'svelte/store';

function syncSongLibrary() {
  return window.api.invoke('syncSongLibrary')
}

function getAllSongs() {
  return window.api.invoke('getAllSongs')
}

function createLibraryStore() {
  const store = writable([]);
  const { set, update, subscribe } = store;

  getAllSongs().then(songs => {
    set(songs);
  });

  function sync() {
    syncSongLibrary().then(() => getAllSongs()).then(songs => {set(songs)});
  }

  function isInLibrary(key) {
    return !!get(store).find((song) => song.key === key);
  }

  function getSongsByArtist(artist) {
    return get(store).filter((song) => song.song_author === artist).sort((a, b) => a.song_title.localeCompare(b.song_title));
  }

  function getSongsByUploader(uploader) {
    return get(store).filter((song) => song.uploader === uploader).sort((a, b) => a.song_title.localeCompare(b.song_title));
  }

  function deleteSong(song) {
    window.api.invoke('deleteSong', {folder_hash: song.folder_hash}).then(() => getAllSongs()).then(songs => {set(songs)});
  }

  return {
    subscribe,
    sync,
    isInLibrary,
    getSongsByArtist,
    getSongsByUploader,
    deleteSong
  }
}

export const libraryStore = createLibraryStore();
export const artistsStore = derived(libraryStore, $library => $library.map(song => song.song_author).filter((v, i, a) => a.indexOf(v) === i).sort())
export const uploadersStore = derived(libraryStore, $library => $library.map(song => song.uploader).filter((v, i, a) => a.indexOf(v) === i).sort())
export const libraryKeysStore = derived(libraryStore, $library => $library.reduce((acc, next) => { acc[next.key] = true; return acc }, {}))