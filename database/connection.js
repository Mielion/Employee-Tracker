import pg from 'pg';
const { Client } = pg;

import dotenv from 'dotenv';
//Loads .env file contents into process.env by default.
dotenv.config(); 

const connection = new Client({
	user: process.env.DATABASE_USER,
	password: process.env.DATABASE_PASS,
	host: process.env.DATABASE_HOST,
	port: process.env.DATABASE_PORT,
	database: 'inquirer_cms',
});


const connect = async function() {

	await connection.connect()

	try {
	   const res = await connection.query('SELECT $1::text as message', ['Connection to database established...'])
	   console.log(res.rows[0].message) // Connection to database established...
	} catch (err) {
	   console.error(err);
	}

};

connect();

//create this function so we can close the connection at the end of the program
const disconnect = async function() {
	await connection.end();
}

//export these modules so we can use them in other files
export { connection, disconnect};