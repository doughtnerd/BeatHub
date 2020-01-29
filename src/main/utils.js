const request = require("request");

function download(url, onProgress, onEnd, onErr = () => {}) {
  const options = {
    url,
    encoding: null,
    headers: {
      Accept: "application/zip",
      "Accept-Charset": "utf-8",
      "User-Agent": "beathub-client"
    }
  };

  let totalBytes = 0;
  let bytesReceived = 0;

  const req = request.get(options, (err, resp, body) => {
    if (err) {
      onErr(err);
      return;
    }

    if (resp.statusCode !== 200) {
      onErr(new Error(`Status was ${resp.statusCode} for ${url}`));
      return;
    }

    onEnd(body);
  });

  req.on("response", data => {
    totalBytes = data.headers["content-length"];
  });

  req.on("data", chunk => {
    bytesReceived += chunk.length;
    onProgress(bytesReceived, totalBytes);
  });

  return req;
}

module.exports = { download };
