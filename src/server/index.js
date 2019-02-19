import SocketIO from 'socket.io';
import express from 'express';
import { join } from 'path';
import http from 'http';

import Box from '../shared/Box';
import { generateTrack } from '../shared/canvas';

const PORT = 1234;

const app = express();
const server = http.createServer(app);
const io = SocketIO(server);

const sendFile = file => (_, res) =>
	res.sendFile(file, { root: join(process.cwd(), 'out') });

app.get('/', sendFile('index.html')).get('/client.js', sendFile('client.js'));

server.listen(PORT);

const users = {};
const points = generateTrack();

io.on('connection', socket => {
	users[socket.id] = new Box(
		socket.id,
		points[0].x,
		points[0].y,
		`hsl(${137.5 * Math.floor(Math.random() * 1000)}deg, 80%, 80%)`,
	);

	socket.broadcast.emit('addUser', users[socket.id]);
	socket.emit('allUsers', Object.values(users));
	socket.emit('points', points);

	socket.on('move', data => {
		users[data.id] = data;
		socket.broadcast.emit('move', data);
	});
	socket.on('disconnect', () => {
		delete users[socket.id];
		socket.broadcast.emit('removeUser', socket.id);
	});
});
