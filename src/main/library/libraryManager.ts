
import {ipcMain} from "electron";
import {hashElement} from "folder-hash";
import { getDirectoryNames, getFileNames, getBeatSaberDirectory } from "../utils";
import { readFile, access, rm } from "fs/promises";
import { constants } from "fs";
import { insertSongs, getSongByHash, getUploaders, getSongsByUploader, getSongsByAuthor, getSongAuthors, getAllSongs, getSongByKey, getAllDiskLocations, deleteSongsByFilesLocations, getSongByFolderHash, deleteSongByFolderHash } from "../db/queries/library"
import * as path from "path";

// const { ipcMain } = require("electron");
// const { hashElement } = require("folder-hash");
// const { getDirectoryNames, getFileNames, getBeatSaberDirectory } = require("../utils");

// const { readFile, access, rm } = require("fs/promises");
// const { constants } = require("fs");

// const { insertSongs, getSongByHash, getUploaders, getSongsByUploader, getSongsByAuthor, getSongAuthors, getAllSongs, getSongByKey, getAllDiskLocations, deleteSongsByFilesLocations, getSongByFolderHash, deleteSongByFolderHash } = require("../db/queries/library");


async function generateEntry(directory) {
	const hash = await hashElement(directory, {algo: "md5"});
	return [hash.hash, directory];
}

async function genDirHashMap(rootDir) {
	const beatMapDirectories = await getDirectoryNames(rootDir);
	return Promise.all(beatMapDirectories.map(directory => generateEntry(directory)));
}

async function calcNewSongDirs(dbConnection, rootDir) {
	const entries = await genDirHashMap(rootDir);
	const newSongs = entries.filter(async ([hash, ]) => (await getSongByHash(dbConnection, hash)) == null);
	return newSongs;
}

async function scanForNewSongs(rootDir, dbConnection) {
	const newSongTuples = await calcNewSongDirs(dbConnection, rootDir);
	const dbEntries = await Promise.all(newSongTuples.map(async ([hash, directory]) => {
		const infoFilePath = (await getFileNames(directory)).find(fName => fName.includes("info.dat") || fName.includes("Info.dat"));
		const infoFileContents = await readFile(infoFilePath, {encoding: "utf8"});
		const infoFileJSON = JSON.parse(infoFileContents);
    
		const dbEntry = {
			folder_hash: hash,
			key: "",
			song_title: infoFileJSON._songName,
			song_author: infoFileJSON._songAuthorName,
			uploader: infoFileJSON._levelAuthorName,
			disk_location: directory,
			cover_filename: infoFileJSON._coverImageFilename,
			song_filename: infoFileJSON._songFilename,
			added_at: new Date().toISOString(),
		};
		return dbEntry;
	}));
	return insertSongs(dbConnection, dbEntries).onConflict("folder_hash").ignore();
}

async function deleteMissingSongs(dbConnection) {
	const allSongLocations = (await getAllDiskLocations(dbConnection)).map(entry => entry.disk_location);

	const missingSongs = (await Promise.all(allSongLocations.map(async (directory) => {
		try {
			await access(directory, constants.R_OK | constants.W_OK);
			return null;
		} catch(e) {
			return directory;
		}
	}))).filter(entry => entry != null);

	await deleteSongsByFilesLocations(dbConnection, missingSongs);
}

function deleteSong(dbConnection, folder_hash) {
	return getSongByFolderHash(dbConnection, folder_hash)
		.then(async song => {
			const diskLocation = song.disk_location;
			await rm(diskLocation, {recursive: true, force: true});
			return song;
		})
		.then(() => {
			return deleteSongByFolderHash(dbConnection, folder_hash);
		})
		.catch(err => {
			console.error(err);
		});
}

async function syncSongLibrary (dbConnection) {
	const rootDir = await getBeatSaberDirectory(dbConnection);
	const songDir = path.join(rootDir, "Beat Saber_Data", "CustomLevels");
	return Promise.all([
		scanForNewSongs(songDir, dbConnection),
		deleteMissingSongs(dbConnection)
	]);
}

export function register(mainWindow, dbConnection) {
	ipcMain.handle("syncSongLibrary", () => syncSongLibrary(dbConnection));

	ipcMain.handle("getUploaders", () => getUploaders(dbConnection));

	ipcMain.handle("getSongsByKey", (key) => getSongByKey(dbConnection, key));

	ipcMain.handle("getSongByKey", (event, {key}) => getSongByKey(dbConnection, key));

	ipcMain.handle("getAllSongs", () => getAllSongs(dbConnection));

	ipcMain.handle("getSongsByUploader", (event, {uploader}) => getSongsByUploader(dbConnection, uploader));

	ipcMain.handle("getArtists", (event) => getSongAuthors(dbConnection));

	ipcMain.handle("getSongsByArtist", (event, {artist}) => getSongsByAuthor(dbConnection, artist));

	ipcMain.handle("loadLibrary", () => getAllSongs(dbConnection));

	ipcMain.handle("deleteSong", async (event, {folder_hash}) => deleteSong(dbConnection, folder_hash));
}
