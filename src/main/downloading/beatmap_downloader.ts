import AdmZip from "adm-zip";
import { download } from "../utils";
import {
	DOWNLOAD_COMPLETE,
	DOWNLOAD_PROGRESS,
	DOWNLOAD_ERROR
} from "../../constants/channelNames";

async function extractBeatmap(buffer, rootFolder, songFolderName) {
	const zip = new AdmZip(buffer);
	zip.extractAllTo(
		`${rootFolder}/Beat Saber_Data/CustomLevels/${songFolderName}`,
		true
	);
}

process.on("message", (message: any, sendHandle) => {
	const { beatmap, downloadsFolder, songFolderName } = message;

	download(
		beatmap.versions[0].downloadURL,
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
