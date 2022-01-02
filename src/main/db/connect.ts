import {knex} from "knex";

// const Knex = require('knex');

export async function connectDB(config) {
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