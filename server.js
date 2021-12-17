const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'hoangnam',
  database: 'Tastie',
});
connection.query('SELECT * FROM `User`', function (err, results, fields) {
  console.log(results); // results contains rows returned by server
  // console.log(fields); // fields contains extra meta data about results, if available
});
