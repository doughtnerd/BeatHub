import { writable } from "svelte/store";

function createErrorsStore() {
  const store = writable("");

  let errorTimeout;

  return {
    subscribe: store.subscribe,
    showMessage(message, time = 3000) {
      clearTimeout(errorTimeout);

      store.set(message);

      errorTimeout = setTimeout(() => {
        store.set('');
      }, time);
    }
  };
}

export const errorsStore = createErrorsStore();