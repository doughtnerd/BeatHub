import { Knex } from 'knex';

export function getAllSongs(knex: Knex) {
	return knex("library").select().orderBy("song_title");  
}

export function getSongByFolderHash(knex: Knex, hash) {
	return knex("library").select().where("folder_hash", hash).first();
}

export function getSongsByHash(knex: Knex, hashes) {
	return knex("library").select("folder_hash").whereIn("hash", hashes);
}

export function getSongsByKeys(knex: Knex, keys) {
	return knex("library").whereIn("key", keys);
}

export function getAllDiskLocations(knex: Knex) {
	return knex("library").select("disk_location").distinct();
}

export function getSongByHash(knex: Knex, hash) {
	return knex("library").where({folder_hash: hash}).first();
}

export function getSongsPage(knex: Knex, pageNumber, pageSize) {
	const offset = (pageNumber - 1) * pageSize;
	return knex("library").select().orderBy("added_at", "desc").offset(offset).limit(pageSize);
}

export function getSongsByUploader(knex: Knex, uploader) {
	return knex("library").select().where({uploader: uploader}).orderBy("song_title");
}

export function getSongsByAuthor(knex: Knex, author) {
	return knex("library").select().where({song_author: author}).orderBy("song_title");
}

export function getUploaders(knex: Knex) {
	return knex("library").select("uploader").distinct().orderBy("uploader");
}

export function getSongAuthors(knex: Knex) {
	return knex("library").select("song_author").distinct().orderBy("song_author");
}

export function getSongByKey(knex: Knex, key) {
	return knex("library").where({key}).first();
}

export function getSongByKeyAndName(knex: Knex, key, name) {
	return knex("library").where({key, song_title: name}).first();
}

export function insertSong(knex: Knex, song) {
	return knex("library").insert(song);
}

export function insertSongs(knex: Knex, songs) {
	return knex("library").insert(songs);
}

export function deleteSongByKeyAndName(knex: Knex, key, name) {
	return knex("library").where({key, song_title: name}).del();
}

export function deleteSongByFolderHash(knex: Knex, hash) {
	return knex("library").where({folder_hash: hash}).del();
}

export function deleteSongsByFilesLocations(knex: Knex, locations) {
	return knex("library").whereIn("disk_location", locations).del();
}

export function findSongByKeyAndName(knex: Knex, key, name) {
	return knex("library").where({key, song_title: name}).first();
}

export function querySongByText(knex: Knex, text) {
	return knex("library")
		.where("song_title", "like", `%${text}%`)
		.orWhere("song_author", "like", `%${text}%`)
		.orWhere("uploader", "like", `%${text}%`)
		.orWhere("key", "like", `%${text}%`);
}

export function insertAllSongsWithTransaction(knex: Knex, songs) {
	return knex.transaction(trx => {
		const inserts = songs.map(e => {
			return knex('library').transacting(trx).insert(e).onConflict("folder_hash").ignore()
		})

		return Promise.all(inserts).then(() => trx.commit()).catch(err => trx.rollback());
	})
}
