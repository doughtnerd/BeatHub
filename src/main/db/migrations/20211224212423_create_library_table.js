
exports.up = function(knex) {
  return knex.raw(`
    CREATE TABLE IF NOT EXISTS library (
      key TEXT NOT NULL,
      song_title TEXT NOT NULL,
      song_author TEXT NOT NULL,
      uploader TEXT NOT NULL,
      disk_location TEXT NOT NULL,
      downloaded_at TEXT NOT NULL
    );
  `)
};

exports.down = function(knex) {
  return knex.raw(`
    DROP TABLE IF EXISTS library;
  `);
};
