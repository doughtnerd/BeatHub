const https = require("https");
const fs = require("fs");
const JSZip = require("jszip");

function download(url, onProgress, onEnd) {
  const request = https.get(url, res => {
    const totalBytes = parseInt(res.headers["content-length"]);

    const data = [];
    let bytesReceived = 0;

    res.on("data", function(chunk) {
      data.push(chunk);
      bytesReceived += chunk.length;
      onProgress(bytesReceived, totalBytes);
    });

    res.on("end", function() {
      const buffer = Buffer.concat(data);
      onEnd(buffer);
    });
  });

  return request;
}

async function extractBeatmap(buffer, rootFolder, songFolderName) {
  const zip = new JSZip();
  await zip.loadAsync(buffer);

  Object.keys(zip.files).forEach(async filename => {
    const content = await zip.file(filename).async("nodebuffer");
    const destFolder = `${rootFolder}/Beat Saber_Data/CustomLevels/${songFolderName}/`;

    if (!(await existsAsync(destFolder))) {
      await mkdirAsync(destFolder, { recursive: true });
    }

    const dest = destFolder + filename;

    await writeFileAsync(dest, content);
  });
}

function mkdirAsync(path, options) {
  return new Promise((resolve, reject) => {
    fs.mkdir(path, options, err => {
      if (err) {
        reject(err);
      }
      resolve(true);
    });
  });
}

function existsAsync(path) {
  return new Promise((resolve, reject) => {
    fs.exists(path, exists => {
      resolve(exists);
    });
  });
}

function writeFileAsync(dest, content) {
  return new Promise((resolve, reject) => {
    fs.writeFile(dest, content, err => {
      if (err) {
        reject(err);
      }
      resolve(true);
    });
  });
}

process.on("message", (message, sendHandle) => {
  const { beatmap, downloadsFolder, songFolderName } = message;

  download(
    `https://beatsaver.com` + beatmap.directDownload,
    (bytesReceived, totalBytes) => {
      process.send({
        messageType: "downloadProgress",
        beatmap,
        bytesReceived,
        totalBytes
      });
    },
    buffer => {
      extractBeatmap(buffer, downloadsFolder, songFolderName);
      process.send({ messageType: "downloadComplete", beatmap });
    }
  );
});
