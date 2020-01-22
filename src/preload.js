const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  send: (channel, data) => {
    let validChannels = ["downloadBeatmap"];
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    } else {
      throw new Error("Invalid channel for send");
    }
  },
  invoke: (channel, args) => {
    let validChannels = [
      "changeDownloadDirectory",
      "restartAndUpdate",
      "getDownloadDirectory",
      "getAppVersion",
      "downloadBeatmap"
    ];
    if (validChannels.includes(channel)) {
      return ipcRenderer.invoke(channel, args);
    } else {
      throw new Error("Invalid channel for invoke");
    }
  },
  receive: (channel, func) => {
    let validChannels = [
      "downloadProgress",
      "downloadComplete",
      "updateDownloaded"
    ];
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, (event, args) => func(args));
    } else {
      throw new Error("Invalid channel for receive");
    }
  }
});
