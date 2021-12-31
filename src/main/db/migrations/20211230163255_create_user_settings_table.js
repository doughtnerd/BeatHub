
exports.up = function(knex) {
  return knex.schema.hasTable('user_settings').then(function(exists) {
    if (!exists) {
      return knex.schema.createTable('user_settings', function(table) {
        table.text('setting_key').primary();
        table.text('setting_value').notNull();
      });
    }
  })
};

exports.down = function(knex) {
  return knex.schema.hasTable('user_settings').then(function(exists) {
    if (exists) {
      return knex.schema.dropTable('user_settings');
    }
  })
};
