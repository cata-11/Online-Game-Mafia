const game = require('./game');

const express = require("express");
const app = express();
const port = 3000;
const http = require("http").createServer();

const io = require('../node_modules/socket.io')(http);

const defaultCountdownTime = 10;
game.countdownTime = defaultCountdownTime;

io.sockets.on('connection', (socket) =>
{
	socket.emit('message', { message: 'Welcome to the lobby.' });
	socket.broadcast.emit('message', { message: 'A new client has connected.' });

	//request announcement and header from the game
	socket.emit('announcement', { message: game.announcement() });
	socket.emit('header', { message: game.header() });

	socket.game_alive = false;

	socket.last_msg_time = Date.now();

	if(!game.state())
	{
		socket.emit('message', { message: 'Please pick a nickname to register as a player.' });
	} 
	else 
	{
		socket.emit('message', { message: 'The game you are trying to join has already started.' });
	}

	socket.on('disconnect', function() {
		if (socket.game_nickname) {
			io.sockets.emit('message', { message: socket.game_nickname + ' has disconnected.' });
		} else {
			io.sockets.emit('message', { message: 'A client has disconnected.' });
		}
	});

	socket.on('vote', function (data) {
		game.vote(socket, data);
	});

	socket.on('setNick', function (data) {
		if (data && !socket.game_nickname) {
			var isUnique = true;
			io.sockets.clients().forEach(function (socket) {
				if (data == socket.game_nickname) { //custom properties prefixed with game_ so as to not cause collisions
					isUnique = false;
				}
			});

			if (isUnique) {
				socket.game_nickname = data;
				socket.emit('hideNameField');
				if(!game.state()){
					game.checkNumPlayers();
				}
			} else {
				socket.emit('alert', { message: 'Nickname is not unique.'});
			}
		} else {
			socket.emit('alert', { message: 'Nickname is not valid.' });
		}
	});
});

http.listen(port, () => {
	console.log("Server started on port " + port);
});