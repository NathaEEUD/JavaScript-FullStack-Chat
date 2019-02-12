$(function () {

  const socket = io();

  // DOM elements
  const $messageForm = $('#message-form');
  const $messageBox = $('#message');
  const $chat = $('#chat');

  // emit events
  $messageForm.submit(e => {
    e.preventDefault();
    socket.emit('client-send:message', $messageBox.val());
    $messageBox.val('');
  });

  // listen events
  socket.on('server-send:message', data => {
    $chat.append(data + '<br>');
  })
  
})