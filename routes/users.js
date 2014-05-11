var database = require('../libs/database.js'); // https://github.com/felixge/node-mysql
var connection = database.connect();
var request = require('request');
var md5 = require('MD5');

exports.list = function(req, res){
  res.send("respond with a resource");
};

exports.register = function(req, res){
  res.render('register', { title: 'Register Email', msg: 'Register your email account' });
};

exports.login = function(req, res){
  res.render('login', { title: 'Login', msg: 'Login Page' });
};

exports.cek_login = function(req, res){
  var post = req.body;
  var username = post.username;
  var password = md5(post.password);

  var selectQuery = "SELECT * FROM users where username='"+username+"' AND password='"+password+"'";
  
  connection.query(selectQuery, function (err,rows,fields) {
  	if (err) {
  		data = {
			'error' : true,
			'error_msg' : err.code
		}
		res.writeHead(200, { 'Content-Type': 'application/json' }); 
  		res.end(JSON.stringify(data));
  	} else {
  		var resLen = rows.length;
  		if (resLen > 0) {
  			data = {
				'error' : false,
				'msg' : "Login success"
			}

			req.session.user = username;
			res.send({redirect:'/'});
			//res.writeHead(200, { 'Content-Type': 'application/json' }); 
	  		//res.end(JSON.stringify(data));
  		} else {
  			data = {
				'error' : true,
				'error_msg' : "Login Failed"
			}
			res.writeHead(200, { 'Content-Type': 'application/json' }); 
	  		res.end(JSON.stringify(data));
  		}
  		console.log(rows.length);
  	}
  });
  /*
  if (true) {
  	req.session.regenerate(function () {
  		request.session.user = username;
  		res.send("Authentication Success");
  	});
  } else {
  	res.redirect();
  }
  */
};

exports.logout = function (req,res) {
	req.session.destroy(function() {
		res.redirect('login');
	});
}

exports.save = function (req, res) {
	var post = req.body;
	var insertQuery = null;

	if (post.id == "" || typeof post.id === "undefined") {
		insertQuery = "INSERT INTO users (email,username,password) VALUES ('"+post.email+"','"+post.username+"','"+md5(post.password)+"')";
	} else {
		insertQuery = "UPDATE users SET email='"+post.email+"',password='"+post.password+"' WHERE id="+post.id;
	}
	
	connection.query("SELECT * FROM users WHERE email='"+post.email+"'", function (err, rows, fields) {
		//if (err) throw err;

		if (err) {
			data = {
				'error' : true,
				'error_msg' : err.code
			}
			res.writeHead(200, { 'Content-Type': 'application/json' }); 
      		res.end(JSON.stringify(data));

		} else {
			if (rows.length > 0) {
				data = {
					'error' : true,
					'error_msg' : "Email address already exists"
				}
				res.writeHead(200, { 'Content-Type': 'application/json' }); 
	      		res.end(JSON.stringify(data));
			} else {
				connection.query(insertQuery, function (err, rows, fields) {
				if (err) {
					data = {
						'error' : true,
						'error_msg' : err.code
					}
					res.writeHead(200, { 'Content-Type': 'application/json' }); 
		      		res.end(JSON.stringify(data));

				} else {
					req.session.user = post.username;
					data = {
						'error' : false,
						'msg' : 'Site saved successfully'
					}
					res.writeHead(200, { 'Content-Type': 'application/json' }); 
		      		res.end(JSON.stringify(data));
				}
			});
			}
		}
	});
	//connection.end();
}