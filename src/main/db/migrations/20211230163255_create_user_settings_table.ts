
export function up(knex) {
	return knex.schema.hasTable("user_settings").then(function(exists) {
		if (!exists) {
			return knex.schema.createTable("user_settings", function(table) {
				table.text("setting_key").primary();
				table.text("setting_value").notNull();
			});
		}
	});
}

export function down(knex) {
	return knex.schema.hasTable("user_settings").then(function(exists) {
		if (exists) {
			return knex.schema.dropTable("user_settings");
		}
	});
}
