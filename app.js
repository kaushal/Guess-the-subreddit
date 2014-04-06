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

var path = require('path');


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

var votedPeople = [];
var currentQuestion = {};
var red = {};
var opts = {};
function reddit() {
    nw('cool-agent-bro').login('ewok_gtr', 'imaginedragons').then(function(ewok_gtr) {
        return ewok_gtr.get('http://www.reddit.com/r/funny/new.json?sort=new&limit=100').then(function(url) {
            choice = null;
            url.data.children.some(function(value, element, array) {
                  if (value.kind != "t3") return false;
                  if (value.data.over_18 == true) return false;
                  console.log(value.data.url);
                  if (/jpg$|png$|gif$/.test(value.data.url)) {
                      red = value;
                      return true;
                  }
                  return false;
                });
                ewok_gtr.get('http://www.reddit.com/api/recommend/sr/'+red.data.subreddit).then(function(options) {
                    opts = options;
            });
            return choice;
        });
    });
}

reddit();

var scores = [0, 0, 0, 0];
var total = 0;
io.sockets.on('connection', function(socket) {
    socket.on('vote', function(data) {
        if (votedPeople.indexOf(socket.id) == -1) {
            votedPeople.push(socket.id);
            console.log(socket.id);
            scores[data['vote']]++;
            total++;
            io.sockets.emit('update', {'scores': scores, 'total': total});
        }
    });

    socket.on('currentQuestion', function(){
        socket.emit('question', currentQuestion);
    });

    socket.on('getQuestion', function(){
        var redditObj = {};
        redditObj['title'] = red.data.children[0].title;
        redditObj['image'] = red.data.children[0].url;
        redditObj['answers'] = ['test', 'test 2', 'test 3', 'test 4'];
        redditObj['correct'] = 3;
        currentQuestion = redditObj;
        io.sockets.emit('newQuestion', redditObj);
        reddit();

        votedPeople = [];
        scores = [0, 0, 0, 0];
        total = 0;
    });
});

