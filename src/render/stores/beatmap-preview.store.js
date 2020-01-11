import { writable, derived, readable } from "svelte/store";
import JSZip from "jszip";

async function loadPreview(beatmap) {
  const resp = await fetch(`https://beatsaver.com` + beatmap.directDownload);
  const blob = await resp.blob();

  const zip = new JSZip();
  await zip.loadAsync(blob);

  const info = zip.file("info.dat");
  const infoJSON = JSON.parse(await info.async("text"));

  const songFilename = infoJSON._songFilename;
  const audioFile = zip.file(songFilename);
  const audio = await audioFile.async("blob");
  return URL.createObjectURL(audio);
}

function createBeatmapPreviewStore() {
  const store = writable({
    beatmapToPreview: null,
    activePreview: null,
    previewUrl: "",
    loading: false
  });

  return {
    subscribe: store.subscribe,
    preview: async beatmap => {
      store.set({
        beatmapToPreview: beatmap,
        activebeatmapToPreviewPreview: null,
        previewUrl: "",
        loading: true
      });
      const previewUrl = await loadPreview(beatmap);
      store.set({
        beatmapToPreview: null,
        activePreview: beatmap,
        previewUrl,
        loading: false
      });
    },
    stop: () => {
      store.set({
        beatmapToPreview: null,
        activePreview: null,
        previewUrl: "",
        loading: false
      });
    }
  };
}

export const beatmapPreviewStore = createBeatmapPreviewStore();
export const activeBeatmapPreviewKey = derived(
  beatmapPreviewStore,
  $beatmapPreviewStore => {
    const { activePreview } = $beatmapPreviewStore;
    return activePreview && activePreview.key ? activePreview.key : null;
  }
);

export const beatmapToPreviewKey = derived(
  beatmapPreviewStore,
  $beatmapPreviewStore => {
    const { beatmapToPreview } = $beatmapPreviewStore;
    return beatmapToPreview && beatmapToPreview.key
      ? beatmapToPreview.key
      : null;
  }
);
