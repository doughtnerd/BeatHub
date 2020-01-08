import { writable, derived, readable } from "svelte/store";
import JSZip from "jszip";

function createBeatmapPreviewStore() {
  const { subscribe, set, update } = writable();

  return {
    subscribe,
    preview: beatmap => set(beatmap),
    stop: () => set()
  };
}

export const beatmapPreview = createBeatmapPreviewStore();

export const previewUrl = derived(
  beatmapPreview,
  async ($currentBeatmap, set) => {
    if (!$currentBeatmap) {
      set("");
      return;
    }
    const resp = await fetch(
      `https://beatsaver.com` + $currentBeatmap.directDownload
    );
    const blob = await resp.blob();

    const zip = new JSZip();
    await zip.loadAsync(blob);

    const info = zip.file("info.dat");
    const infoJSON = JSON.parse(await info.async("text"));

    const songFilename = infoJSON._songFilename;
    const audioFile = zip.file(songFilename);
    const audio = await audioFile.async("blob");
    const audioUrl = URL.createObjectURL(audio);
    set(audioUrl);
  }
);
