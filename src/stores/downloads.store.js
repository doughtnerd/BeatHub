import { writable, derived, readable } from "svelte/store";
import JSZip from "jszip";

const { remote } = window.require("electron");
const fs = remote.require("fs");

const ROOT_DOWNLOAD_FOLDER = "/Users/ccarlson/Desktop/";

export const downloads = createDownloadsStore();

function createDownloadsStore() {
  const { subscribe, set, update } = writable([]);

  return {
    subscribe,
    download: async beatmap => {
      // downloadBeatmap(beatmap);
      const resp = await fetch(
        `https://beatsaver.com` + beatmap.directDownload
      );
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
  };
}

function formatFolderName(beatmap) {
  const key = beatmap.key;
  const { songName, levelAuthorName } = beatmap.metadata;

  return `${key} (${songName.replace(
    /[\\/:*?"<>|.]/g,
    ""
  )} - ${levelAuthorName})`;
}
