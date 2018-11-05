var express = require('express');
var path = require('path');
var app = express();
var http = require('http');
var server = http.Server(app)
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

var usercount = 0;
var messageBox = [];

io.on('connection', function (socket) {
  usercount++;
  socket.

  io.emit('join', usercount);
  for (let i in messageBox) {
    socket.emit('message', messageBox[i]);
  }

  socket.on("disconnect", function () {
    usercount--;
    io.emit('left', usercount);
  });

  socket.on('message', function (msg) {
    io.emit('message', msg);
    messageBox.push(msg);
    action(msg);

  });
});

function action(msg) {
  if (msg == '电灯1') { const req = http.request({ host: 'localhost', port: 80, path: '/led/1' }); req.end() };
  if (msg == '电灯2') { const req = http.request({ host: 'localhost', port: 80, path: '/led/2' }); req.end() };
  if (msg == '电灯3') { const req = http.request({ host: 'localhost', port: 80, path: '/led/3' }); req.end() };
}

server.listen(port, function () {
  console.log('listening on *:' + port);
});
