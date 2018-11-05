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

  io.emit('message', '一位 Newegger 冲了进来，当前总计有 <font color="red">' + usercount + ' 位</font> Newgger 在线');

  for (let i in messageBox) {
    socket.emit('message', messageBox[i]);
  }

  socket.on("disconnect", function () {
    usercount--;
    io.emit('message', '一位 Newegger 转身离开，当前总计有 <font color="red">' + usercount + ' 位</font> 位 Newgger 在线');
  });

  socket.on('message', function (msg) {
    io.emit('message', msg);
    messageBox.push(msg);
    action(msg, socket);

  });
});

function action(msg, socket) {
  if (msg == '切换电灯1') { const req = http.request({ host: 'localhost', port: 80, path: '/led/switch/1' }); req.end() };
  if (msg == '切换电灯2') { const req = http.request({ host: 'localhost', port: 80, path: '/led/switch/2' }); req.end() };
  if (msg == '切换电灯3') { const req = http.request({ host: 'localhost', port: 80, path: '/led/switch/3' }); req.end() };
  if (msg == '切换电灯') { const req = http.request({ host: 'localhost', port: 80, path: '/led/switch' }); req.end() };
  if (msg == '闪烁') { const req = http.request({ host: 'localhost', port: 80, path: '/led/blink' }); req.end() };
  if (msg == '停止') { const req = http.request({ host: 'localhost', port: 80, path: '/led/stop' }); req.end() };
  if (msg == '拍照') {
    const req = http.request({ host: 'localhost', port: 80, path: '/camera/capture' },
      (res) => {
        res.setEncoding('utf8');
        res.on('data', (data) => {
          socket.emit('message', '<img src="http://localhost/' + JSON.parse(data).url + '" width="200px" />');
        })
      });

    req.end()
  };
}

server.listen(port, function () {
  console.log('listening on *:' + port);
});
