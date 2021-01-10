var state = 0; //-1: starting, 0: not yet started, 1: night, 2: day, 3: finished

var dayStart = false;

var dayDuration = 60;
var nightDuration = 30;

var dayCount = 0;
var nightCount = 0;


function checkVictory () {
	if (state == 1 || state == 2)
	{
		var villageVictory = (io.sockets.clients('mafia').length === 0);
		var mafiaVictory = (io.sockets.clients('mafia') >= io.sockets.clients('village'));
	
		if (villageVictory) {
			endGame('Village');
		} else if (mafiaVictory) {
			endGame('Mafia');
		}
	}
}

function playerDeathCleanup (socket) {
	socket.game_alive = false;
	socket.leave('alive');


	socket.game_role = null;
	socket.leave('village');
	socket.leave('mafia');
	socket.join('spectator');

	socket.emit('ownDeath');
}

function killPlayer (socket) {
	playerDeathCleanup(socket);
	
	updateAlivePlayerList();

	checkVictory();
}

//role definitions, to be moved to a JSON file at some point in the near future
var roles = {
	villager: {
		name: 'villager', //the role's reported name (ex: paranoid cops will still be named 'cop')
		group: 'village', //group players assigned the role are affiliated with
		power: false //does the role have any special actions at nighttime
	},
	cop: {
		name: 'cop',
		group: 'village',
		power: true,
		powerFunc: function (socket, chosenPlayer) { //investigates a player during the night and reports their group affiliation
			socket.emit('message', { message: '<h2>'+'It appears that ' + '<span class="player-nickname">' + chosenPlayer.game_nickname + '</span>' + ' is affiliated with the ' + chosenPlayer.game_role.group + '</h2>'}); 
		}
	},
	doctor: {
		name: 'doctor',
		group: 'village',
		power: true,
		powerFunc: function (socket, chosenPlayer) { //chooses a player to visit during the night to protect from dying overnight
			if (chosenPlayer.game_dying) {
				socket.emit('message', { message: '<h2 class="roleText">' + 'When you open the door to ' + '<span class="player-nickname">' + chosenPlayer.game_nickname + '\'s</span>' + ' house, you see him covered in blood! You quickly patch him up to save his life' + '</h2>'}); 
				chosenPlayer.game_immunity = true;
			} else {
				socket.emit('message', { message: '<h2 class="roleText">' + 'You pay ' + '<span class="player-nickname">' +  chosenPlayer.game_nickname + '</span>'+ ' a visit and find him in perfect health' + '</h2>' }); 
			}
		}
	},
	killer: {
		name: 'killer',
		group: 'mafia',
		power: false
	}
};
//end role definitions


function shuffle (array) {
	var m = array.length, t, i;

	while (m) {
		i = Math.floor(Math.random() * m--);

		t = array[m];
		array[m] = array[i];
		array[i] = t;
	}

	return array;
}


function assignRoles () {
	var players = [];
	io.sockets.clients().forEach(function (socket) {
		if (socket.game_nickname)
		{
			players.push(socket);
		}
		else
		{
			socket.emit('spectatorMode');
		}
	});
	players = shuffle(players);

	var nr = 0;

	for (var i = 1; i <= players.length / 7; i++)
	{
		players[nr].game_alive = true;
		players[nr].join('alive');
		players[nr].game_role = roles['cop'];
		players[nr].join(roles['cop'].group);
		players[nr].emit('message', { message: '<h2 class="roleText">' + 'You are the ' + '<span class="role">' + roles['cop'].name + '</span>' + '</h2>' }); 
		nr++;
	}
	for (var i = 1; i <= players.length / 7; i++)
	{
		players[nr].game_alive = true;
		players[nr].join('alive');
		players[nr].game_role = roles['doctor'];
		players[nr].join(roles['doctor'].group);
		players[nr].emit('message', { message: '<h2 class="roleText">' + 'You are the ' + '<span class="role">' + roles['doctor'].name + '</span>' + '</h2>' }); 
		nr++;
	}

	for (var i = 1; i <= players.length / 3; i++)
	{
		players[nr].game_alive = true;
		players[nr].join('alive');
		players[nr].game_role = roles['killer'];
		players[nr].join(roles['killer'].group);
		players[nr].emit('message', { message: '<h2 class="roleText">' + 'You are the ' + '<span class="role">' + roles['killer'].name + '</span>' + '</h2>' }); 
		nr++;
	}

	while (nr < players.length)
	{
		players[nr].game_alive = true;
		players[nr].join('alive');
		players[nr].game_role = roles['villager'];
		players[nr].join(roles['villager'].group);
		players[nr].emit('message', { message: '<h2 class="roleText">' + 'You are a ' + '<span class="role">' + roles['villager'].name + '</span>' + '</h2>'}); 
		nr++;
	}
}

function endGame (winner) {
	state = 3;
	io.sockets.emit('message', { message: '<h2 class="roleText">' + '<span class="role">' + winner + '</span>'+ ' wins the game!' + '</h2>'}); 
	io.sockets.clients('alive').forEach(function (socket) {
		playerDeathCleanup(socket);
	});
}

function countedVotes (arr) {
	var a = [], b = [], prev;

	arr.sort();
	for (var i = 0; i < arr.length; i++) {
		if (arr[i] !== prev) {
			a.push(arr[i]);
			b.push(1);
		} else {
			b[b.length-1]++;
		}
		prev = arr[i];
	}

	var results = [];

	for (var i = 0; i < a.length; i++) {
		results.push({'username': a[i], 'votes': b[i]});
	}

	results.sort(function (a, b) {
		return (b.votes - a.votes);
	});

	return results; //todo: randomize results if 2 players tie (currently sorts alphabetically)
}

function handleVotes () {
	var votes = [];
	if (state === 1) {
		votingGroup = 'mafia';
	} else {
		votingGroup = 'alive';
	}
	io.sockets.clients(votingGroup).forEach(function (socket) {
		if (!socket.game_vote) {
			votes.push('');
		} else {
			votes.push(socket.game_vote);
		}
	});

	var results = countedVotes(votes);
	if (results[0] && results[0].votes >= ((Math.floor(io.sockets.clients(votingGroup).length / 2)) + 1)) {
		io.sockets.clients().forEach(function (socket) {
			if (socket.game_nickname === results[0].username) {
				socket.game_dying = true;
			} else {
				socket.game_dying = false;
			}
		});
	}
}

function handlePowerVotes () {
	io.sockets.clients('alive').forEach(function (socket) {
		if (socket.game_powerVote && socket.game_role.power && socket.game_nickname != socket.game_powerVote) {
			io.sockets.clients().forEach(function (socket2) {
				if (socket.game_powerVote == socket2.game_nickname && socket2.game_nickname != null) {
					socket.game_role.powerFunc(socket, socket2);
					socket.game_powerVote = null;
				}
			});
		}
	});
}

var endDay = false;
function dayLoop(duration, ticks) {
	var ticksLeft = duration - ticks;
	if (state !== 3 && state !== 0) {
		if (ticksLeft && !endDay) {
			io.sockets.emit('setCountDownTime', { ticks: ticksLeft});

			setTimeout(dayLoop, 1000, duration, ticks + 1);
		} else {
			if (dayCount > 0 || nightCount > 0) {
				handleVotes();
				io.sockets.clients('alive').forEach(function (socket) {
					if (socket.game_dying) {
						io.sockets.emit('message', { message: '<h2 class="roleText">' + '<span class="player-nickname">' + socket.game_nickname + '</span>' + ', the ' +'<span class="role">' + socket.game_role.name +  '</span>' + ', was lynched by the town!' + '</h2>'});
						killPlayer(socket);
					}
				});
			}


			if (state !== 3 && state !== 0) {
				nightCount++;
				io.sockets.emit('dayNight', { dayNight: '<i class="fa fa-moon"></i>'});

				io.sockets.emit('clearTargets');

				var validMafiaTargets = [];
				io.sockets.clients('village').forEach(function (socket) {
					socket.emit('displayVote', false);
					validMafiaTargets.push(socket.game_nickname);
				});

				io.sockets.in('mafia').emit('validTargets', validMafiaTargets);
				updateAlivePlayerList ();

				var powerRoles = io.sockets.clients('alive').filter(function (socket) {
					return socket.game_role.power;
				});

				powerRoles.forEach(function (socket) {
					var validPowerTargets = [];

					io.sockets.clients('alive').forEach(function (socket2) {
						if (socket.game_nickname != socket2.game_nickname) {
							validPowerTargets.push(socket2.game_nickname);
						}
					});

					socket.emit('displayVote', true);
					socket.emit('validTargets', validPowerTargets);
					updateAlivePlayerList ();
				});

				var votingPlayers = [];
				io.sockets.clients('mafia').forEach(function (socket) {
					votingPlayers.push(socket.game_nickname);

					socket.game_hasVoted = false;
					socket.game_hasPowerVoted = false;
					socket.game_vote = null;
				});

				io.sockets.in('mafia').emit('votingPlayers', votingPlayers);

				setTimeout(nightLoop, 1000, nightDuration, 0);
				state = 1;
				endDay = false;
			}
		}
	}
}

function nightLoop(duration, ticks) {
	var ticksLeft = duration - ticks;
	if (state !== 3 && state !== 0) {
		if (ticksLeft && !endDay) {
			io.sockets.emit('setCountDownTime', { ticks: ticksLeft});
			setTimeout(nightLoop, 1000, duration, ticks + 1);
		} else {
			if (dayCount > 0 || nightCount > 0) {
				handleVotes();
				handlePowerVotes();
				io.sockets.clients('alive').forEach(function (socket) {
					if (socket.game_dying) {
						if (socket.game_immunity) {
							socket.emit('message', { message: '<h2 class="roleText">' + 'You wake up covered in bloodied bandages with a horrible headache, remembering nothing of the previous night.' + '</h2>'}); 
								socket.game_dying = false;
						} else {
							io.sockets.emit('message', { message: '<h2 class="roleText">' + '<span class="player-nickname">' + socket.game_nickname + '</span>' + ', the ' +'<span class="role">' + socket.game_role.name +  '</span>' + ', was killed in the night!' + '</h2>'}); 
							killPlayer(socket);
						}
					}
					socket.game_immunity = false; //immunity only lasts the night it is given
				});
			}

			if (state !== 3 && state !== 0) { //surely there's a cleaner way to do this
				dayCount++;
				io.sockets.emit('dayNight', { dayNight: '<i class="fa fa-sun"></i>'});

				io.sockets.in('alive').emit('displayVote', true);

				io.sockets.in('alive').emit('clearTargets');

				var votingPlayers = [];
				io.sockets.clients('alive').forEach(function (socket) {

					votingPlayers.push(socket.game_nickname);

					socket.game_hasVoted = false;
					socket.game_hasPowerVoted = false;
					socket.game_vote = null;
				});

				io.sockets.in('alive').emit('validTargets', votingPlayers);
				updateAlivePlayerList ();
				io.sockets.emit('votingPlayers', votingPlayers);

				setTimeout(dayLoop, 1000, dayDuration, 0);
				state = 2;
				endDay = false;
			}
		}
	}
}

function initialize () {
	assignRoles();

	io.sockets.clients('alive').forEach(function (socket) {
		socket.emit('gameWasStarted');
	}); 

	updateAlivePlayerList();

	if (dayStart) 
	{
		nightLoop(0, 0);
	} 
	else {
		io.sockets.in('mafia').emit('displayVote', true);
		dayLoop(0, 0);
	}
}

var startingCountdownTimer = null;
function startingCountdown (duration, ticks) {
	var validClients = io.sockets.clients();
	validClients = validClients.filter(function (socket) {
		return (socket.game_nickname);
	});
	
	var ticksLeft = duration - ticks;
	if (ticksLeft) 
	{
		io.sockets.emit('message', { message: '<h2 class="roleText">' + 'The '+  '<span class="role">' + 'game' + '</span>' + ' starts in ' + ticksLeft + ' seconds' + '</h2>'});
		startingCountdownTimer = setTimeout(startingCountdown, 1000, duration, ticks + 1);
	} 
	else {
		io.sockets.emit('message', { message: '<h2 class="roleText">' + 'The game is starting now' + '</h2>'});
		initialize();
	}
}

function hasEveryoneVoted () {
	var votedFlag = true;
	if (state === 1) {
		io.sockets.clients('alive').forEach(function (socket) {
			if (socket.game_role.power && !socket.game_hasPowerVoted) {
				votedFlag = false;
			} else if (socket.game_role.group == 'mafia' && !socket.game_hasVoted) {
				votedFlag = false;
			}
		});
	} else if (state === 2) {
		io.sockets.clients('alive').forEach(function (socket) {
			if (!socket.game_hasVoted) {
				votedFlag = false;
			}
		});
	}

	return votedFlag;
}

function updateAlivePlayerList ()
{
	var displayedPlayers = [];

	io.sockets.clients('alive').forEach(function (socket) {
		if (socket.game_nickname != null)
		{
			displayedPlayers.push(socket.game_nickname);
		}
	});

	io.sockets.emit('playerList', displayedPlayers);
}

module.exports = {
	countdownTime: 0, //time before game starts once enough players have joined (in seconds)
	updatePlayers: function() {

		var validClients = io.sockets.clients();

		validClients = validClients.filter(function (socket) {
			return (socket.game_nickname);
		});

		var displayedPlayers = [];
	
		if (state == 0)
		{
			io.sockets.emit('message', { message: '<h2 class="roleText">' + 'We need at least 7 players to start the game' + '</h2>'});

			io.sockets.clients().forEach(function (socket) {
				if (socket.game_nickname != null)
				{
					displayedPlayers.push(socket.game_nickname);
				}
			});

			io.sockets.emit('playerList', displayedPlayers);
		}
		else
		{
			updateAlivePlayerList ();
		}
	},
	startGame: function() {
		var validClients = io.sockets.clients();

		if (state == 0 && validClients.length >= 3)
		{
			state = -1;
			startingCountdownTimer = setTimeout(startingCountdown, 1000, this.countdownTime, 0);
			io.sockets.emit('message', { message: '<h2 class="roleText">' + 'The game was initialized' + '</h2>'}); 
		}
	},
	restartGame: function() {
		state = 0;

		io.sockets.clients().forEach(function (socket) {
			socket.emit("refresh");
		});
	},
	vote: function(socket, data) {
		data.username = socket.game_nickname;

		var isValid = true;
		var clientRooms = io.sockets.manager.roomClients[socket.id];
		if (!socket.game_role.power) {
			if (state === 1 && clientRooms['/mafia']) {
				io.sockets.in('mafia').emit('playerVote', data);
			} else if (state === 2) {
				io.sockets.emit('playerVote', data);
			} else {
				isValid = false;
			}
		} else {
			if (state === 1) {
				socket.game_powerVote = data.message;
			} else if (state === 2) {
				io.sockets.emit('playerVote', data);
			} else {
				isValid = false;
			}
		}

		if (isValid) {
			if (!socket.game_role.power || state === 2) {
				socket.game_vote = data.message; //this will have to be reworked once mafia power roles are introduced
				socket.game_hasVoted = true;
			} else {
				socket.game_hasPowerVoted = true;
			}

			if (hasEveryoneVoted()) {
				endDay = true;
			}
		}
	},
	checkVictory: function() {
		checkVictory();
	},
	state: function() {
		return state;
	},
	announcement: function() {
		return announcement;
	}
};
