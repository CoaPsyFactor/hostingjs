var fs = require('fs');
var randomstr = require('randomstring');
var sys = require('sys');

var stopServer = function(server, callback) {
    var ex = require('child_process').exec, self = this;
    if (server) {
        ex('screen -wipe && screen -list', function(err, out, stderr) {
            out = out.split("\n");
            out.forEach(function(value, id) {
                if (value.indexOf(server) !== -1) {
                    value = value.split('.');
                    var cmd = 'kill ' + value[0].trim("\t");
                    ex(cmd, function(err, out, stderr) {
                    });
                }
            });

            if (typeof callback === 'function') {
                callback();
                return true;
            }
        });
    }
};

exports.controller = function(app, db) {
    app.post('/api/servers/order', function(req, res) {
        var type, name, slots;
        db.serialize(function() {
            if (!req.session.logged) {
                return res.send(401, {message: 'Niste ulogovani'});
            }

            db.get('SELECT `id` FROM `servers` WHERE `status` = 0 AND `userid` = ? LIMIT 1;', [req.session.logged.id], function(err, row) {
                if (!row) {
                    try {
                        type = req.body.game;

                        if (type < 1 || type > 3) {
                            throw new Error('Parametar nije validan.');
                        }
                    } catch (e) {
                        return res.send(403, {game: e.message});
                    }

                    try {
                        name = req.body.name;

                        if (name.length < 2) {
                            throw new Error('Ime mora imati barem 2 karaktera.');
                        }
                    } catch (e) {
                        return res.send(403, {name: e.message});
                    }

                    try {
                        slots = parseInt(req.body.slots) || 0;
                        if (slots < 1 || (type == 1 && slots > 500) || (type == 2 && slots > 32) || (type == 3 && slots > 100)) {
                            throw new Error('Broj slotova nije validan.');
                        }
                    } catch (e) {
                        return res.send(403, {slots: e.message});
                    }

                    var date = (new Date().getTime()) * 1000, userid = req.session.logged.id;

                    db.run('INSERT INTO `servers` (`userid`,`name`,`type`,`slots`,`date`) VALUES (?,?,?,?,?);', [userid, name, type, slots, date], function(err) {
                        if (err) {
                            return res.send(403, {message: 'Doslo je do greske, pokusaj ponovo.'});
                        } else {
                            var port;

                            if (type == 1) {
                                port = 7777;
                            } else if (type == 2) {
                                port = 27015
                            } else if (type == 3) {
                                port = 3360;
                            }
                            var ftpuser = 'srv' + this.lastID;
                            var ftppassword = randomstr.generate(12);

                            port += this.lastID;
                            db.run('UPDATE `servers` SET `port` = ?, `ftpuser` = ?, `ftppassword` = ? WHERE `id` = ?;', [port, ftpuser, ftppassword, this.lastID], function(err) {
                                if (!err) {
                                    return res.send(200, {message: 'Zahtev uspesno poslat.'});
                                } else {
                                    return res.send(403, {message: 'Doslo je do greske, pokusaj ponovo.'});
                                }
                            });
                        }
                    });
                } else {
                    return res.send(401, {message: "Vec imate narudzbinu na cekanju."});
                }
            });
        });
        // res.send(200);
    });
    app.get('/api/servers/stop/:id', function(req, res) {
        var exec = require('child_process').exec;
        if (req.session.logged) {
            db.serialize(function() {
                db.get('SELECT * FROM `servers` WHERE `id` = ? AND `userid` = ?;', [req.params.id, req.session.logged.id], function(err, data) {
                    if (err) {
                        return res.send(403, {message: 'Doslo je do greske, pokusaj ponovo.'});
                    } else {
                        if (!data) {
                            return res.send(401, {message: 'Server ne pripada vama.'});
                        } else {
			    if (data.status < 1) {
				return res.send(403, {message: 'Server nije aktivan'});
			    } else {
				stopServer(data.ftpuser, function() {
				});
				
				return res.send(200, {message: 'Server stopiran'});
			    }
                        }
                    }
                });
            });
        } else {
            return res.send(401);
        }
    });

    app.get('/api/servers/online/:id', function(req, res) {
        var exec = require('child_process').exec;

        if (req.session.logged) {
            db.serialize(function() {
                db.get('SELECT `port`,`type` FROM `servers` WHERE `id` = ?;', [req.params.id], function(err, data) {
                    if (err) {
                        return res.send(500, {message: 'doslo je do greske.'});
                    } else {
                        if (!data) {
                            return res.send(401, {message: 'Server ne postoji'});
                        } else {
                            exec('nmap -P0 -sU -p' + data.port + ' 127.0.0.1', function(err, out, stderr) {
                                if (out.indexOf('open') !== -1) {
                                    return res.send(200, {message: 'Server je online', id: req.params.id});
                                } else {
                                    return res.send(503, {message: 'Server je offline', id: req.params.id});
                                }
                            });
                        }
                    }
                });
            });
        } else {
            return res.send(401, {message: 'Morate biti ulogovani.'});
        }
    });
    app.get('/api/servers/restart/:id', function(req, res) {
        var exec = require('child_process').exec;
        if (req.session.logged) {
            db.serialize(function() {
                db.get('SELECT * FROM `servers` WHERE `id` = ? AND `userid` = ?;', [req.params.id, req.session.logged.id], function(err, data) {
                    if (err) {
                        return res.send(403, {message: 'Doslo je do greske, pokusaj ponovo.'});
                    } else {
                        if (!data) {
                            return res.send(401, {message: 'Server ne pripada vama.'});
                        } else {
                            if (data.status == -1 || data.status == 0) {
                                return res.send(403, {message: 'Server ne postoji ili jos uvek nije odobren.'});
                            }
                            var startServerCmd, content;
                            if (data.type == 1) {
                                var servercfgfile = '/home/' + data.ftpuser + '/server.cfg', extract, stopServerComman;

                                fs.readFile(servercfgfile, {encoding: 'utf8'}, function(err, text) {
                                    if (err) {
                                        return res.send(500);
                                    }
                                    extract = text.split("\n");
                                    var tmpVal = [];

                                    extract.forEach(function(value, id) {
                                        tmpVal = value.split(' ');

                                        if (tmpVal[0] == 'maxplayers') {
                                            tmpVal[1] = data.slots
                                        } else if (tmpVal[0] == 'lanmode') {
                                            tmpVal[1] = '0';
                                        } else if (tmpVal[0] == 'port') {
                                            tmpVal[1] = data.port;
                                        } else if (tmpVal[0] === 'hostname') {
                                            tmpVal = ['hostname', data.name];
                                        }

                                        extract[id] = tmpVal.join(' ');
                                    });

                                    content = extract.join("\n");
                                    fs.writeFileSync(servercfgfile, content);
                                });

                                startServerCmd = './samp03svr';
                            } else if (data.type == 2) {
                                startServerCmd = './hlds_run -game cstrike +port ' + data.port + ' +maxplayers ' + data.slots;
                                startServerCmd += ' +sys_ticrate 300 -pingboost 0 +map de_dust2 +servercfgfile server.cfg';
                            }

                            startServerCmd = 'cd /home/' + data.ftpuser + '/ && screen -dmS ' + data.ftpuser + ' ' + startServerCmd;
                            stopServer(data.ftpuser, function() {
                                exec(startServerCmd, function(err, out, stderr) {
                                    if (!err && !stderr) {
                                        return res.send(200, {message: 'Server restartovan.'});
                                    } else {
                                        return res.send(500, {message: 'Doslo je do greske.'});
                                    }
                                });
                            });
                        }
                    }
                });
            });
        } else {
            return res.send(401, {message: 'Moras biti ulogovan.'});
        }
    });

    app.get('/api/servers/list', function(req, res) {
        if (req.session.logged) {
            db.serialize(function() {
                db.all('SELECT * FROM `servers` WHERE `status` > -1 AND `userid` = ?;', [req.session.logged.id], function(err, row) {
                    if (err) {
                        return res.send(403, {message: 'Doslo je do greske'});
                    } else {
                        return res.send(200, row);
                    }
                });
            });
        } else {
            if (!req.xhr) {
                res.redirect('/users/login');
            } else {
                res.send(401, {message: 'Niste ulogovani'});
            }
        }
    });
    
};