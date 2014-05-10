
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var users = require('./routes/users');
var http = require('http');
var path = require('path');
var hbs = require('hbs');

var request = require('request'); //https://github.com/mikeal/request
var database = require('./libs/database.js'); // https://github.com/felixge/node-mysql
var twitter = require("ntwitter"); //https://github.com/AvianFlu/ntwitter
var twitterModule = require('./libs/twitterModule.js');
var async = require('async');
var url = require('url');
var twit = twitterModule.twit();

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', hbs.__express);
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);

app.get('/users', users.list);
app.get('/register', users.register);
app.post('/users/save',users.save);
app.get('/login',users.login);
app.get('/logout',users.logout);
app.post('/users/cek_login',users.cek_login);

app.get('/cek_session', function (req,res) {
	console.log(req.session);
});

app.get('/twitter_login', function (req,res) {
	var path = url.parse(req.url, true);
	console.log(path.pathname);
   	twit.login(path.pathname,"/twitter_callback")(req,res);
});

app.get('/read_dm', function (req,res) {
	twit.getDirectMessages(null, function (err,dirrectMessage) {
		if (err) {
			console.log("Error : ",err);
		} else {
			console.log("eee");
			console.log(dirrectMessage);	
		}
	});
	res.send("Tes");
});

app.get('/twitter_callback', function(req, res){
	/**
	* Include only Application Specific Tokens. User Sign-in with Twitter to get Ouath Tokens
	* Default keys don't work. I am leaving them to make it easier to compare to screenshots found at
	* https://github.com/drouillard/sample-ntwitter
	* NOTE: In a real application do not embedd your keys into the source code
	* TODO: Fill in your Application information here
	*/

	twit.gatekeeper()(req,res,function(){
		req_cookie = twit.cookie(req);
		console.log("Twauth Cookie : >>> ");
		console.log(req_cookie);
		twit.options.access_token_key = req_cookie.access_token_key;
		twit.options.access_token_secret = req_cookie.access_token_secret;

		//twit.options.access_token_key = "70086204-OxzfIfarJOiNx1sLO8svziwWEqfF083Bj0tiO9B5e";
		//twit.options.access_token_secret = "1SzAV3SeZ0OGDpRtS9NOMIkaGJ0QCwiNVrE2YZNR9k7Dz";

		twit.verifyCredentials(function (err, data) {
		  console.log("Verifying Credentials...");
		  if(err)
		    console.log("Verification failed : " + err)

			console.log("Sucessfully Authenticated with Twitter...");
			console.log("USER ACCOUNT >>>");
			console.log("Name : "+data.name);
			console.log("Twitter : "+data.screen_name);
		})
		.getHomeTimeline('',
		  function (err, data) {
		    console.log("Timeline Data Returned...");
		    var view_data = {
		      "timeline" : JSON.stringify(data)
		    }

		    console.log("Exiting Controller.");
		    res.send(view_data);
		  });
	});
});	

app.get('/async', function (req, res) {
	console.log("Async bro");
	/*
	async.parallel([
        //Load user
        function(callback) {
            console.log("First Task");
            callback(null,"First");
        },
        //Load posts
        function(callback) {
            console.log("Second Task");
            callback(null,"Second");
        }
    ], function(err,task) { //This function gets called after the two tasks have called their "task callbacks"
        if (err) return next(err); //If an error occured, we let express/connect handle it by calling the "next" function
        console.log("All task are done!");
        console.log(task);
        //Here locals will be populated with 'user' and 'posts'
        //res.render('user-profile', locals);
    });
	*/

	var messageIds = "1,2,3,4".split(',');
    async.forEach(messageIds, function(messageId, callback) { //The second argument (callback) is the "task callback" for a specific messageId
        console.log("Inside foreach");
        if (messageId == "1") {
        	setTimeout(function () {
		    	console.log("Run Task : "+messageId);
	    		callback();
		    }, 10000);
        } else if (messageId == "2") {
        	setTimeout(function () {
		    	console.log("Run Task : "+messageId);
	    		callback();
		    }, 15000);
        } else if (messageId == "3") {
        	setTimeout(function () {
		    	console.log("Run Task : "+messageId);
	    		callback();
		    }, 5000);
        }  else if (messageId == "4") {
        	setTimeout(function () {
		    	console.log("Run Task : "+messageId);
	    		callback();
		    }, 7000);
        }
        
    }, function(err) {
        if (err) return next(err);
        //Tell the user about the great success
        res.json({
            success: true,
            message: messageIds.length+' message(s) was deleted.'
        });
    });
});

app.get('/twitter_stream', function (req,res) {
	console.log("Twitter bro");
	res.send("API Testing");
	
	//-- Send Direct Message
	/*
	twit.newDirectMessage('pipiet06','Hello Ay, numpang testing :D', function (err,data) {
		console.log(data);
	});
	*/

	//-- Status Filter
	twit.stream('statuses/filter', {'track':'#tes'}, function(stream) {
	  stream.on('data', function (data) {
	    console.log("========= Found Stream ==========");
	    console.log("User Name : "+data.user.name);
	    console.log("Screen Name : @"+data.user.screen_name);
	    console.log("Twit Content : "+data.text);
	    console.log("=================================");

	    twit.newDirectMessage(data.user.screen_name,'Hello '+data.user.name+', Thanks for helping testing :)', function (err,data) {
			if (err != null) {
				console.log("ERROR OCCURED WHEN SENDING DM : ");
				console.log(err);
				console.log("=================================");
			} else {
				console.log("Direct Message was sent to : @"+data.recipient.screen_name);
				console.log("=================================");
			}
			//console.log("User Name : "+data.recipient.name);
		    //console.log("Screen Name : @"+data.recipient.screen_name);
		});
	  });
	});


});

app.get('/twitter_write', function (req,res) {
	//-- Update Status
	var status = "Test on "+Date();
	//twitter.VERSION
	//console.log("TWIT object >>>");
	//console.log(twit);
	
	twit.updateStatus(status,
		function (err, data) {
			if (err) {
				console.log("Error occured : ");
				console.log(err);
			} else {
				console.log(data);	
			}
		  	
		}
	);
})

http.createServer(app).listen(app.get('port'), function(){
  console.log(Date());
  console.log('Express server listening on port ' + app.get('port'));
});
