const { app, BrowserWindow, ipcMain, session } = require("electron");
const path = require("path");
const log = require("electron-log");
const autoUpdater = require("./main/updating/autoUpdate");
const downloadManager = require("./main/downloading/downloadManager");
const themeManager = require("./main/theming/themeManager");
const libraryManager = require('./main/library/libraryManager');
const previewManager = require("./main/previewing/previewManager");
const url = require("url");
const {readdir, readFile, unlink, rmdir, rm} = require('fs/promises');

const dbConnectionConfig = require('./main/db/knexfile')
const { connectDB } = require("./main/db/connect");
const { getFileNames, getDirectoryNames } = require("./main/utils");
const { insertSongs, getAllSongs, deleteSongByKeyAndName, getSongByKeyAndName } = require("./main/db/queries/library");

let mainWindow;

ipcMain.handle("getAppVersion", () => {
  return app.getVersion();
});

function createWindow() {
  const mode = process.env.NODE_ENV;
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 720,
    frame: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      enableRemoteModule: false,
      allowRunningInsecureContent: false,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  mainWindow.setMenu(null);

  let watcher;
  if (mode == "development") {
    mainWindow.openDevTools();
    watcher = require("chokidar").watch([path.join(__dirname, "..", "public", "bundle.js"), path.join(__dirname)], { ignoreInitial: true });
    watcher.on("change", () => {
      mainWindow.reload();
    });
  }

  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "..", "public", "index.html"),
      protocol: "file:",
      slashes: true,
    })
  );
  mainWindow.on("closed", () => {
    if (watcher) {
      watcher.close();
    }
    mainWindow = null;
  });

  return mainWindow;
}



app.on("ready", async () => {
  // session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
  //   callback({
  //     responseHeaders: Object.assign(
  //       {
  //         "Content-Security-Policy": ["default-src 'self'"],
  //       },
  //       details.responseHeaders
  //     ),
  //   });
  // });

  const dbConnection = await connectDB(dbConnectionConfig)

  ipcMain.handle('loadLibrary', () => {
    return getAllSongs(dbConnection)
  })

  ipcMain.handle('deleteSong', async (event, {key, name}) => {
    return getSongByKeyAndName(dbConnection, key, name)
    .then(async song => {
      const diskLocation = song.disk_location;
      await rm(diskLocation, {recursive: true, force: true})
      return song
    })
    .then(() => {
      return deleteSongByKeyAndName(dbConnection, key, name)
    })
    .catch(err => {
      log.error(err)
    })
    
  })

  const mainWindow = createWindow();

  downloadManager.register(mainWindow);
  themeManager.register(mainWindow);
  previewManager.register(mainWindow);
  libraryManager.register(mainWindow, dbConnection);

  const updater = autoUpdater.register(mainWindow);
  updater.checkForUpdatesAndNotify();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});
