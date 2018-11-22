var fs = require('fs');
var crypto = require('crypto');

var emailcheck = function(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
};

exports.controller = function(app, db) {
    app.put('/api/users/profile', function(req, res) {
	var sha = crypto.createHash('md5');
	var c = crypto.createHash('md5');
	var password, repassword, curpassword;

	try {
	    password = req.body.password
	    repassword = req.body.repassword;

	    if (password.length < 6) {
		throw new Error('Lozinka mora imati barem 6 karaktera.');
	    } else if (password != repassword) {
		throw new Error('Lozinke se ne poklapaju');
	    } else {
		sha.update(password);
	    }
	} catch (e) {
	    return res.send(403, {password: e.message});
	}

	try {
	    curpassword = req.body.currentpassword;
	    c.update(curpassword);
	    var ncurpassword = c.digest('hex');

	    if (curpassword.length < 6 || ncurpassword != req.session.logged.password) {
		throw new Error('Lozinka nije ispravna');
	    }
	} catch (e) {
	    return res.send(403, {currentpassword: e.message})
	}

	password = sha.digest('hex');
	db.serialize(function() {
	    db.run('UPDATE `clients` SET `password` = ? WHERE `id` = ?;', [password, req.session.logged.id], function(err) {
		if (err) {
		    return res.send(403, {message: 'Doslo je do greske, pokusaj ponovo.'});
		} else {
		    req.session.logged.password = password;
		    res.send(200);
		}
	    });
	});

    });

    app.get('/api/users/profile', function(req, res) {
	if (req.session.logged) {
	    res.send(200, req.session.logged);
	} else {
	    res.redirect('/users/login');
	}
    });

    app.get('/api/users/logout', function(req, res) {
	delete req.session.logged;
	if (!req.xhr) {
	    res.redirect('/users/login');
	} else {
	    res.send(200, {message: "Izlogovani ste."});
	}
    });

    app.post('/api/users/login', function(req, res) {
	var sha = crypto.createHash('md5');
	var name, password, fail = false;
	var message = [];

	try {
	    name = req.body.email;
	} catch (e) {
	    fail = true;
	    message.push({email: 'Email polje je obavezno'});
	}

	try {
	    password = req.body.password;
	    sha.update(password);
	} catch (e) {
	    fail = true;
	    message.push({password: 'Lozinka je obavezna.'});
	}

	if (fail) {
	    res.send(401, message);
	} else {
	    db.serialize(function() {
		password = sha.digest('hex');
		db.get('SELECT * FROM `clients` WHERE (`email` = ? OR `username` = ?) AND `password` = ? LIMIT 1;', [name, name, password], function(err, row) {
		    if (err || !row) {
			res.send(403, {message: 'Podaci nisu validni.'});
		    } else {
			req.session.logged = row;
			res.send(200, {message: row});
		    }
		});
	    });
	}
    });

    app.post('/api/users/register', function(req, res) {
	var sha = crypto.createHash('md5');
	var city, country = 0, email, name, password, repassword, username;
	var message = [];
	var fail = false;

	try {
	    city = req.body.city;

	    if (city.length < 2 || city.length > 64) {
		throw new Error('Grad nije validan.');
	    }
	} catch (e) {
	    fail = true;
	    message.push({city: e.message});
	}

	try {
	    country = req.body.country;

	    if (country < 1 || country > 5) {
		throw new Error('Drzava nije validna.');
	    }
	} catch (e) {
	    fail = true;
	    message.push({country: e.message});
	}

	try {
	    email = req.body.email;

	    if (!emailcheck(email)) {
		throw new Error('Email adresa nije validna.');
	    }
	} catch (e) {
	    fail = true;
	    message.push({email: e.message});
	}

	try {
	    name = req.body.name;

	    if (name.length < 4 || name.length > 64) {
		throw new Error('Ime nije validno.');
	    }
	} catch (e) {
	    fail = true;
	    message.push({name: e.message});
	}

	try {
	    password = req.body.password_reg;
	    repassword = req.body.repassword;

	    if (password.length < 6) {
		throw new Error('Lozinka mora sadrzati barem 6 karaktera.');
	    } else if (password != repassword) {
		throw new Error('Lozinke se nepoklapaju.');
	    } else {
		sha.update(password);
	    }

	} catch (e) {
	    fail = true;
	    message.push({password: e.message});
	}

	try {
	    username = req.body.username;

	    if (username.length < 4) {
		throw new Error('Korisnicko ime nije validno, barem 4 karaktera');
	    }
	} catch (e) {
	    fail = true;
	    message.push({username: e.message});
	}

	if (fail) {
	    return res.send(403, message);
	} else {
	    db.serialize(function() {
		password = sha.digest('hex');
		db.get('SELECT `id` FROM `clients` WHERE `email` = ?;', [email], function(err, row) {
		    if (typeof row === 'undefined') {
			db.get('SELECT `id` FROM `clients` WHERE `username` = ?;', [username], function(err, row) {
			    if (typeof row === 'undefined') {
				//var city, country = 0, email, name, password, repassword, username;
				db.run('INSERT INTO `clients` (`city`,`country`,`email`,`name`,`password`,`username`) VALUES (?,?,?,?,?,?);', [city, country, email, name, password, username], function(err) {
				    if (err) {
					res.send(403, [{register: 'Registracija nije uspela, probaj ponovo.'}]);
				    } else {
					res.send(200, {message: 'Registracija uspesna.'});
				    }
				});
			    } else {
				return res.send(403, [{username: 'Username je u upotrebi.'}]);
			    }
			});
		    } else {
			return res.send(403, [{email: 'Email adresa je u upotrebi.'}]);
		    }
		});
	    });
	}
    });
};
