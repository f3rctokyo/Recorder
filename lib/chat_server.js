var socketio = require('socket.io');
var io;
var guestnumber = 1;
var nicknames = ;
var namesused = [];
var currentroom = ;

function assignGuestName(socket, guestnumber, nicknames, namesused) {
  var name = 'Guest' + guestnumber;

  nicknames[socket.id] = name;

  socket.emit('nameresult', {
    success: true,
    name: name
  });

  namesused.push(name);

  return guestnumber + 1;
}

function handleClientDisconnection(socket) {
  socket.on('disconnect', function() {
    var nameindex = namesused.indexOf(nicknames[socket.id]);
    delete namesused[nameindex];
    delete nicknames[socket.id];
  });
}

exports.listen = function(server) {
  io = socketio.listen(server);

  io.set('log level', 1);

  io.sockets.on('connection', function(socket) {
    guestnumber = assignGuestName(socket, guestnumber, ?nicknames, namesused);

    socket.on('rooms', function() {
      socket.emit('rooms', io.sockets.manager.rooms);
    });

    handleClientDisconnection(socket, nicknames, namesused);
  });
}
