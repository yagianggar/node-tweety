var mysql = require("mysql"); // https://github.com/felixge/node-mysql

exports.connect = function (req, res) {
	var connection = mysql.createConnection({
	  host     : 'localhost',
	  user     : 'root',
	  password : '',
	  database : 'tweety'
	});

	connection.connect(function(err) {
	  console.log("On connect : ");
	  console.log(err);
	  if (err) {
	  	console.log("DB Connection Error : "+err.code);
	  }
	});
	return connection;
}
