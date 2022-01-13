import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  return knex.schema.hasTable('installed_mods').then(exists => {
    if (!exists) {
      return knex.schema.createTable('installed_mods', table => {
        table.string('id').primary();
        table.string('name').notNullable();
        table.string('description').notNullable();
        table.string('category').notNullable();
        table.string('version').notNullable();
        table.string('game_version').notNullable();
        table.string('updated_date').notNullable();
        table.string('disk_location').notNullable();
        table.string('files').notNullable();
        table.boolean('enabled').notNullable();
      });
    }
  });
}


export async function down(knex: Knex): Promise<void> {
  return knex.schema.hasTable('installed_mods').then(exists => {
    if (exists) {
      return knex.schema.dropTable('installed_mods');
    }
  });
}

