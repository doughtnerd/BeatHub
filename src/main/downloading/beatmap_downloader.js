const AdmZip = require("adm-zip");

const { download } = require("../utils");

const {
  DOWNLOAD_COMPLETE,
  DOWNLOAD_PROGRESS,
  DOWNLOAD_ERROR
} = require("../../constants/channelNames");

async function extractBeatmap(buffer, rootFolder, songFolderName) {
  const zip = new AdmZip(buffer);
  zip.extractAllTo(
    `${rootFolder}/Beat Saber_Data/CustomLevels/${songFolderName}`,
    true
  );
}

process.on("message", (message, sendHandle) => {
  const { beatmap, downloadsFolder, songFolderName } = message;

  download(
    `https://beatsaver.com${beatmap.directDownload}`,
    (bytesReceived, totalBytes) => {
      process.send({
        messageType: DOWNLOAD_PROGRESS,
        beatmap,
        bytesReceived,
        totalBytes
      });
    },
    buffer => {
      extractBeatmap(buffer, downloadsFolder, songFolderName);
      process.send({ messageType: DOWNLOAD_COMPLETE, beatmap });
    },
    error => {
      console.error(error);
      process.send({ messageType: DOWNLOAD_ERROR, beatmap, error });
    }
  );
});
