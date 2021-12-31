import { readable, writable } from "svelte/store";
import {
  GET_CURRENT_THEME,
  SET_CURRENT_THEME
} from "../../constants/channelNames";

const availableThemes = {
  light: "light-theme.css",
  dark: "dark-theme.css"
};

function createThemeStore() {
  const store = writable({
    currentThemeName: "dark",
    currentThemeCss: "dark-theme.css"
  });

  window.api.invoke(GET_CURRENT_THEME).then((currentThemeName) => {
    if (currentThemeName) {
      store.set({
        currentThemeName,
        currentThemeCss: availableThemes[currentThemeName]
      });
    }
  });

  return {
    subscribe: store.subscribe,
    setTheme: currentThemeName => {
      if (!availableThemes.hasOwnProperty(currentThemeName)) {
        return;
      }
      store.set({
        currentThemeName,
        currentThemeCss: availableThemes[currentThemeName]
      });

      window.api.invoke(SET_CURRENT_THEME, { currentThemeName });
    }
  };
}

export const themeStore = createThemeStore();
export const availableThemesStore = readable(Object.keys(availableThemes));
