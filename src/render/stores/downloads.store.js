import { writable, derived } from "svelte/store";
import {
  DOWNLOAD_BEATMAP,
  DOWNLOAD_COMPLETE,
  DOWNLOAD_ERROR
} from "../../constants/channelNames";

import { toastStore } from "./toast.store";
import { errorsStore } from "./errors.store";
import { libraryStore } from "./library.store";

function createDownloadsStore() {
  const store = writable({
    downloading: {},
    completed: {}
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
    libraryStore.refreshLibrary();
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
