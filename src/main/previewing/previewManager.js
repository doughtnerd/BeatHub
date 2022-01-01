import { ipcMain } from "electron";
import { PREVIEW_BEATMAP, PREVIEW_LOADED, PREVIEW_ERROR } from "../../constants/channelNames";
import AdmZip from "adm-zip";
import { download } from "../utils";

// const { ipcMain } = require("electron");
// const { PREVIEW_BEATMAP, PREVIEW_LOADED, PREVIEW_ERROR } = require("../../constants/channelNames");
// const AdmZip = require("adm-zip");
// const { download } = require("../utils");

export function register(mainWindow) {
	const sendStatusToWindow = (channel, payload) => {
		mainWindow.webContents.send(channel, payload);
	};

	ipcMain.handle(PREVIEW_BEATMAP, (event, { beatmap }) => {
		download(
			beatmap.versions[0].downloadURL,
			() => {},
			async (buffer) => {
				try {
					const zip = new AdmZip(buffer);

					let infoEntry = zip.getEntry("info.dat");

					if (!infoEntry) {
						infoEntry = zip.getEntry("Info.dat");
					}

					if (!infoEntry) {
						sendStatusToWindow(PREVIEW_ERROR, { beatmap, error: new Error("Could not find info.dat file.") });
					}

					const infoJSON = JSON.parse(zip.readAsText(infoEntry));

					const songFilename = infoJSON._songFilename;

					const audioFileEntry = zip.getEntry(songFilename);

					const audioBuffer = await new Promise((resolve, reject) => {
						audioFileEntry.getDataAsync((data) => {
							resolve(data);
						});
					});
					sendStatusToWindow(PREVIEW_LOADED, { buffer: audioBuffer, beatmap });
				} catch (error) {
					console.log(error.message);
					sendStatusToWindow(PREVIEW_ERROR, { beatmap, error });
				}
			},
			(error) => {
				console.log(error.message);
				sendStatusToWindow(PREVIEW_ERROR, { beatmap, error });
			}
		);
	});
}

// module.exports = { register };
