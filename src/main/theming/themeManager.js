const { ipcMain } = require("electron");
const {
  GET_CURRENT_THEME,
  SET_CURRENT_THEME
} = require("../../constants/channelNames");
const { CURRENT_THEME_NAME } = require("../../constants/storageKeys");

const Store = require("electron-store");

const storage = new Store();

function register(mainWindow) {
  ipcMain.handle(GET_CURRENT_THEME, () => {
    const currentThemeName = storage.get(CURRENT_THEME_NAME, null);
    return { currentThemeName };
  });

  ipcMain.handle(SET_CURRENT_THEME, (event, { currentThemeName }) => {
    storage.set(CURRENT_THEME_NAME, currentThemeName);
  });
}

module.exports = { register };
