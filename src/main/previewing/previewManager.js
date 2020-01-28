const { ipcMain } = require("electron");
const {
  PREVIEW_BEATMAP,
  PREVIEW_LOADED,
  PREVIEW_ERROR
} = require("../../constants/channelNames");
const AdmZip = require("adm-zip");
const { download } = require("../utils");

function register(mainWindow) {
  const sendStatusToWindow = (channel, payload) => {
    mainWindow.webContents.send(channel, payload);
  };

  ipcMain.handle(PREVIEW_BEATMAP, (event, { beatmap }) => {
    download(
      `https://beatsaver.com${beatmap.directDownload}`,
      () => {},
      async buffer => {
        try {
          const zip = new AdmZip(buffer);
          const infoEntry = zip.getEntry("info.dat");
          const infoJSON = JSON.parse(zip.readAsText(infoEntry));

          const songFilename = infoJSON._songFilename;
          const audioFileEntry = zip.getEntry(songFilename);

          const audioBuffer = await new Promise((resolve, reject) => {
            audioFileEntry.getDataAsync(data => {
              resolve(data);
            });
          });
          sendStatusToWindow(PREVIEW_LOADED, { buffer: audioBuffer, beatmap });
        } catch (error) {
          sendStatusToWindow(PREVIEW_ERROR, { beatmap, error });
        }
      },
      error => {
        sendStatusToWindow(PREVIEW_ERROR, { beatmap, error });
      }
    );
  });
}

module.exports = { register };
