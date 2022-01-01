import fs from "fs";
import { readdir } from "fs/promises";
import path from "path";
import request from "request";
import { sanitize } from "sanitize-filename";
import { getSetting } from "./db/queries/userSettings";

// const request = require("request");
// const {readdir, readFile} = require('fs/promises');
// const fs = require('fs')
// const { getSetting } = require('./db/queries/userSettings');
// const path = require('path');

// const sanitize = require("sanitize-filename");

const DEFAULT_WINDOWS_STEAM_LOCATION =
  "C:/Program Files (x86)/Steam/steamapps/common/Beat Saber";
const DEFAULT_WINDOWS_OCULUS_LOCATION =
  "C:/Program Files/Oculus/Software/Software/hyperbolic-magnetism-beat-saber";

export function download(url, onProgress, onEnd, onErr = () => {}) {
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

export function formatFolderName(key, songName, levelAuthorName) {
	const formattedFolderName = `${key} (${songName} - ${levelAuthorName})`;
	return sanitize(formattedFolderName);
}

export async function getDirectoryNames (source) {
	return (await readdir(source, { withFileTypes: true }))
		.filter(direct => direct.isDirectory())
		.map(direct => path.join(source, direct.name));
}

export async function getFileNames (source) {
	const dirs = await readdir(source, {withFileTypes: true});
	return dirs.filter(direct => direct.isFile())
		.map(direct => path.join(source, direct.name));
}



export function existsAsync(path) {
	return new Promise((resolve, reject) => {
		fs.exists(path, exists => {
			resolve(exists);
		});
	});
}

export async function getBeatSaberDirectory(dbConnection) {
	const beatSaberDirectory = await getSetting(dbConnection, "beatSaberDirectory");

	if (beatSaberDirectory) {
		return beatSaberDirectory;
	} else {
		if (await existsAsync(DEFAULT_WINDOWS_OCULUS_LOCATION)) {
			return DEFAULT_WINDOWS_OCULUS_LOCATION;
		} else if (await existsAsync(DEFAULT_WINDOWS_STEAM_LOCATION)) {
			return DEFAULT_WINDOWS_STEAM_LOCATION;
		}
		return "";
	}
}
    