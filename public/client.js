var socket;

$(document).ready(function() {

	socket = io.connect('http://'+location.host);
	var nameButton = document.getElementById("nick");
	var name = document.getElementById("name");
	var timer = document.getElementById("timeCountDown");
	var dayNight = document.getElementById("dayNight");
	var messages = document.getElementById("serverMessages");
	var validTargets = [];
	var ownVotingActive;

	var playersParent = document.getElementById("players-parent");

	socket.on('refresh', function () {
		location.reload(); 
	});

	socket.on('spectatorMode', function () {
		validTargets = [];
		ownVotingActive = false;
		
		name.style.display = 'none';
		nameButton.style.display = 'none';
		messages.classList.remove("hidden");

		document.getElementById("umpluturaDeasupra").className += " riseAnimation";
	});

	socket.on('ownDeath', function () {
		validTargets = [];
		ownVotingActive = false;

		timer.classList.add("hidden");
		dayNight.classList.add("hidden");

		document.getElementById("player-list").innerHTML = '';
		
		playersParent.innerHTML = ' ';
	});

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
		playersParent.innerHTML = '';

		ownVotingActive = data;
	});

	socket.on('disableVote', function (data) {
		if (data) {
			vote.style.display = 'none';
		} else {
			vote.style.display = 'inline';
		}
	});

	socket.on('votingPlayers', function (data) {
		var playersParentHTML = '';
		
		for (var i = 0; i < data.length; i++) {
			let votingPlayersHTML = '<td class="playerVoter">' + data[i] + '</td>';
			let targetPlayersHTML = '<td class="playerVoter" id="' + data[i] + '_vote"></td>';

			playersParentHTML += '<tr class="voters_table">' + votingPlayersHTML + targetPlayersHTML + '</tr>';
		}

		playersParent.innerHTML = playersParentHTML;
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
	});

	socket.on('clearTargets', function () {
		playersParent.innerHTML = ' ';
	});

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

			if (OK && ownVotingActive)
			{
				let clickRoute = `onClick="votePlayer('${data[i]}')"`;
				list.append('<li class="player">' + data[i] + '<span class="iconify voteBtn" data-icon="mdi-vote" data-inline="false" ' + clickRoute + '></span> </li>');
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