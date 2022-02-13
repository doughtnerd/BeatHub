import { app } from "electron";
import * as fs from 'fs/promises';
import { knex } from "knex";
import path from 'path';


/** 
 * @description This function is explicitly for copying the sqlite file from the app directory to the userData directory.
 * This is necessary because the original release of the library manager mistakenly put the sqlite file in the app directory.
 * When the user installs an update, that directory is wiped, along with the DB. 
 */ 
function moveExistingDB(): Promise<void> {
	const userDataPath = app.getPath('userData');
	const sqliteDBPath = path.join(userDataPath, 'beathubdb.sqlite');
	const oldDbPath = path.join(__dirname, 'beathubdb.sqlite');
	return fs.rename(oldDbPath, sqliteDBPath).then(() => {
		console.log('Moved existing database to userData directory');
	}).catch(err => {
		console.log('Could not move existing database to userData directory. It likely has already been moved or didnt exist in the first place.');
		console.log(err);
	});
}

export async function connectDB(config) {

	// The check here is to ensure that the 'dev DB' is not copied over.
	if (process.env.NODE_ENV !== 'development'){
		await moveExistingDB();
	}

	const instance = knex(config);

	try { 
		const migrations = await instance.migrate.latest();
		console.log("Ran Migrations ", migrations);

		// if (process.NODE_ENV === 'development') {
		// const seeds = await instance.seed.run()
		// console.log('Ran Seeds ', seeds)
		// }
	} catch(e) { 
		console.error(`Failed to start db connection: ${e.message}`);
		throw e;
	}

	return instance;
}

// module.exports = {
// 	connectDB
// };