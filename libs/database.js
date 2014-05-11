var mysql = require("mysql"); // https://github.com/felixge/node-mysql

exports.connect = function (req, res) {
	var connection = mysql.createConnection({
	  host     : 'localhost',
	  user     : 'root',
	  password : '',
	  database : 'tweety'
	});

	connection.connect(function(err) {
	  console.log("Connecting Database ...");
	  if (err) {
	  	console.log("DB Connection Error : "+err.code);
	  	console.log(err);
	  } else {
	  	console.log("DB Successfully Connected!!!");
	  }
	});
	return connection;
}
