const Knex = require('knex');
const path = require('path');
// require('electron').app.getPath('userData')
const dbConnectionConfig = {
  client: "sqlite",
  connection: {
    filename: './beathubdb.sqlite'
  },
  migrations: {
    extension: 'js',
    tableName: 'beathub_migrations',
    directory: path.join(__dirname, "./", "migrations"),
  },
  seeds: {
    directory: path.join(__dirname, "./", "seeds", "dev"),
  }
}
module.exports = dbConnectionConfig