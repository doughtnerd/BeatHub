import { app } from 'electron';
import path, { join } from "path";

const userDataPath = app.getPath('userData');
console.log(userDataPath)

const sqliteDBPath = process.env.NODE_ENV === 'development' ? 
	path.join(__dirname, 'beathubdb.sqlite') : 
	path.join(userDataPath, 'beathubdb.sqlite');

const dbConnectionConfig = {
	client: "sqlite",
	connection: {
		filename: sqliteDBPath
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