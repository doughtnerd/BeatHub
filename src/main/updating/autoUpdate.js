import log from "electron-log";
import { autoUpdater } from "electron-updater";
import { ipcMain } from "electron";


export function register(mainWindow) {
	autoUpdater.logger = log;
	autoUpdater.logger.transports.file.level = "info";

	const sendStatusToWindow = (channel, text) => {
		log.info(`${channel}: ${text}`);

		mainWindow.webContents.send(channel, text);
	};

	autoUpdater.on("checking-for-update", () => {
		sendStatusToWindow("checkingForUpdate", "Checking for update...");
	});

	autoUpdater.on("update-available", info => {
		sendStatusToWindow("updateAvailable", "Update available.");
	});

	autoUpdater.on("update-not-available", info => {
		sendStatusToWindow("updateNotAvailable", "Update not available.");
	});

	autoUpdater.on("error", err => {
		sendStatusToWindow("updateError", "Error in auto-updater. " + err);
	});

	autoUpdater.on("download-progress", progressObj => {
		let log_message = "Download speed: " + progressObj.bytesPerSecond;
		log_message = log_message + " - Downloaded " + progressObj.percent + "%";
		log_message =
      log_message +
      " (" +
      progressObj.transferred +
      "/" +
      progressObj.total +
      ")";
		sendStatusToWindow("updateProgress", log_message);
	});

	autoUpdater.on("update-downloaded", info => {
		sendStatusToWindow("updateDownloaded", "Update downloaded");
	});

	ipcMain.handle("restartAndUpdate", () => {
		autoUpdater.quitAndInstall(true, true);
	});

	return autoUpdater;
}
