const { app, BrowserWindow, Menu, protocol, ipcMain } = require("electron");
const path = require("path");
const log = require("electron-log");
const autoUpdater = require("./main/autoUpdate").register();

let mainWindow;

log.info("App starting...");

function createWindow() {
  const mode = process.env.NODE_ENV;
  mainWindow = new BrowserWindow({
    width: 900,
    height: 680,
    frame: true,
    webPreferences: {
      nodeIntegration: true
    }
  });

  mainWindow.setMenu(null);

  let watcher;
  console.log(mode, mode == "development")
  if (mode == "development") {
    watcher = require("chokidar").watch(
      path.join(__dirname, "../public/bundle.js"),
      { ignoreInitial: true }
    );
    watcher.on("change", () => {
      mainWindow.reload();
    });
  }

  mainWindow.loadURL(`file://${path.join(__dirname, "../public/index.html")}`);
  mainWindow.on("closed", () => {
    if (watcher) {
      watcher.close();
    }
    mainWindow = null;
  });
}

app.on("ready", () => {
  createWindow();
  autoUpdater.checkForUpdatesAndNotify();
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
