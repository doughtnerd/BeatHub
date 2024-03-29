import { ipcMain } from "electron";
import { fork } from "child_process";
import { hashElement } from "folder-hash";
import { getFileNames, getBeatSaberDirectory, formatFolderName } from "../utils";
import { insertSong } from "../db/queries/library";
import path from "path";
import {readFile} from 'fs/promises'


export function register(mainWindow, dbConnection) {
	const sendStatusToWindow = (channel, payload) => {
		mainWindow.webContents.send(channel, payload);
	};

	const childProcess = fork(`${__dirname}/beatmap_downloader.js`);

	childProcess.on("close", () => {
		console.log("Download manager child process quit...");
	});
	childProcess.on("error", error => {
		sendStatusToWindow("downloadError", { error });
	});
	childProcess.on("message", async (message: any) => {
		if(message.messageType === "downloadComplete") {
			const {beatmap} = message;
			//Get download folder location
			const downloadsFolder = await getBeatSaberDirectory(dbConnection);

			//Get beatmap folder name
			const songFolderName = formatFolderName(beatmap.id, beatmap.metadata.songName, beatmap.metadata.songAuthorName);

			const directory = path.join(downloadsFolder, "Beat Saber_Data", "CustomLevels", songFolderName);
			const hash = await hashElement(directory, {algo: "md5"});

			const infoFilePath = (await getFileNames(directory)).find(fName => fName.includes("info.dat") || fName.includes("Info.dat"));
			const infoFileContents = await readFile(infoFilePath, {encoding: "utf8"});
			const infoFileJSON = JSON.parse(infoFileContents);
      
			const songData = {
				key: beatmap.id,
				folder_hash: hash.hash,
				song_title: infoFileJSON._songName || "Unknown",
				song_author: infoFileJSON._songAuthorName || "Unknown",
				uploader: infoFileJSON._levelAuthorName || "Unknown",
				disk_location: directory,
				cover_filename: infoFileJSON._coverImageFilename,
				song_filename: infoFileJSON._songFilename,
				added_at: new Date().toISOString(),
			};
			await insertSong(dbConnection, songData).onConflict("folder_hash").merge();
		}

		sendStatusToWindow(message.messageType, message);
	});

	ipcMain.handle("downloadBeatmap", async (event, beatmap) => {
		//Get download folder location
		const downloadsFolder = await getBeatSaberDirectory(dbConnection);

		//Get beatmap folder name
		const songFolderName = formatFolderName(beatmap.id, beatmap.metadata.songName, beatmap.metadata.songAuthorName);

		//Download & extract to location
		childProcess.send({ beatmap, downloadsFolder, songFolderName });
	});
}

// module.exports = { register };
