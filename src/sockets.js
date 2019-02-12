module.exports = function (io) {

  io.on('connect', (socket) => {
    console.log('New connection', socket.id);

    socket.on('client-send:message', data => {
      io.sockets.emit('server-send:message', data);
    })
  });

}
