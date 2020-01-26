const { ipcMain } = require("electron");

const Store = require("electron-store");

const storage = new Store();

const { fork } = require("child_process");

const {
  BEATMAP_DOWNLOAD_ERROR,
  DOWNLOAD_BEATMAP,
  CHANGE_DOWNLOAD_DIRECTORY,
  GET_DOWNLOAD_DIRECTORY
} = require("../../constants/channelNames");

const { DOWNLOAD_DIRECTORY } = require("../../constants/storageKeys");

const DEFAULT_WINDOWS_STEAM_LOCATION =
  "C:/Program Files (x86)/Steam/steamapps/common/Beat Saber";
const DEFAULT_WINDOWS_OCULUS_LOCATION =
  "C:/Program Files/Oculus/Software/Software/hyperbolic-magnetism-beat-saber";

function formatFolderName(beatmap) {
  const key = beatmap.key;
  const { songName, levelAuthorName } = beatmap.metadata;

  return `${key} (${songName.replace(
    /[\\/:*?"<>|.]/g,
    ""
  )} - ${levelAuthorName})`;
}

async function getDownloadDirectory() {
  const hasDownloadDirectory = storage.has(DOWNLOAD_DIRECTORY);

  if (hasDownloadDirectory) {
    return storage.get(DOWNLOAD_DIRECTORY);
  } else {
    if (await existsAsync(DEFAULT_WINDOWS_OCULUS_LOCATION)) {
      return DEFAULT_WINDOWS_OCULUS_LOCATION;
    } else if (await existsAsync(DEFAULT_WINDOWS_STEAM_LOCATION)) {
      return DEFAULT_WINDOWS_STEAM_LOCATION;
    }
    // TODO: Add in prompting for install location;
    return "";
  }
}
function register(mainWindow) {
  const sendStatusToWindow = (channel, payload) => {
    mainWindow.webContents.send(channel, payload);
  };

  const childProcess = fork(`${__dirname}/beatmap_downloader.js`);

  childProcess.on("close", () => {
    console.log(`Download manager child process quit...`);
  });
  childProcess.on("error", error => {
    sendStatusToWindow(BEATMAP_DOWNLOAD_ERROR, { error });
  });
  childProcess.on("message", message => {
    sendStatusToWindow(message.messageType, message);
  });

  ipcMain.handle(DOWNLOAD_BEATMAP, async (event, beatmap) => {
    //Get download folder location
    const downloadsFolder = await getDownloadDirectory();

    //Get beatmap folder name
    const songFolderName = formatFolderName(beatmap);

    //Download & extract to location
    childProcess.send({ beatmap, downloadsFolder, songFolderName });
  });

  ipcMain.on(CHANGE_DOWNLOAD_DIRECTORY, (event, newDirectory) => {
    storage.set(DOWNLOAD_DIRECTORY, newDirectory);
  });

  ipcMain.handle(GET_DOWNLOAD_DIRECTORY, () => {
    return getDownloadDirectory();
  });
}

module.exports = { register };
