const { app, BrowserWindow, ipcMain, session } = require("electron");

const { hashElement } = require('folder-hash');
const { getDirectoryNames, getFileNames } = require("../utils");

const { readFile } = require('fs/promises');

const { insertSongs, getSongByHash, getUploaders, getSongsByUploader, getSongsByAuthor, getSongAuthors, getAllSongs } = require("../db/queries/library");

async function generateEntry(directory) {
  const hash = await hashElement(directory)
  return [hash.hash, directory]
}

async function genDirHashMap(rootDir) {
  const beatMapDirectories = await getDirectoryNames(rootDir)
  return Promise.all(beatMapDirectories.map(directory => generateEntry(directory)))
}

async function calcNewSongDirs(dbConnection, rootDir) {
  const entries = await genDirHashMap(rootDir)
  const newSongs = entries.filter(async ([hash, ]) => (await getSongByHash(dbConnection, hash)) == null)
  return newSongs
}

async function handleScanForSongs(rootDir, dbConnection) {
  const newSongTuples = await calcNewSongDirs(dbConnection, rootDir)
  const dbEntries = await Promise.all(newSongTuples.map(async ([hash, directory]) => {
    const infoFilePath = (await getFileNames(directory)).find(fName => fName.includes('info.dat') || fName.includes('Info.dat'))
    const infoFileContents = await readFile(infoFilePath, {encoding: 'utf8'})
    const infoFileJSON = JSON.parse(infoFileContents)
    const dbEntry = {
      folder_hash: hash,
      key: '',
      song_title: infoFileJSON._songName,
      song_author: infoFileJSON._songAuthorName,
      uploader: infoFileJSON._levelAuthorName,
      disk_location: directory,
      cover_filename: infoFileJSON._coverImageFilename,
      song_filename: infoFileJSON._songFilename,
      added_at: new Date().toISOString(),
    }
    return dbEntry
  }))
  return insertSongs(dbConnection, dbEntries).onConflict().ignore()
}


function register(mainWindow, dbConnection) {
  ipcMain.handle('scanForSongs', (rootDir) => handleScanForSongs("/Users/ccarlson/Desktop/Beatsaber/Beat Saber_data/CustomLevels", dbConnection))

  ipcMain.handle('getUploaders', (author) => getUploaders(dbConnection, author))

  ipcMain.handle('getAllSongs', () => getAllSongs(dbConnection))

  ipcMain.handle('getSongsByUploader', (event, {uploader}) => getSongsByUploader(dbConnection, uploader))

  ipcMain.handle('getArtists', (event) => getSongAuthors(dbConnection))

  ipcMain.handle('getSongsByArtist', (event, {artist}) => getSongsByAuthor(dbConnection, artist))
}

module.exports = {
  register
}