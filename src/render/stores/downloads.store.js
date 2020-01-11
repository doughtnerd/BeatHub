import { writable, derived, readable } from "svelte/store";
import JSZip from "jszip";

const { remote } = window.require("electron");
const fs = remote.require("fs");

async function downloadBeatmap(beatmap) {
  const resp = await fetch(`https://beatsaver.com` + beatmap.directDownload);
  const blob = await resp.blob();

  const zip = new JSZip();
  await zip.loadAsync(blob);

  Object.keys(zip.files).forEach(async filename => {
    const content = await zip.file(filename).async("nodebuffer");
    const songFolderName = formatFolderName(beatmap);
    const destFolder = `${ROOT_DOWNLOAD_FOLDER}${songFolderName}/`;

    if (!fs.existsSync(destFolder)) {
      fs.mkdirSync(destFolder);
    }

    const dest = destFolder + filename;
    fs.writeFileSync(dest, content);
  });
}

function formatFolderName(beatmap) {
  const key = beatmap.key;
  const { songName, levelAuthorName } = beatmap.metadata;

  return `${key} (${songName.replace(
    /[\\/:*?"<>|.]/g,
    ""
  )} - ${levelAuthorName})`;
}

function createDownloadsStore() {
  const store = writable({
    downloadDirectory:
      "C:/Program Files (x86)/Steam/steamapps/common/Beat Saber/Beat Saber_Data/CustomLevels/",
    downloading: {},
    completed: {}
  });

  return {
    subscribe: store.subscribe,
    changeDownloadDirectory: newDirectory => {
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
            [beatmap.key]: beatmap
          }
        };
      });

      await downloadBeatmap(beatmap);

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
    }
  };
}

export const downloads = createDownloadsStore();
