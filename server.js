var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.send('<h1>Hello world</h1>');
});

io.on('connection', function(socket){
  socket.on('endTurn', function() {
    socket.broadcast.emit('endTurn');
  });
  socket.on('guess', function(groupedWord) {
    socket.broadcast.emit('guess', groupedWord);
  });
  socket.on('newGame', function(groupedWords) {
    socket.broadcast.emit('newGame', groupedWords);
  });
  socket.on('joiningGame', function(gameData, newPlayerID) {
    socket.to(newPlayerID).emit('joiningGame', gameData);
  });
  io.clients((error, clients) => {
    if (error) {
      throw error;
    }
    if (clients.length === 1) {
      socket.emit('createNewGame');
    } else {
      const activePlayerID = clients[0] !== socket.id ? clients[0] : clients[1];
      socket.to(activePlayerID).emit('needGameData', socket.id);
    }
  });
});

http.listen(3001, function(){
  console.log('listening on *:3001');
});
