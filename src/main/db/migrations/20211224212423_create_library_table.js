
exports.up = function(knex) {
  return knex.raw(`
    CREATE TABLE IF NOT EXISTS library (
      folder_hash TEXT PRIMARY KEY,
      key TEXT NOT NULL,
      song_title TEXT NOT NULL,
      song_author TEXT NOT NULL,
      uploader TEXT NOT NULL,
      disk_location TEXT NOT NULL,
      cover_filename TEXT NOT NULL,
      song_filename TEXT NOT NULL,
      added_at TEXT NOT NULL
    );
  `)
};

exports.down = function(knex) {
  return knex.raw(`
    DROP TABLE IF EXISTS library;
  `);
};
