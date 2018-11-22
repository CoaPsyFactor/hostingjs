var fs = require('fs');

exports.controller = function(app, db) {
    app.get('/api/ftp/:id', function (req, res) {
	if (req.session.logged) {
	    var serverId = req.params.id || 0, userId = req.session.logged.id;
	    db.serialize(function () {
		db.get('SELECT * FROM `servers` WHERE `userid` = ? AND `id` = ? LIMIT 1;', [userId, serverId], function (err, data) {
		   if (err) {
		       return res.send(500);
		   } else {
		       if (!data) {
			   return res.send(403, {message: 'Server ne pripada vama'});
		       } else {
			   fs.readdir('/', function (err, file) {
			       if (err) {
				   return res.send(500);
			       } else {
				   
			       }
			   });
		       }
		   }
		});
	    });
	} else {
	    return res.send(401, {message: 'Niste ulogovani'});
	}
    });
};