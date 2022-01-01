
export function up(knex) {
	return knex.schema.createTable("library", table => {
		table.text("folder_hash").notNullable().primary();
		table.text("key").notNullable();
		table.text("song_title").notNullable();
		table.text("song_author").notNullable();
		table.text("uploader").notNullable();
		table.text("disk_location").notNullable();
		table.text("cover_filename").notNullable();
		table.text("song_filename").notNullable();
		table.text("added_at").notNullable();
	});
}

export function down(knex) {
	return knex.schema.hasTable("library").then(exists => {
		if (exists) {
			return knex.schema.dropTable("library");
		}
	});
}
