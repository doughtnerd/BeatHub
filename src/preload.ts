import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld("api", {
  send: (channel, data) => {
    let validChannels = ["downloadBeatmap", "previewBeatmap"];
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    } else {
      throw new Error("Invalid channel for send");
    }
  },
  invoke: (channel, args) => {
    let validChannels = [
      "changeBeatSaberDirectory",
      "restartAndUpdate",
      "getBeatSaberDirectory",
      "getAppVersion",
      "downloadBeatmap",
      "getCurrentTheme",
      "setCurrentTheme",
      "previewBeatmap",
      "loadLibrary",
      "deleteSong",
      "syncSongLibrary",
      "getAllSongs",
      "getUploaders",
      "getSongsByKey",
      "getSongByKey",
      "getSongsByUploader",
      "getArtists",
      "getSongsByArtist",
      "installMod"
    ];
    if (validChannels.includes(channel)) {
      return ipcRenderer.invoke(channel, args);
    } else {
      throw new Error("Invalid channel for invoke: " + channel);
    }
  },
  receive: (channel, func) => {
    let validChannels = [
      "downloadProgress",
      "downloadComplete",
      "downloadError",
      "updateDownloaded",
      "previewLoaded",
      "previewError"
    ];
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, (event, args) => func(args));
    } else {
      throw new Error("Invalid channel for receive");
    }
  }
});
