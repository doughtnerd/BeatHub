import { writable } from "svelte/store";

function createToastQueueStore() {
  const store = writable({
    isShowing: false,
    message: null
  });

  let toastTimeoutHandle;

  return {
    subscribe: store.subscribe,
    show(message, time = 3000) {
      clearTimeout(toastTimeoutHandle);

      store.set({
        isShowing: true,
        message
      });

      toastTimeoutHandle = setTimeout(() => {
        store.set({
          isShowing: false,
          message: null
        });
      }, time);
    }
  };
}

export const toastStore = createToastQueueStore();
