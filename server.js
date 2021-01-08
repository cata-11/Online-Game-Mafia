var express = require("express");
const path = require('path');
var app = express();

var port =  8080;

var game = require('./game');

app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.get('/', function(req, res){
	res.render('index.html');
});

app.get('/manage', function(req, res){
	res.render('manager.html');
});

app.use(express.static(__dirname + '/public'));

global.io = require('socket.io').listen(app.listen(port));
console.log("Listening on port " + port);

game.countdownTime = 10;

io.sockets.on('connection', function (socket) {
	socket.emit('message', { message: 'Welcome to the lobby.' });

	socket.game_alive = false;

	socket.last_msg_time = Date.now();


	if(!game.state()){
		game.updatePlayers();
	} else {
		socket.emit('alert', { message: 'The game you are trying to join has already started.' });
		socket.emit('spectatorMode');
	}
	
	socket.on('startGame', function() {
		game.startGame();
	});

	socket.on('restartGame', function() {
		game.restartGame();
	});

	socket.on('disconnect', function() {

		/*
		if (socket.game_nickname) {
			io.sockets.emit('message', { message: socket.game_nickname + ' has disconnected.' });
		} else {
			io.sockets.emit('message', { message: 'A client has disconnected.' });
		}
		*/

		setTimeout(function() {
			game.updatePlayers();
			game.checkVictory();
		}, 1000);
		
	});

	socket.on('vote', function (data) {
		game.vote(socket, data);
	});

	socket.on('changeNick', function (data) {
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
					game.updatePlayers();
				}
			} else {
				socket.emit('alert', { message: 'Nickname is not unique.'});
			}
		} else {
			socket.emit('alert', { message: 'Nickname is not valid.' });
		}
	});
});
