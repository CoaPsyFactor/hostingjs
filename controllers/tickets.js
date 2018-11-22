exports.controller = function(app, db) {
    app.post('/api/ticket', function(req, res) {
  var serverId, userId, title, priority, content, message = [];

  if (!req.session.logged) {
      return res.send(403, {message: 'Niste ulogovani'});
  } else {
      userId = req.session.logged.id;
  }
  ;

  try {
      serverId = req.body.server;

      if (!serverId || serverId <= 0) {
    throw new Error('Server nije validan.');
      }
  } catch (e) {
      message.push({servers: e.message});
  }
  ;

  try {
      title = req.body.title;

      if (!title || title.length < 6) {
    throw new Error('Naslov je prekratak');
      }
  } catch (e) {
      message.push({title: e.message});
  }
  ;

  try {
      priority = req.body.priority;

      if (!priority || priority > 3) {
    throw new Error('Prioritet nije validan');
      }
  } catch (e) {
      message.push({priority: e.message});
  }

  try {
      content = req.body.content;

      if (!content || content.length < 20) {
    throw new Error('Opis mora biti detaljniji');
      }
  } catch (e) {
      message.push({content: e.message});
  }

  if (message.length) {
      return res.send(301, {data: message});
  } else {
      db.serialize(function() {
    db.get('SELECT `name` FROM `servers` WHERE `userid` = ? AND `id` = ?;', [userId, serverId], function(err, data) {
        if (err) {
      return res.send(500);
        } else {
      if (!data) {
          return res.send(403, {message: 'Server ne pripada vama'});
      } else {
          var date = (new Date().getTime()) * 1000;
          db.run('INSERT INTO `tickets` (`serverid`,`title`,`content`,`priority`,`date`) VALUES (?,?,?,?);', [serverId, title, content, priority, date], function(err) {
        if (err) {
            return res.send(500);
        } else {
            return res.send(200, {message: 'Tiket poslat', id: this.lastID});
        }
          });
      }
        }
    });
      });
  }
    });
};
