import { writable } from "svelte/store";

function createAppInfoStore() {
  const store = writable({
    appVersion: null
  });

  window.api.invoke("getAppVersion").then(version => {
    store.set({
      appVersion: version
    });
  });

  return {
    subscribe: store.subscribe
  };
}

export const appInfoStore = createAppInfoStore();
