'use strict';

require('./config/config.js');
var express = require('express');
var app = express();
var http = require('http');
var socketIo = require('socket.io');

// Create the Http server
var server = http.createServer(app);

var developmentEnv = 'development' === app.get('env');

if (developmentEnv) {
  console.log('Development environment');
  app.configure(function () {
    app.use(express.static(__dirname + '/app'));
    app.use(express.static(__dirname + '/test'));
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  });
} else {
  console.log('Production environment');
  app.configure(function () {
    app.use(express.static(__dirname + '/dist'));
  });
}

// Configure the app
app.configure(function () {
  app.set('port', process.env.PORT || 3000);
  app.use(express.favicon());
  app.use(express.logger());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
});

// Listen io
var io = socketIo.listen(server, { log: developmentEnv });

// The socket io methods.
io.sockets.on('connection', function (socket) {
  socket.on('createHamster', function (data) {
    socket.broadcast.emit('onHamsterCreated', data);
  });

  socket.on('updateHamster', function (data) {
    socket.broadcast.emit('onHamsterUpdated', data);
  });

  socket.on('moveHamster', function (data) {
    socket.broadcast.emit('onHamsterMoved', data);
  });

  socket.on('deleteHamster', function (data) {
    socket.broadcast.emit('onHamsterDeleted', data);
  });
});

server.listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});