const path = require('path');
const http = require('http');
const express = require('express');
const socketIo = require('socket.io');
const Filter = require('bad-words');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, '../public');

app.use(express.static(publicDirectoryPath));
let count = 0;

io.on('connection', (socket) => {
  // console.log('new WebSoket connection');
  socket.emit('message', 'welcome!!');

  //broadcast to show new user join except the new user

  socket.broadcast.emit('message', 'new user join');

  socket.on('sendMsg', (msg, callback) => {
    const filter = new Filter();

    if (filter.isProfane(msg)) {
      return callback('Profanity is not allowed');
    }

    io.emit('message', msg);
    callback('Delivered');
  });

  socket.on('sendLocation', (location, cb) => {
    io.emit('message', `https://www.google.com/maps?q=${location.lat},${location.lag}`);
    cb('Location received');
  });

  socket.on('disconnect', () => {
    io.emit('message', 'user disconnect');
  });
});

server.listen(port, () => {
  // console.log('in port', +port);
});
