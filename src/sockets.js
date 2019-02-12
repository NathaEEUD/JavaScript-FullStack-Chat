module.exports = function (io) {
  io.on('connect', (socket) => {
    console.log('New connection', socket.id);
  });
}
