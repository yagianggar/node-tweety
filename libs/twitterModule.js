var twitter = require("ntwitter");

exports.twit = function (req,res) {
	/*
	twit = new twitter({
	  consumer_key: 'hGBSJzgCEFM9LE7uIjVdQ',
	  consumer_secret: 'tOIoLXSOHwuynwQd6ZR5JXDC4VgAgxgFyauDWTwEL4',
	  access_token_key: '137255917-pRo62GwXfa0am9jscHRnrl3hRNQv0o4461aqa5h5',
	  access_token_secret: 'oRUFxaqeZ4mqUDgMvcFVdPaG1ogSjERkEemn0odpPM'
	});
	*/

	//-- Testie
	twit = new twitter({
	  consumer_key: 'mXATvQs8Zcr0aBjuDF7MA',
	  consumer_secret: '5PuOmmscKhxHC8cSRhAuG11Bz6y8r79Pumus9AoKqk',
	  access_token_key: '2286253453-yVvAZUdFCUtUTNazPAPqgVbDbGyeGnmdZcH7K4K',
	  access_token_secret: '0VP9jPZCEgcoA1lWLyFQ4sJWVo6PR0brfBREnuROTRZ70'
	});
	return twit;
}