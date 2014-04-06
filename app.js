var express = require('express')
    , app = express()
    , server = require('http').createServer(app)
    , io = require('socket.io').listen(server)
    , nw = require('./nodewhal/nodewhal.js')

server.listen(3000);
console.log('app running at 3000');

app.use('/assets', express.static('assets'));

app.get('/index', function(req, res){
    res.sendfile(__dirname + '/index.html');
});

app.get('/user', function(req, res){
    res.sendfile(__dirname + '/index.html');
});

nw('cool-agent-bro').login('ewok_gtr', 'imaginedragons').then(function(ewok_gtr) {
    return ewok_gtr.get('http://reddit.com/api/random').then(function(url) {console.log(url); return url});
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

