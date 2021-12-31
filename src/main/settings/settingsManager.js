const { ipcMain, dialog } = require("electron");
const { CURRENT_THEME_NAME } = require("../../constants/storageKeys");
const { hasSetting, getSetting, setSetting } = require("../db/queries/userSettings")

const { getBeatSaberDirectory } = require("../utils");

function openFolderBrowser(startingDirectory) {
  let options = {
    title: "Select Beat Saber install directory",
    defaultPath: startingDirectory,
    buttonLabel: "Choose folder",
    properties: ["openDirectory"]
  };

  return dialog.showOpenDialog(options);
}

async function changeBeatSaberDirectory(dbConnection) {
  const currentDirectory = await getBeatSaberDirectory(dbConnection);
  const selection = await openFolderBrowser(currentDirectory);

  if (!selection.canceled) {
    const newDir = selection.filePaths[0];
    await setSetting(dbConnection, 'beatSaberDirectory', newDir);
    return newDir;
  } else {
    return currentDirectory;
  }
}

function register(mainWindow, dbConnection) {
  ipcMain.handle('hasSetting', (event, {settingKey}) => hasSetting(dbConnection, settingKey))

  ipcMain.handle('getSetting', (event, {settingKey}) => getSetting(dbConnection, settingKey))

  ipcMain.handle('setSetting', (event, {settingKey, settingValue}) => setSetting(dbConnection, settingKey, settingValue))

  ipcMain.handle('getCurrentTheme', () =>  getSetting(dbConnection, CURRENT_THEME_NAME));

  ipcMain.handle('setCurrentTheme', (event, { currentThemeName }) => setSetting(dbConnection, CURRENT_THEME_NAME, currentThemeName));
  
  ipcMain.handle('changeBeatSaberDirectory', () => changeBeatSaberDirectory(dbConnection));

  ipcMain.handle("getBeatSaberDirectory", () => getBeatSaberDirectory(dbConnection));
}

module.exports = {
  register
}