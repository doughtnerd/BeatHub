const { ipcMain, dialog } = require("electron");
const { fork } = require("child_process");
const Store = require("electron-store");
const fs = require("fs");

const storage = new Store();

const {
  DOWNLOAD_ERROR,
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

function existsAsync(path) {
  return new Promise((resolve, reject) => {
    fs.exists(path, exists => {
      resolve(exists);
    });
  });
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

function openFolderBrowser(startingDirectory) {
  let options = {
    title: "Select Beat Saber install directory",
    defaultPath: startingDirectory,
    buttonLabel: "Choose folder",
    properties: ["openDirectory"]
  };

  return dialog.showOpenDialog(options);
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
    sendStatusToWindow(DOWNLOAD_ERROR, { error });
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

  ipcMain.handle(CHANGE_DOWNLOAD_DIRECTORY, async (event, eventData) => {
    const currentDirectory = await getDownloadDirectory();
    const selection = await openFolderBrowser(currentDirectory);

    if (!selection.canceled) {
      const newDir = selection.filePaths[0];
      storage.set(DOWNLOAD_DIRECTORY, newDir);
      return newDir;
    } else {
      return currentDirectory;
    }
  });

  ipcMain.handle(GET_DOWNLOAD_DIRECTORY, () => {
    return getDownloadDirectory();
  });
}

module.exports = { register };
