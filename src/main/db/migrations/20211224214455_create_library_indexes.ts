export function up(knex) {
	return knex.table("library", (table) => {
		table.index("key", "library_key_index"),
		table.index("song_title", "library_song_title_index"),
		table.index("song_author", "library_song_author_index"),
		table.index("uploader", "library_uploader_index");
	});
}

export function down(knex) {
	return knex.table("library", (table) => {
		table.dropIndex("library_key_index"),
		table.dropIndex("library_song_title_index"),
		table.dropIndex("library_song_author_index"),
		table.dropIndex("library_uploader_index");
	});
}
