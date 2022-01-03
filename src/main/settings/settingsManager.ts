import {ipcMain, dialog} from "electron";
import {getSetting, setSetting, hasSetting} from "../db/queries/userSettings";
import { getBeatSaberDirectory } from "../utils";
import { CURRENT_THEME_NAME } from "../../constants/storageKeys";

function openFolderBrowser(startingDirectory) {
	return dialog.showOpenDialog(
		{
			title: "Select Beat Saber install directory",
			message: "Select the directory where Beat Saber is installed",
			defaultPath: startingDirectory,
			buttonLabel: "Choose folder",
			properties: ["openDirectory"]
		}
	);
}

async function changeBeatSaberDirectory(dbConnection) {
	const currentDirectory = await getBeatSaberDirectory(dbConnection);
	const selection = await openFolderBrowser(currentDirectory);

	if (!selection.canceled) {
		const newDir = selection.filePaths[0];
		await setSetting(dbConnection, "beatSaberDirectory", newDir);
		return newDir;
	} else {
		return currentDirectory;
	}
}

export async function register(mainWindow, dbConnection) {
	ipcMain.handle("hasSetting", (event, {settingKey}) => hasSetting(dbConnection, settingKey));

	ipcMain.handle("getSetting", (event, {settingKey}) => getSetting(dbConnection, settingKey));

	ipcMain.handle("setSetting", (event, {settingKey, settingValue}) => setSetting(dbConnection, settingKey, settingValue));

	ipcMain.handle("getCurrentTheme", () =>  getSetting(dbConnection, CURRENT_THEME_NAME));

	ipcMain.handle("setCurrentTheme", (event, { currentThemeName }) => setSetting(dbConnection, CURRENT_THEME_NAME, currentThemeName));
  
	ipcMain.handle("changeBeatSaberDirectory", () => changeBeatSaberDirectory(dbConnection));

	ipcMain.handle("getBeatSaberDirectory", () => getBeatSaberDirectory(dbConnection));
}
