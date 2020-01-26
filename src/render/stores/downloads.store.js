import { writable } from "svelte/store";
import {
  GET_DOWNLOAD_DIRECTORY,
  DOWNLOAD_BEATMAP,
  DOWNLOAD_COMPLETE
} from "../../constants/channelNames";

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

  // window.api.receive(
  //   "downloadProgress",
  //   ({ beatmap, bytesReceived, totalBytes }) => {
  //     store.update(current => ({
  //       ...current,
  //       downloading: {
  //         ...current.downloading,
  //         [beatmap.key]: {
  //           beatmap,
  //           bytesReceived,
  //           totalBytes
  //         }
  //       }
  //     }));
  //   }
  // );

  window.api.receive(DOWNLOAD_COMPLETE, ({ beatmap }) => {
    store.update(current => {
      const newDownloading = { ...current.downloading };
      delete newDownloading[beatmap.key];
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
