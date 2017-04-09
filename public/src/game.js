

var socket = io.connect('https://lit-forest-65459.herokuapp.com/');
var playerId = 0;
var left = 0;
var posTop = 0;
var keyState = [];
socket.on('count', function(data) {
  if (playerId == 0) {
    playerId = data.playerId;
    for (i = 0; i < data.board.length; i++) {
      newPlayerId = data.board[i].playerId;
      div = document.createElement("div");
      div.className = "player";
      div.id = "player" + newPlayerId;
      div.style.position = "absolute";
      div.style.left = data.board[i].left + "px";
      div.style.top = data.board[i].posTop + "px";
      div.style.background = "blue";
      document.body.append(div);
    }
    document.getElementsByClassName("player")[0].id = "player" + playerId;
    document.getElementById("player" + playerId).style.left = left + "px";
    document.getElementById("player" + playerId).style.top = posTop + "px";
    document.getElementById("player" + playerId).style.background = "red";
    socket.emit("move", {posTop: posTop, left: left, playerId: playerId})
  }
})
socket.on('left', function(data) {
  document.body.removeChild(document.getElementById("player" + data.playerId));
})
socket.on('updated', function(data) {
})

socket.on('moved', function(data) {
  console.log(data)
  if (document.getElementById("player" + data.playerId)) {
    move(data.playerId, data.left, data.posTop);
  } else {
    div = document.createElement("div");
    div.className = "player";
    div.id = "player" + data.playerId;
    div.style.position = "absolute";
    div.style.left = data.left + "px";
    div.style.top = data.posTop + "px";
    document.body.append(div);
  }
})

function move(player, x, y) {
  newPlayer = document.getElementById("player" + player);
  newPlayer.style.left = x + "px";
  newPlayer.style.top = y + "px";
}
document.addEventListener("keydown", (e) => {keyState[e.code] = true})
document.addEventListener("keyup", (e) => {keyState[e.code] = false})
setInterval(function() {
  if (keyState["ArrowUp"]) {
    posTop -= 5;
  }
  if (keyState["ArrowDown"]) {
    posTop += 5;
  }
  if (keyState["ArrowRight"]) {
    left += 5;
  }
  if (keyState["ArrowLeft"]) {
    left -= 5;
  }
  socket.emit("move", {posTop: posTop, left: left, playerId: playerId});
}, 50)
