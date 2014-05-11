
/*
 * GET home page.
 */

exports.index = function(req, res){
	//-- If session is not found
	if (!req.session.user) {
		var login_menu = '<li><a href="/login">Login</a></li>';
		var register_menu = '<li><a href="/register">Register</a></li>';
		res.render('index', { title: 'Express', msg: 'Index Page', logout_menu : "", login_menu : login_menu, register_menu : register_menu});
	} else {
		var logout_menu = '<li><a href="/logout">Logout</a></li>';
		var setting_menu = '<li class="dropdown">'+
              '<a href="#" class="dropdown-toggle" data-toggle="dropdown">Tweety Setting<b class="caret"></b></a>'+
              '<ul class="dropdown-menu">'+
                  '<li><a href="/twitter_login">Twitter Login via Tweety</a></li>'+
                  '<li><a href="#">Tweety Streaming Filter</a></li>'+
              '</ul>'+
            '</li>';
        var dashboard_menu = '<li class="dropdown">'+
              '<a href="#" class="dropdown-toggle" data-toggle="dropdown">Tweety Dashboard<b class="caret"></b></a>'+
              '<ul class="dropdown-menu">'+
                  '<li><a href="#">Retweet Dashboard</a></li>'+
              '</ul>'+
            '</li>';
		var login_menu = '';
		res.render('index', { title: 'Express', msg: 'Index Page', logout_menu : logout_menu, login_menu : '', register_menu : '', setting_menu : setting_menu, dashboard_menu : dashboard_menu });
	}
	
	console.log(req.session);
};