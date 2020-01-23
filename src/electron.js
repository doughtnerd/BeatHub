const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const log = require("electron-log");
const autoUpdater = require("./main/autoUpdate");
const downloadManager = require("./main/downloadManager");
const url = require("url");

let mainWindow;

ipcMain.handle("getAppVersion", () => {
  return app.getVersion();
});

function createWindow() {
  const mode = process.env.NODE_ENV;
  mainWindow = new BrowserWindow({
    width: 900,
    height: 680,
    frame: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      enableRemoteModule: false,
      allowRunningInsecureContent: false,
      preload: path.join(__dirname, "preload.js")
    }
  });

  mainWindow.setMenu(null);

  let watcher;
  if (mode == "development") {
    watcher = require("chokidar").watch(
      path.join(__dirname, "..", "public", "bundle.js"),
      { ignoreInitial: true }
    );
    watcher.on("change", () => {
      mainWindow.reload();
    });
  }

  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "..", "public", "index.html"),
      protocol: "file:",
      slashes: true
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

app.on("ready", () => {
  const mainWindow = createWindow();

  downloadManager.register(mainWindow);

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
