import { writable, derived } from "svelte/store";
import {
  GET_BEATSABER_DIRECTORY,
  DOWNLOAD_BEATMAP,
  DOWNLOAD_COMPLETE,
  DOWNLOAD_ERROR,
  CHANGE_DOWNLOAD_DIRECTORY
} from "../../constants/channelNames";

import { toastStore } from "./toast.store";
import { errorsStore } from "./errors.store";

import { libraryStore } from "./library.store";

function createDownloadsStore() {
  const store = writable({
    downloadDirectory: "",
    downloading: {},
    completed: {}
  });

  window.api.invoke('getBeatSaberDirectory').then(dir => {
    store.update(current => ({
      ...current,
      downloadDirectory: dir
    }));
  });

  window.api.receive(DOWNLOAD_ERROR, ({ error, beatmap }) => {
    errorsStore.showMessage(
      `Encountered error while trying to download ${beatmap.name}`
    );

    store.update(current => {
      const newDownloading = { ...current.downloading };
      delete newDownloading[beatmap.id];

      return {
        ...current,
        downloading: newDownloading
      };
    });
  });

  window.api.receive(DOWNLOAD_COMPLETE, ({ beatmap }) => {
    store.update(current => {
      const newDownloading = { ...current.downloading };
      delete newDownloading[beatmap.id];

      toastStore.show(`Download complete: ${beatmap.metadata.songName}`);

      return {
        ...current,
        downloading: newDownloading,
        completed: {
          ...current.completed,
          [beatmap.id]: beatmap
        }
      };
    });
    libraryStore.sync();
  });

  return {
    subscribe: store.subscribe,
    clearCompleted() {
      store.update(current => {
        return {
          ...current,
          completed: {}
        };
      });
    },
    changeDownloadDirectory: async () => {
      const newDirectory = await window.api.invoke('changeBeatSaberDirectory');
      store.update(current => ({
        ...current,
        downloadDirectory: newDirectory
      }));
    },
    download: async beatmap => {
      store.update(current => {
        return {
          ...current,
          downloading: {
            ...current.downloading,
            [beatmap.id]: {
              beatmap,
              bytesReceived: 0,
              totalBytes: 0
            }
          }
        };
      });
      await window.api.invoke(DOWNLOAD_BEATMAP, beatmap);
    }
  };
}

export const downloads = createDownloadsStore();
export const numberOfDownloads = derived(downloads, $downloads => {
  return Object.keys($downloads.downloading).length;
});
export const queuedBeatmaps = derived(downloads, $downloads => {
  return Object.values($downloads.downloading);
});
export const downloadedBeatmaps = derived(downloads, $downloads => {
  return Object.values($downloads.completed);
});
