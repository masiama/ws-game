const socket = io('http://localhost:1234');
socket.on('news', data => {
	console.log(data);
});
