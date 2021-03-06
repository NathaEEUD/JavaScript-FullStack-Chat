const Chat = require('./models/chat-model');

module.exports = function (io) {

  let users = {};

  io.on('connect', async (socket) => {
    console.log('New connection', socket.id);

    let messages = await Chat.find({});
    socket.emit('server-load:old-messages', messages);

    socket.on('client-new:user', (data, cb) => {
      if (data in users) {
        cb(false);
      } else {
        cb(true);
        socket.nickname = data;
        users[socket.nickname] = socket;
        updateNicknames();
      }
    })

    socket.on('client-send:message', async (data, cb) => {
      let msg = data.trim();
      if(msg.substr(0, 3) === '/w ') {
        // private message
        msg = msg.substr(3);
        const whiteIndex = msg.indexOf(' ');

        if(whiteIndex !== -1) {
          let name = msg.substr(0, whiteIndex);
          msg = msg.substr(whiteIndex + 1);

          if(name in users) {
            users[name].emit('server-whisper', {
              msg,
              nick: socket.nickname
            });
          } else {
            cb('Error! Please enter a valid user.');
          }
        } else {
          cb('Error! Please enter your message.')
        }
      } else {
        // public message
        let newMsg = new Chat({
          nick: socket.nickname,
          msg
        });
        await newMsg.save();

        io.sockets.emit('server-send:message', {
          msg: data,
          nick: socket.nickname
        });
      }

    })

    socket.on('disconnect', data => {
      if (!socket.nickname) return;
      delete users[socket.nickname];
      updateNicknames();
    })

    function updateNicknames() {
      // Object.keys(users) to assemble a keys array
      io.sockets.emit('server-usernames', Object.keys(users));
    }
  });

}
