const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'business',
    password: 'password',
});
     
module.exports = connection;