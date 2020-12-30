$(document).ready(function() {
	var messages = [];
	var socket = io.connect('http://'+location.host);
	var nameButton = document.getElementById("nick");
	var startButton = document.getElementById("startButton");
	var content = document.getElementById("content");
	var name = document.getElementById("name");
	var select = document.getElementById("select");

	socket.on('message', function (data) {
		if(data.message) {
			messages.push(data);
			var html = '';
			for(var i=0; i<messages.length; i++) {
				html += messages[i].message + '<br />';
			}
			content.innerHTML = html;
			$("#content").scrollTop($("#content")[0].scrollHeight);
		} else {
			console.log("There is a problem:", data);
		}
	});

	socket.on('announcement', function (data) {
		announcement.innerHTML = '<b>' + data.message + '</b>';
	});

	socket.on('hideNameField', function (data) {
		name.style.display = 'none';
		nameButton.style.display = 'none';
	});

	socket.on('displayVote', function (data) {
		if (data) {
			selectArea.style.display = 'inline-block';
			votingPlayers.innerHTML = '';
		} else {
			selectArea.style.display = 'none';
			votingPlayers.innerHTML = '';
		}
	});

	socket.on('disableVote', function (data) {
		if (data) {
			select.style.display = 'none';
			vote.style.display = 'none';
		} else {
			select.style.display = 'inline';
			vote.style.display = 'inline';
		}
	});

	socket.on('votingPlayers', function (data) {
		var html = '';
		for (var i = 0; i < data.length; i++) {
			html += '<b>' + data[i] + '</b> votes for <i id="' + data[i] + '_vote"></i><br>';
		}
		votingPlayers.innerHTML = html;
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
		for (var i = 0; i < data.length; i++) {
			var option = document.createElement('option');
			option.value = option.text = data[i];
			select.add(option);
		}
	});

	var blankOption = document.createElement("option");
	blankOption.innerHTML = 'no one';
	blankOption.value = '';
	socket.on('clearTargets', function () {
		select.innerHTML = '';
		select.add(blankOption);
	});

	socket.on('alert', function (data) {
		alert(data.message);
	});

	socket.on('playerList', function (data) {
		var list = $('#player-list');

		document.getElementById("player-list").innerHTML = '';

		for (var i = 0; i < data.length; i++) {
			list.append('<li>' + data[i] + '</li>');
		}
	});

	socket.on('displayRole', function (data) {
		document.getElementById("role").innerHTML = data;
	});

	nameButton.onclick = function() {
		socket.emit('changeNick', name.value);
	};

	startButton.onclick = function() {
		socket.emit('startGame');
	}

	vote.onclick = function() {
		socket.emit('vote', { message: select.value });
	};
});
