import path from "path";

const dbConnectionConfig = {
	client: "sqlite",
	connection: {
		filename: "./beathubdb.sqlite"
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