const socket = io();
//Elements
const $messageForm = document.querySelector('#msg-form');
const $messageFormInput = document.querySelector('input');
const $messageFormButton = document.querySelector('button');
const $sendLocation = document.querySelector('#send-location');
const $messages = document.querySelector('#messages');

//template
const $messageTemplate = document.querySelector('#message-template').innerHTML;

socket.on('countUpdated', (count) => {
  console.log('the count has been updated   ' + count);
});

socket.on('message', (msg) => {
  console.log(msg);
  const html = Mustache.render($messageTemplate, {
    message: msg,
  });
  $messages.insertAdjacentHTML('beforeend', html);
});

$messageForm.addEventListener('submit', (e) => {
  e.preventDefault();
  $messageFormButton.setAttribute('disabled', 'disabled');

  //disable form
  let msg = e.target.elements.message.value;

  socket.emit('sendMsg', msg, (err) => {
    $messageFormButton.removeAttribute('disabled');
    $messageFormInput.value = '';
    $messageFormInput.focus();

    //enable

    if (err) {
      return console.log(err);
    }
    console.log('msg was deliver');
  });
});

$sendLocation.addEventListener('click', () => {
  if (!navigator.geolocation) {
    return alert('geo location is not supported by user browser');
  }

  $sendLocation.setAttribute('disabled', 'disabled');

  navigator.geolocation.getCurrentPosition((pos) => {
    const obj = { lag: pos.coords.longitude, lat: pos.coords.latitude };
    socket.emit('sendLocation', obj, () => {
      $sendLocation.removeAttribute('disabled');
      console.log('location shared');
    });
  });
});
