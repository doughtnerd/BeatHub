import { writable } from "svelte/store";

function createErrorsStore() {
  const store = writable({
    isShowing: false,
    message: null
  });

  let errorTimeout;

  return {
    subscribe: store.subscribe,
    showMessage(message, time = 3000) {
      clearTimeout(errorTimeout);

      store.set({
        isShowing: true,
        message
      });

      errorTimeout = setTimeout(() => {
        store.set({
          isShowing: false,
          message: null
        });
      }, time);
    }
  };
}

export const errorsStore = createErrorsStore();
