var socket;

$(document).ready(function() {

	socket = io.connect('http://'+location.host);
	var nameButton = document.getElementById("nick");
	var name = document.getElementById("name");
	var timer = document.getElementById("timeCountDown");
	var dayNight = document.getElementById("dayNight");
	var messages = document.getElementById("serverMessages");
	var validTargets = [];

	var votingPlayers = document.getElementById("player-voter");
	var targetPlayers = document.getElementById("player-target");

	socket.on('message', function (data) {
		if(data.message) 
		{
			messages.innerHTML = data.message;
		} 
		else {
			console.log("There is a problem:", data);
		}
	});

	socket.on('hideNameField', function (data) {
		name.style.display = 'none';
		nameButton.style.display = 'none';

		document.getElementById("umpluturaDeasupra").className += " riseAnimation";
		messages.classList.remove("hidden");
	});

	socket.on('displayVote', function (data) {
		votingPlayers.innerHTML = '';
	});

	socket.on('disableVote', function (data) {
		if (data) {
			vote.style.display = 'none';
		} else {
			vote.style.display = 'inline';
		}
	});

	socket.on('votingPlayers', function (data) {
		var votingPlayersHTML = '';
		var targetPlayersHTML = '';

		for (var i = 0; i < data.length; i++) {
			votingPlayersHTML += '<li class="player">' + data[i] + '</li>';
			targetPlayersHTML += '<li class="player" id="' + data[i] + '_vote"></li>';
		}
		votingPlayers.innerHTML = votingPlayersHTML;
		targetPlayers.innerHTML = targetPlayersHTML;
	});

	socket.on('playerVote', function (data) {
		var element = document.getElementById(data.username + "_vote");
		if (data.message) {
			element.innerHTML = data.message;
		} else {
			element.innerHTML = 'no one';
		}
	});

	socket.on('validTargets', function (data) {
		validTargets = data;
	});

	socket.on('setCountDownTime', function (data) {
		setCountDownTime(data.ticks);
	});

	socket.on('dayNight', function (data) {
		dayNight.innerHTML = data.dayNight;
	});

	socket.on('gameWasStarted', function () {
		timer.classList.remove("hidden");
		dayNight.classList.remove("hidden");
		console.log("da");
	});

	/*
	var blankOption = document.createElement("option");
	blankOption.innerHTML = 'no one';
	blankOption.value = '';

	socket.on('clearTargets', function () {
		select.innerHTML = '';
		select.add(blankOption);
	});
	*/

	socket.on('alert', function (data) {
		alert(data.message);
	});

	socket.on('playerList', function (data) {
		var list = $('#player-list');

		document.getElementById("player-list").innerHTML = '';

		for (var i = 0; i < data.length; i++) 
		{
			var OK = 0;
			for (var j = 0; j < validTargets.length; j++)
			{
				if (validTargets[j] == data[i])
				{
					OK = 1;
				}
			}

			if (OK)
			{
				list.append('<li class="player">' + data[i] + '<span class="iconify voteBtn" data-icon="mdi-vote" data-inline="false" onClick=votePlayer("' + data[i] + '")></span> </li>');
			}
			else
			{
				list.append('<li class="player">' + data[i] + '</li>');
			}
		}
	});

	nameButton.onclick = function() {
		socket.emit('changeNick', name.value);
	};

	//socket.emit('startGame');

});

function votePlayer(playerName)
{
	socket.emit('vote', { message: playerName });
}