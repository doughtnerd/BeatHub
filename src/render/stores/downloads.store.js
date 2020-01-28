import { writable, derived } from "svelte/store";
import {
  GET_DOWNLOAD_DIRECTORY,
  DOWNLOAD_BEATMAP,
  DOWNLOAD_COMPLETE,
  DOWNLOAD_ERROR
} from "../../constants/channelNames";

import { toastStore } from "./toast.store";
import { errorsStore } from "./errors.store";

function createDownloadsStore() {
  const store = writable({
    downloadDirectory: "",
    downloading: {},
    completed: {}
  });

  window.api.invoke(GET_DOWNLOAD_DIRECTORY).then(dir => {
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
      delete newDownloading[beatmap.key];

      return {
        ...current,
        downloading: newDownloading
      };
    });
  });

  window.api.receive(DOWNLOAD_COMPLETE, ({ beatmap }) => {
    store.update(current => {
      const newDownloading = { ...current.downloading };
      delete newDownloading[beatmap.key];

      toastStore.show(`Download complete: ${beatmap.metadata.songName}`);

      return {
        ...current,
        downloading: newDownloading,
        completed: {
          ...current.completed,
          [beatmap.key]: beatmap
        }
      };
    });
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
    changeDownloadDirectory: async newDirectory => {
      await window.api.invoke(CHANGE_DOWNLOAD_DIRECTORY, newDirectory);
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
            [beatmap.key]: {
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
