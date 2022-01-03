import {writable} from 'svelte/store';

function createSettingsStore() {
  const store = writable({
    appVersion: '',
    beatSaberDirectory: ''
  })

  window.api.invoke('getBeatSaberDirectory').then(async dir => {
    if(!dir) {
      dir = await window.api.invoke('changeBeatSaberDirectory')
    }

    store.update(current => ({
      ...current,
      beatSaberDirectory: dir
    }));
  });

  window.api.invoke("getAppVersion").then(version => {
    store.update(current => {
      return {
        ...current,
        appVersion: version
      }
    });
  });

  async function changeBeatSaberDirectory() {
    const newDirectory = await window.api.invoke('changeBeatSaberDirectory');
    store.update(current => ({
      ...current,
      beatSaberDirectory: newDirectory
    }));
  }

  return {
    subscribe: store.subscribe,
    changeBeatSaberDirectory
  }
}

export const settingsStore = createSettingsStore()


