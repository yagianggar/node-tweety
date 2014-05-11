var async = require('async');
var fs = require('fs');

exports.start_process = function (db_connect,twitterModule) {
	console.log(">>> Starting Async Process");
	db_connect.query('SELECT * FROM twitter_account', function(err, rows, fields) {
		if (err) {
			console.log("Error Occured : ");
			console.log(err);
		} else {
			//-- Loop id_twitter_account to get each keyword
			var keyword_obj = {};
			var id_twitter_account = "";
			rows.forEach(function (key) {
				id_twitter_account += key.id+",";
			});
			id_twitter_account = id_twitter_account.substring(0,id_twitter_account.length-1);

			db_connect.query('SELECT * FROM stream_keyword WHERE id_twitter_account IN ('+id_twitter_account+')', function(err, keyword_rows, fields) {
				if (err) {
					console.log("Error Occured : ");
					console.log(err);
				} else {
					keyword_rows.forEach(function (keyword_key) {
						keyword_obj = {
							keyword : keyword_key.keyword
						}
					});
				}
				
				// -- Loop & match each keyword to its parent (id_twitter_account)
				for (i=0; i<rows.length; i++) {
					var arr_obj_keyword = [];
					for (j=0; j<keyword_rows.length; j++) {
						if (rows[i].id === keyword_rows[j].id_twitter_account) {
							var arr_keyword = {
								keyword : keyword_rows[j].keyword
							};
							arr_obj_keyword = arr_obj_keyword.concat(arr_keyword);
						}
					}
					rows[i].arr_keyword = arr_obj_keyword;
				}
				async_process(rows,twitterModule);
			});
		}
	});

	return false;
};

async_process = function (rows,twitterModule) {
	var messageIds = "1,2,3,4".split(',');
	var a = {};
	
	/* Loop all credential from table */
	async.forEach(rows, function (row, callback) {
		a.access_token_key = row.access_token_key;
		a.access_token_secret = row.access_token_secret;
		
		//-- Set token credential for each twitter client
		twitterModule.setToken(a);
		twit = twitterModule.twit();

		//-- Call method to filter stream
		twitter_filter_stream(twit,row);

		//-- Call method to write a tweet
		//twitter_write(twit);

	}, function(err) {
		if (err) return next(err);

		console.log(row.screen_name);
	});
	return false;
	
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
}

twitter_filter_stream = function (twit,row) {
	var str_keyword = "";
	row.arr_keyword.forEach(function(keyword_row) {
		str_keyword += keyword_row.keyword+",";
	});
	str_keyword = str_keyword.substring(0, str_keyword.length-1);
	
	twit.stream('statuses/filter', {'track':str_keyword}, function(stream) {
	  stream.on('data', function (stream_data) {
	  	console.log("========= Found Stream ==========");
	    console.log("Token Key : "+twit.options.access_token_key);
	  	console.log("Token Secret : "+twit.options.access_token_secret);
	    console.log("User Name : "+stream_data.user.name);
	    console.log("Screen Name : @"+stream_data.user.screen_name);
	    console.log("Twit Content : "+stream_data.text);
	    console.log("=================================");

	    /*
	    twit.newDirectMessage(stream_data.user.screen_name,'Hello '+stream_data.user.name+', Thanks for helping testing :)', function (err,data) {
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
*/
	  });
	  stream.on('error', function (err) {
	  	console.log("==== Error Occured ====");
	  	console.log(err);
	  	console.log("Token Key : "+twit.options.access_token_key);
	  	console.log("Token Secret : "+twit.options.access_token_secret);
	  	console.log("=======================");

	  	stream_error_log(err,twit.options.access_token_key,twit.options.access_token_secret);
	  });
	});
}

twitter_write = function (twit) {
	var status = "Test on "+Date();
	twit.updateStatus(status,
		function (err, data) {
			if (err) {
				console.log("Error occured : ");
				console.log(err);
			} else {
				console.log("Latest tweet : "+status);	
			}
		  	
		}
	);
}

//-- Log error in streaming process
stream_error_log = function (err,token_key,token_secret) {
	var today = new Date();
	var dd = ("0" + today.getDate()).slice(-2);
	var mm = ("0" + (today.getMonth()+1)).slice(-2);//today.getMonth()+1; //January is 0!
	var yyyy = today.getFullYear();

	var hours = ("0" + today.getHours()).slice(-2);;
	var minutes = ("0" + today.getMinutes()).slice(-2);;
	var seconds = ("0" + today.getSeconds()).slice(-2);;

	var full_date = dd+"-"+mm+"-"+yyyy;
	var full_time = hours+":"+minutes+":"+seconds;

	var log_content = "Token Key : "+token_key+" | Token Secret : "+token_secret+" | ERROR : "+err;
	var full_log_content = full_date+" "+full_time+" >>> "+log_content;

	fs.exists("./logs/twitter_stream/stream_"+full_date+".log", function (exists) {
		if (exists) {
	  		fs.appendFile("./logs/twitter_stream/stream_"+full_date+".log", '\n'+full_log_content, function (err) {
			if (err) throw err;
			  	console.log('Error Logged !!!');
			});
	  	} else {
	  		fs.writeFile("./logs/twitter_stream/stream_"+full_date+".log", full_log_content, function(err) {
		    if(err) {
		        console.log(err);
		    } else {
		        console.log("Error log generated !!!");
		    }
		}); 
	  	}
	});
}
