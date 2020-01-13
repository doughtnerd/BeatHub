import { writable } from "svelte/store";

const electron = require("electron");
const { ipcRenderer } = electron;

function createUpdateDialogStore() {
  const store = writable({
    isOpen: false
  });

  ipcRenderer.on("updateDownloaded", () => {
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
      ipcRenderer.invoke("restartAndUpdate");
    }
  };
}

export const updateDialogStore = createUpdateDialogStore();
