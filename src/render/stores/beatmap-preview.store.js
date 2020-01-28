import { writable, derived, readable } from "svelte/store";
import { errorsStore } from "./errors.store";
import {
  PREVIEW_BEATMAP,
  PREVIEW_LOADED,
  PREVIEW_ERROR
} from "../../constants/channelNames";

function createBeatmapPreviewStore() {
  const store = writable({
    beatmapToPreview: null,
    activePreview: null,
    previewUrl: "",
    loading: false
  });

  window.api.receive(PREVIEW_LOADED, ({ buffer, beatmap }) => {
    const blob = new Blob([buffer], { type: "application/octet-stream" });
    const previewUrl = URL.createObjectURL(blob);

    store.set({
      beatmapToPreview: null,
      activePreview: beatmap,
      previewUrl,
      loading: false
    });
  });

  window.api.receive(PREVIEW_ERROR, ({ beatmap, error }) => {
    errorsStore.showMessage(
      "Encountered error while trying to preview " + beatmap.name
    );
    store.set({
      beatmapToPreview: null,
      activePreview: null,
      previewUrl: "",
      loading: false
    });
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

      window.api.invoke(PREVIEW_BEATMAP, { beatmap });
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
