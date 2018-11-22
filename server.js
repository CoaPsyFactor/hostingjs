var express = require('express');
var fs = require('fs');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var sqlite = require('sqlite3');
var db = new sqlite.Database('xka0XR.sqlite');

var app = express();

function compile(str, path) {
    return stylus(str)
	    .set('filename', path)
	    .use(nib());
}

var server = require('http').createServer(app);

app.use(bodyParser());
app.use(cookieParser());
app.use(session({secret: 'G9cPWbBCFRRy'}));

fs.readdirSync('./controllers').forEach(function(file) {
    if (file.substr(-3) == '.js') {
	route = require('./controllers/' + file);
	route.controller(app, db);
    }
});

console.log('test');
console.log('adsasd');

app.get('*', function(req, res) {
    var url = req.url.split('?')[0];

    if (url.substr(-3) === '.js' || url.substr(-4) === '.css' || url.substr(-4) === '.gif'
	    || url.substr(-4) === '.png' || url.substr(-4) === '.ico' || url.substr(-4) === '.jpg'
	    || url.substr(-4) === '.otf' || url.substr(-4) === '.eot' || url.substr(-4) === '.svg' || url.substr(-4) === '.ttf' || url.substr(-5) === '.woff') {
	res.sendfile('./public' + url);
    } else if (url.indexOf('/api') == -1) {

    	var urls = url.split('/');

    	for (var i = 0; i < urls.length; i++) {
    	    urls[i] = urls[i].charAt(0).toUpperCase() + urls[i].slice(1).toLowerCase();
    	};

    	url = urls.join('/') + '.tpl';
    	var view = './public/views' + url;

    	if (!fs.existsSync(view)) {
    	    view = './public/views/Public/404.tpl';
    	}

    	if (!req.xhr) {
        var header;
    	  res.setHeader("Content-Type", "text/html");

    	  fs.readFile('./public/views/Public/Index.tpl', {encoding: 'utf-8'}, function(error, content) {
      		var inside = fs.readFileSync(view, {encoding: 'utf-8'});
          var scr = '';
      		content = content.replace(':startpage:', 'Pocetna');
      		content = content.replace(':starturl:', '/');
      		if (typeof req.session.logged === 'undefined') {
              header = fs.readFileSync('./public/views/Public/not_logged.html', {encoding: 'utf-8'});

      		} else {
              header = fs.readFileSync('./public/views/Public/logged.html', {encoding: 'utf-8'});
      		    if (req.session.logged.level >= 2) {
                scr = '<script type="text/javascrit" src="/js/admin_main.js"></script>';
      		    }
      		}

          content = content.replace(':navbar:', header);
          content = content.replace(':admin_script:', scr);
      		res.send(200, content.replace(':inside_contents:', inside));
    	    });
    	} else {
    	    res.sendfile(view);
    	}
    }
});

server.listen(8080);
console.log('Server started on port 2626');
