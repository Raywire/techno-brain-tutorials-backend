const mysql = require('mysql');
const dotenv = require('dotenv');

dotenv.config();

var connection = mysql.createConnection({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_DATABASE
});
connection.connect(function(error){
	if(error) {
		console.log(error);
	} else {
		console.log('Database Connected..!');
	}
});

module.exports = connection;