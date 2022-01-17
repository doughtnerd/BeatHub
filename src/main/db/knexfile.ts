import path from "path";
import {app} from 'electron';

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
		extension: "js",
		tableName: "beathub_migrations",
		directory: path.join(__dirname, "./", "migrations"),
	},
	seeds: {
		directory: path.join(__dirname, "./", "seeds", "dev"),
	}
};

export default dbConnectionConfig;