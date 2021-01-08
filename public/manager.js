var socket;

$(document).ready(function() {
	socket = io.connect('http://'+location.host);
});

function startGame()
{
	socket.emit('startGame');
}

function restartGame()
{
	socket.emit('restartGame');
}