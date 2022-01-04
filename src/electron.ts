import { app, BrowserWindow, ipcMain, session } from "electron";
import path from "path";
import * as downloadManager from "./main/downloading/downloadManager";
import * as libraryManager from "./main/library/libraryManager";
import * as previewManager from "./main/previewing/previewManager";
import * as settingsManager from "./main/settings/settingsManager";
import * as modManager from './main/mods/modManager'
import * as autoUpdater from './main/updating/autoUpdate'
import url from 'url';

import dbConnectionConfig from "./main/db/knexfile";
import { connectDB } from "./main/db/connect"

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
      // enableRemoteModule: false,
      allowRunningInsecureContent: false,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  mainWindow.setMenu(null);

  let watcher;
  if (mode == "development") {
    mainWindow.openDevTools();
    watcher = require("chokidar").watch([path.join(__dirname, "..", "bundle.js"), path.join(__dirname)], { ignoreInitial: true });
    watcher.on("change", () => {
      mainWindow.reload();
    });
  }

  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "..", "index.html"),
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
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        "Content-Security-Policy": [
          "default-src 'self'", 
          "script-src 'self' 'unsafe-inline' https://kit.fontawesome.com https://skystudioapps.com", 
          "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com", 
          "connect-src 'self' https://na.cdn.beatsaver.com https://beatsaver.com https://api.beatsaver.com https://ka-f.fontawesome.com https://beatmods.com", //may need to add data: 
          "img-src 'self'  https://na.cdn.beatsaver.com blob: skystudioapps.com data:",
          "media-src 'self' file: blob: skystudioapps.com data:",
          "font-src 'self' https://fonts.gstatic.com https://fonts.googleapis.com https://ka-f.fontawesome.com",
          "frame-src 'self' https://skystudioapps.com"
        ].join("; "),
      }
    })
  })

  session
    .defaultSession
    .setPermissionRequestHandler((webContents, permission, callback) => {
      callback(false)
    })

  const dbConnection = await connectDB(dbConnectionConfig)

  const mainWindow = createWindow();

  downloadManager.register(mainWindow, dbConnection);
  previewManager.register(mainWindow);
  libraryManager.register(mainWindow, dbConnection);
  settingsManager.register(mainWindow, dbConnection);
  modManager.register(dbConnection)

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
