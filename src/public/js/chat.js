$(function () {

  const socket = io();

  // DOM elements nickname form
  const $nickForm = $('#nickForm');
  const $nickname = $('#nickname');
  const $nickError = $('#nickError');

  // DOM elements chat
  const $messageForm = $('#message-form');
  const $messageBox = $('#message');
  const $chat = $('#chat');

  // DOM elements users list
  const $usernames = $('#usernames');

  // emit events
  $nickForm.submit(e => {
    e.preventDefault();
    socket.emit('client-new:user', $nickname.val(), data => {
      if (data) {
        $('#nickWrap').hide();
        $('#contentWrap').show();
      } else {
        $nickError.html(`
          <div class="alert alert-danger">
            That username already exits
          </div>
        `);
      }
      $nickname.val('');
    });
  });

  $messageForm.submit(e => {
    e.preventDefault();
    socket.emit('client-send:message', $messageBox.val(), data => {
      $chat.append(`<p class="error">${data}</p>`);
    });
    $messageBox.val('');
  });

  // listen events
  socket.on('server-usernames', data => {
    let html = '';
    for (let i = 0; i < data.length; i++) {
      html += `<p><i class="fas fa-user"></i> ${data[i]}</p>`
    }

    $usernames.html(html);
  });

  socket.on('server-load:old-messages', data => {
    data.forEach(message => {
      displayMsg(message);
    });
  })

  socket.on('server-send:message', data => {
    displayMsg(data);
  });

  socket.on('server-whisper', data => {
    $chat.append(`<p class="whisper"><b>${data.nick}</b>: ${data.msg}</p>`);
  });

  // functions
  function displayMsg(data) {
    $chat.append('<b>' + data.nick + '</b>: ' + data.msg + '<br/>');
  }
  
})