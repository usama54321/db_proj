var mysql = require('mysql');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'tullz',
  password : 'TullzKing123',
  database : 'airport_system'
});

connection.connect()
module.exports = connection;
