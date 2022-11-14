const mysql = require('mysql');
const config = require('../config/db.config')
const connection = mysql.createConnection({
    host: config.HOST,
    user: config.USER,
    database: config.DB,
    password: config.PASSWORD
});
connection.connect();
module.exports = connection;