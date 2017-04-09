var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
  res.render('/index.html');
});

playerCount = 0;
id = 0;
allClients = [];
board = [];
io.on('connection', function (socket) {
  playerCount++;
  id++;
  io.emit('count', { playerCount: playerCount, playerId: id, board: board});
  allClients.push(socket);
  board.push({posTop: 0, left: 0, playerId: id})
  socket.on('disconnect', function () {
    var i = allClients.indexOf(socket);
    playerInd = board[i].playerId;
    board.splice(i, 1);
    allClients.splice(i, 1);
    playerCount--;
    io.emit('left', { playerCount: playerCount, playerId: playerInd});
  });
  socket.on("move", function(data) {
    var i = allClients.indexOf(socket);
    board[i].posTop = data.posTop;
    board[i].left = data.left;
    io.emit('moved', data)
  })
});

server.listen(8080);
console.log("Multiplayer app listening on port 8080");
