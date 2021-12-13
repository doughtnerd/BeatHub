import { writable, derived, readable } from "svelte/store";

function createVideoPreviewStore () {
    const store = writable(null);

    const preview = (beatmap) => {
        store.set(beatmap.id)
    }

    const stop = () => {
        store.set(null);
    }

    return {
        subscribe: store.subscribe,
        preview,
        stop
    }
}

export const beatmapVideoPreviewStore = createVideoPreviewStore();