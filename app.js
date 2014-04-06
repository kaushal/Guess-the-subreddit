var express = require('express')
    , app = express()
    , server = require('http').createServer(app)
    , io = require('socket.io').listen(server)
    , nw = require('./nodewhal/nodewhal.js')

server.listen(3000);
console.log('app running at 3000');

/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', function(req, res) {
  res.sendfile(__dirname + "/views/index.html");
});

app.get('/mobile', function(req, res) {
  res.sendfile(__dirname + "/views/mobile.html");
});

nw('cool-agent-bro').login('ewok_gtr', 'imaginedragons').then(function(ewok_gtr) {
    return ewok_gtr.get('http://www.reddit.com/r/funny/new.json?sort=new&limit=100').then(function(url) {
        choice = null;
        url.data.children.some(function(value, element, array) {
			  if (value.kind != "t3") return false;
			  if (value.data.over_18 == true) return false;
			  console.log(value.data.url);
			  if (/jpg$|png$|gif$/.test(value.data.url)) {
				  choice = value;
				  return true;
			  }
			  return false;

			});
		  ewok_gtr.get('http://www.reddit.com/api/recommend/sr/'+choice.data.subreddit).then(function(options) {
			  console.log(options);
			  return options;
			});
			  console.log(choice);
			  return choice;
   });
});


var scores = [0, 0, 0, 0];
var total = 0;
io.sockets.on('connection', function(socket) {
    socket.on('vote', function(data) {
        scores[data['vote']]++;
        total++;
        io.sockets.emit('update', {'scores': scores, 'total': total});
    });

    socket.on('getQuestion', function(){
        var redditObj = {};


        io.sockets.emit('newQuestion', redditObj);
    });
});

