
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express', msg: 'Index Page' });
  console.log(req.session);
};