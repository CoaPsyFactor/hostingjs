var crypto = require('crypto');
var sys = require('sys')
var exec = require('child_process').exec;
var child;

exports.controller = function(app, db) {
    app.get('/api/orders', function(req, res) {
        if (req.session.logged) {
            if (req.session.logged.level < 2) {
                return res.send(401, {message: 'Nisi administrator.'});
            }

            db.serialize(function() {
                db.all('SELECT `servers`.*, `clients`.`username` AS `owner` FROM `servers` LEFT JOIN `clients` WHERE `servers`.`status` = 0  AND `clients`.`id` = `servers`.`userid` ORDER BY 	`servers`.`date` ASC;', function(err, data) {
                    if (err) {
                        return res.send(500, {message: 'Doslo je do greske.'});
                    }

                    res.send(200, data);
                });
            });
        }
    });

    app.get('/api/servers/decline/:id', function(req, res) {
        if (req.session.logged) {
            if (req.session.logged.level < 2) {
                return res.send(401, {message: 'Nemate dovoljno privilegija.'});
            }

            db.serialize(function() {
                db.run('UPDATE `servers` SET `status` = -1 WHERE `id` = ?;', [req.params.id], function(err) {
                    if (err) {
                        return res.send(500, {message: "Doslo je do greske."})
                    }

                    return res.send(200);
                });
            });
        } else {
            return res.send(401);
        }
    });

    app.get('/api/servers/accept/:id', function(req, res) {
        var id = req.params.id || null;

        if (!id) {
            return res.send(500, {message: 'Bad input ... bbzzzZbbz...zzbb'});
        }

        if (req.session.logged) {
            if (req.session.level < 2) {
                return res.send(401, {message: 'Nemate dovoljno privilegija.'});
            }

            db.serialize(function() {
                db.get('SELECT * FROM `servers` WHERE `id` = ?;', [id], function(err, row) {
                    if (err) {
                        return res.send(500);
                    } else if (!row) {
                        return res.send(403);
                    }
                    var ftpuser = row.ftpuser;
                    var ftppassword = row.ftppassword;
                    var userAddCmd = "useradd -s /bin/bash -m " + ftpuser;

                    child = exec(userAddCmd, function(err, out, stderr) {
                        if (!err) {
                            var setPwdCmd = 'echo ' + ftpuser + ':' + ftppassword + ' | chpasswd';

                            child = exec(setPwdCmd, function(err, out, stderr) {
                                if (!err && !stderr) {
                                    db.run('UPDATE `servers` SET `status` = 1 WHERE `id` = ?;', [id], function(err) {
                                        if (!err) {
                                            var copyFilesCmd = '';

                                            if (row.type === 1) {
                                                copyFilesCmd = 'cp -r /home/original/samp03/* /home/' + ftpuser;
                                            } else if (row.type === 2){
                                                copyFilesCmd = 'cp -r /home/original/cs16/* /home/' + ftpuser;
                                            }

                                            exec(copyFilesCmd, function(err, out, stderr) {
                                                if (err || stderr) {
                                                    return res.send(500, {message: 'Doslo je do greske kod CP'});
                                                } else {
                                                    var chownCommand = 'chown -R ' + ftpuser + ':' + ftpuser + ' /home/' + ftpuser
                                                    exec(chownCommand, function(err, out, stderr) {
                                                        if (err || stderr) {
                                                            return res.send(500, {message: 'Doslo je do kreske kod CHOWN'});
                                                        } else {
                                                            return res.send(200, {message: 'Dodato'});
                                                        }
                                                    });
                                                }
                                            });
                                        } else {
                                            var deluser = 'userdel -f -r ' + ftpuser;
                                            exec(deluser);
                                            return res.send(500);
                                        }
                                    });
                                } else {
                                    return res.send(500);
                                }
                            });
                        } else {
                            console.log(err);
                            return res.send(500, {message: 'Dodavanje korisnika nije uspelo'});
                        }
                    });
                });
            });
        } else {
            return res.send(401);
        }
    });

    app.post('/api/admin/login', function(req, res) {
        var md5 = crypto.createHash('md5');
        var password;

        if (req.session.logged) {

            if (req.session.logged.level < 1) {
                return res.send(401, {message: 'Nisi administrator.'});
            }

            try {
                password = req.body.password;
                md5.update(password);

            } catch (e) {
                return res.send(500, {message: e.message});
            }

            digest = md5.digest('hex');

            if (password < 6 || digest != req.session.logged.password) {
                return res.send(403, {message: 'Lozinka nije tacna.'});
            }

            return res.send(200);
        } else {
            return res.send(401, {message: 'Niste ulogovani'});
        }
    });
}