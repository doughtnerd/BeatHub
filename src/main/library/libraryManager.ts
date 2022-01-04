
import {ipcMain} from "electron";
import {hashElement} from "folder-hash";
import { getDirectoryNames, getFileNames, getBeatSaberDirectory } from "../utils";
import { readFile, access, rm } from "fs/promises";
import { constants } from "fs";
import { insertSongs, getSongByHash, getUploaders, getSongsByUploader, getSongsByAuthor, getSongAuthors, getAllSongs, getSongByKey, getAllDiskLocations, deleteSongsByFilesLocations, getSongByFolderHash, deleteSongByFolderHash, insertSong, insertAllSongsWithTransaction } from "../db/queries/library"
import * as path from "path";
import { Knex } from "knex";

type Nothing = null;
type Maybe<T> = T | Nothing

async function generateEntry(directory): Promise<[string, string]> {
	const hash = await hashElement(directory, {algo: "md5"});
	return [hash.hash, directory];
}

async function genDirHashMap(rootDir): Promise<Array<[string, string]>> {
	const beatMapDirectories = await getDirectoryNames(rootDir);
	return Promise.all(beatMapDirectories.map(directory => generateEntry(directory)));
}

async function calcNewSongDirs(dbConnection, rootDir): Promise<Array<[string, string]>> {
	const entries: Array<[string, string]>= await genDirHashMap(rootDir);
	const newSongs = entries.filter(async ([hash, ]) => (await getSongByHash(dbConnection, hash)) == null);
	return newSongs;
}

async function mapInfoFilePaths(data: [string, string][]): Promise<[string, string, Maybe<string>][]> {
	const result: [string, string, Maybe<string>][] = [];
	for (const [hash, directory] of data) {
		const infoFilePath = (await getFileNames(directory)).find(fName => fName.includes("info.dat") || fName.includes("Info.dat"));
		if(infoFilePath) {
			result.push([hash, directory, infoFilePath]);
		}
		else {
			result.push([hash, directory, null]);
		}
	}
	return result;
}

async function mapToDbEntries(data: [string, string, Maybe<string>][]): Promise<Maybe<any>[]> {
	const mapped = data.map(async ([hash, directory, maybeInfoFilePath]) => {
		if(maybeInfoFilePath === null) {
			console.error('Failed to load info data for song: ' + directory);
			return null;
		} else {
			const infoFileContents = await readFile(maybeInfoFilePath, {encoding: "utf8"});
			const infoFileJSON = JSON.parse(infoFileContents);
			return {
				folder_hash: hash,
				key: "",
				song_title: infoFileJSON._songName || "Unknown",
				song_author: infoFileJSON._songAuthorName || "Unknown",
				uploader: infoFileJSON._levelAuthorName || "Unknown",
				disk_location: directory,
				cover_filename: infoFileJSON._coverImageFilename,
				song_filename: infoFileJSON._songFilename,
				added_at: new Date().toISOString(),
			};
		}	
	})

	return Promise.all(mapped);
}



async function scanForNewSongs(rootDir, dbConnection) {
	const newSongTuples: Array<[string, string]> = await calcNewSongDirs(dbConnection, rootDir);
	const infoFiles: [string, string, Maybe<string>][] = await mapInfoFilePaths(newSongTuples);
	const dbEntries: Maybe<any>[] = await mapToDbEntries(infoFiles);
	const filtereEntries = dbEntries.filter(e => e !== null);
	return insertAllSongsWithTransaction(dbConnection, filtereEntries);
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
