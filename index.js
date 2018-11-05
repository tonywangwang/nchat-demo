var express = require('express');
var path = require('path');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;


app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.get('/chat', function (req, res) {
  res.sendFile(__dirname + '/chat.html');
});

var usercount = 0;
io.on('connection', function (socket) {
    usercount++;
   io.emit('join', usercount);

  socket.on("disconnect", function () {
    usercount--;
    console.log('disconnect,login user:', usercount);
    io.emit('left', usercount);
  });
  socket.on('message', function (msg) {
    io.emit('message', msg);
  });
});


http.listen(port, function () {
  console.log('listening on *:' + port);
});
