import { writable } from 'svelte/store';

export const networkIsOnline  = writable(window.navigator.onLine, () => {
  const handleOnline = () => networkIsOnline.set(true);
  const handleOffline = () => networkIsOnline.set(false);

  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);

  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  }
})