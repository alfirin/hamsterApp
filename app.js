var express = require('express'),
	app = express(),
	server = require('http').createServer(app),
	io = require('socket.io').listen(server);

app.configure(function() {
    app.use(express.static(__dirname + '/public'));
});

io.sockets.on('connection', function(socket) {
	socket.on('createHamster', function(data) {
		socket.broadcast.emit('onHamsterCreated', data);
	});

	socket.on('updateHamster', function(data) {
		socket.broadcast.emit('onHamsterUpdated', data);
	});

	socket.on('moveHamster', function(data){
		socket.broadcast.emit('onHamsterMoved', data);
	});

	socket.on('deleteHamster', function(data){
		socket.broadcast.emit('onHamsterDeleted', data);
	});
});

// For Heroku port
server.listen(process.env.PORT || 3000);
