var mysql = require('mysql');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'tullz',
  password : 'Tullz123',
  database : 'asd'
});

connection.connect()
module.exports = connection;
