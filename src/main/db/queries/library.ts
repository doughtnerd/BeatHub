export function getAllSongs(knex) {
	return knex("library").select().orderBy("song_title");  
}

export function getSongByFolderHash(knex, hash) {
	return knex("library").select().where("folder_hash", hash).first();
}

export function getSongsByHash(knex, hashes) {
	return knex("library").select("folder_hash").whereIn("hash", hashes);
}

export function getSongsByKeys(knex, keys) {
	return knex("library").whereIn("key", keys);
}

export function getAllDiskLocations(knex) {
	return knex("library").select("disk_location").distinct();
}

export function getSongByHash(knex, hash) {
	return knex("library").where({folder_hash: hash}).first();
}

export function getSongsPage(knex, pageNumber, pageSize) {
	const offset = (pageNumber - 1) * pageSize;
	return knex("library").select().orderBy("added_at", "desc").offset(offset).limit(pageSize);
}

export function getSongsByUploader(knex, uploader) {
	return knex("library").select().where({uploader: uploader}).orderBy("song_title");
}

export function getSongsByAuthor(knex, author) {
	return knex("library").select().where({song_author: author}).orderBy("song_title");
}

export function getUploaders(knex) {
	return knex("library").select("uploader").distinct().orderBy("uploader");
}

export function getSongAuthors(knex) {
	return knex("library").select("song_author").distinct().orderBy("song_author");
}

export function getSongByKey(knex, key) {
	return knex("library").where({key}).first();
}

export function getSongByKeyAndName(knex, key, name) {
	return knex("library").where({key, song_title: name}).first();
}

export function insertSong(knex, song) {
	return knex("library").insert(song);
}

export function insertSongs(knex, songs) {
	return knex("library").insert(songs);
}

export function deleteSongByKeyAndName(knex, key, name) {
	return knex("library").where({key, song_title: name}).del();
}

export function deleteSongByFolderHash(knex, hash) {
	return knex("library").where({folder_hash: hash}).del();
}

export function deleteSongsByFilesLocations(knex, locations) {
	return knex("library").whereIn("disk_location", locations).del();
}

export function findSongByKeyAndName(knex, key, name) {
	return knex("library").where({key, song_title: name}).first();
}

export function querySongByText(knex, text) {
	return knex("library")
		.where("song_title", "like", `%${text}%`)
		.orWhere("song_author", "like", `%${text}%`)
		.orWhere("uploader", "like", `%${text}%`)
		.orWhere("key", "like", `%${text}%`);
}

// module.exports = {
//   getAllSongs,
//   getAllDiskLocations,
//   getSongsPage,
//   getSongByKey,
//   getSongsByHash,
//   getSongByFolderHash,
//   getSongsByKeys,
//   getSongByHash,
//   getSongByKeyAndName,
//   getSongsByUploader,
//   getSongsByAuthor,
//   getUploaders,
//   getSongAuthors,
//   insertSong,
//   insertSongs,
//   deleteSongByKeyAndName,
//   deleteSongsByFilesLocations,
//   deleteSongByFolderHash,
//   findSongByKeyAndName,
//   querySongByText,
// }