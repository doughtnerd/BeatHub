import { writable } from "svelte/store";

function createUpdateDialogStore() {
  const store = writable({
    isOpen: false
  });

  window.api.receive("updateDownloaded", () => {
    store.set({ isOpen: true });
  });

  return {
    subscribe: store.subscribe,
    open: () => {
      store.set({ isOpen: true });
    },
    close: () => {
      store.set({ isOpen: false });
    },
    updateAndRestart: () => {
      window.api.invoke("restartAndUpdate");
    }
  };
}

export const updateDialogStore = createUpdateDialogStore();
