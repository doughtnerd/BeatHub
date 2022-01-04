import {Knex} from 'knex';
import {join} from 'path'

const dbConnectionConfig = {
	client: "sqlite",
	connection: {
		filename: "./beathubdb.sqlite"
	},
	migrations: {
		extension: "ts",
		tableName: "beathub_migrations",
		directory: join(__dirname, "./", "migrations"),
	},
	seeds: {
		directory: join(__dirname, "./", "seeds", "dev"),
	}
};

export default dbConnectionConfig;